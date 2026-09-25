// Ported from the food-steam-animator tool.
// Self-contained canvas 2D particle engine that renders rising, swirling
// steam/vapor puffs + tendrils above one or more "emitter" points.

export type HeatLevel = "gentle" | "warm" | "piping" | "sizzling" | "off";
export type TemperatureTint = "warm" | "neutral" | "golden" | "ethereal";

export interface SteamConfig {
  heatLevel: HeatLevel;
  density: number; // 0.2 to 2.5
  speed: number; // 0.3 to 2.5
  wind: number; // -2 to 2 (negative = drift left, positive = drift right)
  turbulence: number; // 0.5 to 3.0
  dispersion: number; // 0.5 to 2.0
  opacity: number; // 0.2 to 1.0
  temperatureTint: TemperatureTint;
  heatHaze: boolean;
  tendrilsEnabled: boolean;
  interactiveSwirl: boolean;
}

export interface EmitterPoint {
  id: string;
  x: number; // 0 to 100 (% of width)
  y: number; // 0 to 100 (% of height)
  intensity: number; // 0 to 1
  radius: number; // spread in px
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseVy: number;
  scale: number;
  maxScale: number;
  rotation: number;
  vRot: number;
  age: number;
  maxAge: number;
  opacityMultiplier: number;
  spriteIndex: number;
  seed: number;
  wobbleSpeed: number;
  emitterId: string;
}

interface TendrilPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Tendril {
  emitterId: string;
  points: TendrilPoint[];
  phase: number;
  speed: number;
  amplitude: number;
  width: number;
  alpha: number;
}

const TINT_COLORS: Record<TemperatureTint, { r: number; g: number; b: number }> = {
  warm: { r: 255, g: 247, b: 238 },
  neutral: { r: 242, g: 246, b: 252 },
  golden: { r: 255, g: 240, b: 215 },
  ethereal: { r: 228, g: 244, b: 255 },
};

const HEAT_LEVEL_MULTIPLIERS: Record<HeatLevel, { density: number; speed: number; scale: number }> = {
  off: { density: 0, speed: 0, scale: 0 },
  gentle: { density: 0.45, speed: 0.65, scale: 0.75 },
  warm: { density: 0.8, speed: 0.9, scale: 0.9 },
  piping: { density: 1.25, speed: 1.2, scale: 1.1 },
  sizzling: { density: 1.85, speed: 1.6, scale: 1.35 },
};

export class SteamEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private tendrils: Tendril[] = [];
  private sprites: HTMLCanvasElement[] = [];
  private width = 800;
  private height = 500;
  private animationFrameId: number | null = null;
  private lastTime = 0;
  private emitAccumulator = 0;

  private mouse = { x: -1000, y: -1000, vx: 0, vy: 0, isHovering: false, lastMoveTime: 0 };
  private config: SteamConfig;
  private emitters: EmitterPoint[] = [];

  constructor(canvas: HTMLCanvasElement, initialConfig: SteamConfig, initialEmitters: EmitterPoint[]) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Could not get 2d context");
    this.ctx = ctx;
    this.config = initialConfig;
    this.emitters = initialEmitters;

    this.initSprites();
    this.initTendrils();
    this.handleResize();
  }

  public setConfig(config: SteamConfig) {
    const tintChanged = this.config.temperatureTint !== config.temperatureTint;
    this.config = config;
    if (tintChanged) {
      this.initSprites();
    }
  }

  public setEmitters(emitters: EmitterPoint[]) {
    this.emitters = emitters;
    this.initTendrils();
  }

  public setMousePosition(x: number, y: number, isHovering: boolean) {
    const now = performance.now();
    const dt = Math.max(16, now - this.mouse.lastMoveTime);
    if (this.mouse.isHovering && isHovering) {
      this.mouse.vx = (x - this.mouse.x) / (dt / 16);
      this.mouse.vy = (y - this.mouse.y) / (dt / 16);
    } else {
      this.mouse.vx = 0;
      this.mouse.vy = 0;
    }
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.isHovering = isHovering;
    this.mouse.lastMoveTime = now;
  }

  public fanBurst(strength = 1.0) {
    for (const p of this.particles) {
      p.vx += (Math.random() - 0.5) * 8 * strength + (this.config.wind >= 0 ? 3 : -3);
      p.vy -= (1.5 + Math.random() * 2) * strength;
      p.vRot += (Math.random() - 0.5) * 0.08 * strength;
    }
  }

  public handleResize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = Math.max(300, rect.width);
    this.height = Math.max(200, rect.height);

    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    this.ctx.scale(dpr, dpr);
  }

  private initSprites() {
    this.sprites = [];
    const tint = TINT_COLORS[this.config.temperatureTint] || TINT_COLORS.golden;
    const sizes = [128, 160, 192];

    for (let i = 0; i < sizes.length; i++) {
      const size = sizes[i]!;
      const offscreen = document.createElement("canvas");
      offscreen.width = size;
      offscreen.height = size;
      const octx = offscreen.getContext("2d");
      if (!octx) continue;

      const center = size / 2;
      const radius = size / 2;
      const grad = octx.createRadialGradient(center, center, 0, center, center, radius);

      if (i === 0) {
        grad.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.35)`);
        grad.addColorStop(0.25, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.22)`);
        grad.addColorStop(0.55, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.08)`);
        grad.addColorStop(0.85, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.015)`);
        grad.addColorStop(1, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0)`);
      } else if (i === 1) {
        grad.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.42)`);
        grad.addColorStop(0.2, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.25)`);
        grad.addColorStop(0.5, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.1)`);
        grad.addColorStop(0.8, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.02)`);
        grad.addColorStop(1, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0)`);
      } else {
        grad.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.28)`);
        grad.addColorStop(0.35, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.14)`);
        grad.addColorStop(0.7, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0.035)`);
        grad.addColorStop(1, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0)`);
      }

      octx.fillStyle = grad;
      octx.beginPath();
      octx.arc(center, center, radius, 0, Math.PI * 2);
      octx.fill();

      this.sprites.push(offscreen);
    }
  }

  private initTendrils() {
    this.tendrils = [];
    const activeEmitters = this.emitters.slice(0, 4);
    for (let i = 0; i < activeEmitters.length; i++) {
      const emitter = activeEmitters[i]!;
      const points: TendrilPoint[] = [];
      const numPoints = 14;
      const ex = (emitter.x / 100) * this.width;
      const ey = (emitter.y / 100) * this.height;

      for (let j = 0; j < numPoints; j++) {
        points.push({
          x: ex + (Math.random() - 0.5) * 6,
          y: ey - j * 18,
          vx: 0,
          vy: -1.2,
        });
      }

      this.tendrils.push({
        emitterId: emitter.id,
        points,
        phase: Math.random() * Math.PI * 2,
        speed: 0.8 + Math.random() * 0.6,
        amplitude: 12 + Math.random() * 12,
        width: 14 + Math.random() * 10,
        alpha: 0.18 + Math.random() * 0.12,
      });
    }
  }

  public start() {
    if (this.animationFrameId !== null) return;
    this.lastTime = performance.now();
    const loop = (time: number) => {
      const dt = Math.min((time - this.lastTime) / 1000, 0.05);
      this.lastTime = time;
      this.update(dt, time);
      this.render();
      this.animationFrameId = requestAnimationFrame(loop);
    };
    this.animationFrameId = requestAnimationFrame(loop);
  }

  public stop() {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  private update(dt: number, time: number) {
    const heatMult = HEAT_LEVEL_MULTIPLIERS[this.config.heatLevel] || HEAT_LEVEL_MULTIPLIERS.piping;

    this.mouse.vx *= 0.88;
    this.mouse.vy *= 0.88;

    if (heatMult.density > 0 && this.config.density > 0 && this.emitters.length > 0) {
      const emitRate = 55 * heatMult.density * this.config.density;
      this.emitAccumulator += emitRate * dt;

      while (this.emitAccumulator >= 1) {
        this.emitAccumulator -= 1;
        this.spawnParticle(heatMult);
      }
    }

    const windForce = this.config.wind * 45;
    const turbSpeed = this.config.turbulence;
    const globalSpeedMult = this.config.speed * heatMult.speed;
    const naturalWaft = Math.sin(time * 0.0012) * 12;

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i]!;
      p.age += dt;

      if (p.age >= p.maxAge) {
        this.particles.splice(i, 1);
        continue;
      }

      const lifeProgress = p.age / p.maxAge;

      const wave1 = Math.sin(time * 0.002 * turbSpeed + p.y * 0.008 + p.seed);
      const wave2 = Math.cos(time * 0.003 * turbSpeed + p.x * 0.006 + p.seed * 1.5);
      const curlX = (wave1 * 26 + wave2 * 14) * turbSpeed;
      const curlY = Math.sin(time * 0.0018 + p.x * 0.005) * 8;

      if (this.config.interactiveSwirl && this.mouse.isHovering) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const distSq = dx * dx + dy * dy;
        const radius = 130;
        if (distSq < radius * radius && distSq > 4) {
          const dist = Math.sqrt(distSq);
          const force = 1 - dist / radius;
          p.vx += (dx / dist) * 18 * force + this.mouse.vx * 1.8 * force;
          p.vy += (dy / dist) * 14 * force + this.mouse.vy * 1.8 * force - 5 * force;
          p.vRot += this.mouse.vx * 0.02 * force;
        }
      }

      p.vx *= 0.94;
      p.vy = p.baseVy * globalSpeedMult * (1.1 - lifeProgress * 0.4);

      p.x += (p.vx + (windForce + naturalWaft + curlX) * dt * 0.9) * (0.8 + lifeProgress * 0.4);
      p.y += (p.vy + curlY * dt) * (dt * 60);

      p.scale += (p.maxScale - p.scale) * dt * 0.8;
      p.rotation += p.vRot;
    }

    if (this.particles.length > 400) {
      this.particles.splice(0, this.particles.length - 400);
    }

    if (this.config.tendrilsEnabled && heatMult.density > 0) {
      this.updateTendrils(dt, time, windForce + naturalWaft, heatMult);
    }
  }

  private spawnParticle(heatMult: { density: number; speed: number; scale: number }) {
    const emitter = this.emitters[Math.floor(Math.random() * this.emitters.length)];
    if (!emitter) return;

    const baseEx = (emitter.x / 100) * this.width;
    const baseEy = (emitter.y / 100) * this.height;
    const spread = (emitter.radius || 35) * this.config.dispersion;

    const angle = Math.random() * Math.PI * 2;
    const dist = Math.random() * spread;
    const startX = baseEx + Math.cos(angle) * dist;
    const startY = baseEy + Math.sin(angle) * (dist * 0.45);

    const speedBase = -(1.2 + Math.random() * 1.8) * heatMult.speed * this.config.speed;
    const maxAge = (2.2 + Math.random() * 1.8) / Math.max(0.6, this.config.speed);

    this.particles.push({
      x: startX,
      y: startY,
      vx: (Math.random() - 0.5) * 1.2,
      vy: speedBase,
      baseVy: speedBase,
      scale: (0.28 + Math.random() * 0.22) * heatMult.scale,
      maxScale: (1.4 + Math.random() * 1.6) * heatMult.scale,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.018,
      age: 0,
      maxAge,
      opacityMultiplier: (0.65 + Math.random() * 0.35) * emitter.intensity,
      spriteIndex: Math.floor(Math.random() * Math.max(1, this.sprites.length)),
      seed: Math.random() * 100,
      wobbleSpeed: 0.8 + Math.random() * 0.8,
      emitterId: emitter.id,
    });
  }

  private updateTendrils(dt: number, time: number, wind: number, heatMult: { speed: number }) {
    for (const t of this.tendrils) {
      const emitter = this.emitters.find((e) => e.id === t.emitterId) || this.emitters[0];
      if (!emitter) continue;

      const baseEx = (emitter.x / 100) * this.width;
      const baseEy = (emitter.y / 100) * this.height;

      if (t.points[0]) {
        t.points[0].x = baseEx;
        t.points[0].y = baseEy;
      }

      for (let j = 1; j < t.points.length; j++) {
        const pt = t.points[j]!;
        const prev = t.points[j - 1]!;
        const segRatio = j / t.points.length;

        const wave = Math.sin(time * 0.003 * t.speed + j * 0.6 + t.phase) * t.amplitude * segRatio;
        const targetX = prev.x + wind * 0.035 * j + wave;
        const targetY = baseEy - j * (22 * heatMult.speed);

        pt.x += (targetX - pt.x) * (dt * 12);
        pt.y += (targetY - pt.y) * (dt * 12);
      }
    }
  }

  private render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    if (this.config.heatLevel === "off" || this.config.opacity <= 0) {
      return;
    }

    const tint = TINT_COLORS[this.config.temperatureTint] || TINT_COLORS.golden;

    if (this.config.tendrilsEnabled && this.tendrils.length > 0) {
      this.ctx.save();
      for (const t of this.tendrils) {
        if (t.points.length < 3) continue;

        const firstPt = t.points[0]!;
        const lastPt = t.points[t.points.length - 1]!;

        const grad = this.ctx.createLinearGradient(firstPt.x, firstPt.y, lastPt.x, lastPt.y);
        const baseAlpha = t.alpha * this.config.opacity;
        grad.addColorStop(0, `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${baseAlpha * 1.2})`);
        grad.addColorStop(0.35, `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${baseAlpha})`);
        grad.addColorStop(0.7, `rgba(${tint.r}, ${tint.g}, ${tint.b}, ${baseAlpha * 0.45})`);
        grad.addColorStop(1, `rgba(${tint.r}, ${tint.g}, ${tint.b}, 0)`);

        this.ctx.beginPath();
        this.ctx.moveTo(firstPt.x, firstPt.y);

        for (let j = 1; j < t.points.length - 1; j++) {
          const cur = t.points[j]!;
          const next = t.points[j + 1]!;
          const xc = (cur.x + next.x) / 2;
          const yc = (cur.y + next.y) / 2;
          this.ctx.quadraticCurveTo(cur.x, cur.y, xc, yc);
        }

        this.ctx.strokeStyle = grad;
        this.ctx.lineWidth = t.width * (0.8 + this.config.density * 0.3);
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
        this.ctx.filter = "blur(6px)";
        this.ctx.stroke();
      }
      this.ctx.restore();
    }

    this.ctx.save();
    this.ctx.globalCompositeOperation = "screen";

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i]!;
      const sprite = this.sprites[p.spriteIndex];
      if (!sprite) continue;

      const progress = p.age / p.maxAge;

      let alpha = 0;
      if (progress < 0.18) {
        alpha = progress / 0.18;
      } else {
        const remaining = (1 - progress) / 0.82;
        alpha = Math.pow(remaining, 1.4);
      }

      alpha *= p.opacityMultiplier * this.config.opacity * 0.85;

      if (alpha <= 0.005) continue;

      this.ctx.save();
      this.ctx.globalAlpha = alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);

      const drawSize = sprite.width * p.scale;
      this.ctx.drawImage(sprite, -drawSize / 2, -drawSize / 2, drawSize, drawSize);
      this.ctx.restore();
    }

    this.ctx.restore();
  }

  public destroy() {
    this.stop();
    this.particles = [];
    this.tendrils = [];
  }
}
