import { useEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from "react";

import "./GooeyNav.css";

export type GooeyNavItem = {
  label: string;
  href: string;
};

type GooeyNavProps = {
  items: GooeyNavItem[];
  animationTime?: number;
  particleCount?: number;
  particleDistances?: [number, number];
  particleR?: number;
  timeVariance?: number;
  colors?: number[];
  initialActiveIndex?: number;
};

export function GooeyNav({
  items,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
  initialActiveIndex = 0,
}: GooeyNavProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const filterRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const [activeIndex, setActiveIndex] = useState(initialActiveIndex);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance: number, pointIndex: number, totalPoints: number) => {
    const angle = ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i: number, time: number) => {
    const rotate = noise(particleR / 10);
    return {
      start: getXY(particleDistances[0], particleCount - i, particleCount),
      end: getXY(particleDistances[1] + noise(7), particleCount - i, particleCount),
      time,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + particleR / 20) * 10 : (rotate - particleR / 20) * 10,
    };
  };

  const makeParticles = (element: HTMLSpanElement) => {
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i += 1) {
      const time = animationTime * 2 + noise(timeVariance * 2);
      const particleData = createParticle(i, time);
      element.classList.remove("active");

      window.setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.className = "particle";
        particle.style.setProperty("--start-x", `${particleData.start[0]}px`);
        particle.style.setProperty("--start-y", `${particleData.start[1]}px`);
        particle.style.setProperty("--end-x", `${particleData.end[0]}px`);
        particle.style.setProperty("--end-y", `${particleData.end[1]}px`);
        particle.style.setProperty("--time", `${particleData.time}ms`);
        particle.style.setProperty("--scale", `${particleData.scale}`);
        particle.style.setProperty("--color", `var(--color-${particleData.color}, white)`);
        particle.style.setProperty("--rotate", `${particleData.rotate}deg`);

        point.className = "point";
        particle.appendChild(point);
        element.appendChild(particle);
        requestAnimationFrame(() => element.classList.add("active"));

        window.setTimeout(() => {
          if (element.contains(particle)) element.removeChild(particle);
        }, time);
      }, 30);
    }
  };

  const updateEffectPosition = (element: Element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();
    const styles = {
      left: `${elementRect.x - containerRect.x}px`,
      top: `${elementRect.y - containerRect.y}px`,
      width: `${elementRect.width}px`,
      height: `${elementRect.height}px`,
    };

    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.textContent ?? "";
  };

  const handleClick = (event: MouseEvent<HTMLAnchorElement>, index: number) => {
    const link = event.currentTarget;
    if (activeIndex === index) return;

    setActiveIndex(index);
    updateEffectPosition(link);

    if (filterRef.current) {
      filterRef.current.querySelectorAll(".particle").forEach((particle) => particle.remove());
      makeParticles(filterRef.current);
    }

    if (textRef.current) {
      textRef.current.classList.remove("active");
      void textRef.current.offsetWidth;
      textRef.current.classList.add("active");
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLAnchorElement>, index: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      event.currentTarget.click();
      setActiveIndex(index);
    }
  };

  useEffect(() => {
    if (!navRef.current || !containerRef.current) return;

    const updateActivePosition = () => {
      const activeItem = navRef.current?.querySelectorAll("li")[activeIndex];
      if (activeItem) updateEffectPosition(activeItem);
    };

    updateActivePosition();
    textRef.current?.classList.add("active");

    const resizeObserver = new ResizeObserver(updateActivePosition);
    resizeObserver.observe(containerRef.current);
    window.addEventListener("resize", updateActivePosition);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", updateActivePosition);
    };
  }, [activeIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav ref={navRef} aria-label="Main navigation">
        <ul>
          {items.map((item, index) => (
            <li key={item.href} className={activeIndex === index ? "active" : undefined}>
              <a
                href={item.href}
                onClick={(event) => handleClick(event, index)}
                onKeyDown={(event) => handleKeyDown(event, index)}
                aria-current={activeIndex === index ? "page" : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} aria-hidden="true" />
      <span className="effect text" ref={textRef} aria-hidden="true" />
    </div>
  );
}
