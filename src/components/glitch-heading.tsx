import type { ReactNode } from "react";

type GlitchHeadingProps = {
  as?: "h1" | "h2" | "h3";
  children: ReactNode;
  className?: string;
};

export function GlitchHeading({ as: Tag = "h1", children, className = "" }: GlitchHeadingProps) {
  return (
    <Tag className={`glitch-heading ${className}`.trim()}>
      {children}
    </Tag>
  );
}
