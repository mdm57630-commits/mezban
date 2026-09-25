import { useEffect, useState, type MouseEvent, type ReactNode } from "react";

import "./GooeyButton.css";

type GooeyButtonProps = {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
};

export function GooeyButton({ href, children, className = "", target, rel }: GooeyButtonProps) {
  const [burst, setBurst] = useState(0);

  useEffect(() => {
    if (!burst) return;
    const timeout = window.setTimeout(() => setBurst(0), 900);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    setBurst((current) => current + 1);
    event.currentTarget.blur();
  };

  return (
    <a
      className={`gooey-button ${className}`.trim()}
      href={href}
      target={target}
      rel={rel}
      onClick={handleClick}
    >
      <span className="gooey-button-label">{children}</span>
      <span className="gooey-button-burst" aria-hidden="true" key={burst}>
        {Array.from({ length: 10 }, (_, index) => (
          <span
            className="gooey-button-particle"
            key={index}
            style={{ "--particle-angle": `${index * 36}deg` } as React.CSSProperties}
          />
        ))}
      </span>
    </a>
  );
}
