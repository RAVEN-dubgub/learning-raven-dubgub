import type { ReactNode } from "react";

type NexusPanelProps = {
  children: ReactNode;
  className?: string;
};

export function NexusPanel({ children, className = "" }: NexusPanelProps) {
  return <div className={`nexus-panel ${className}`.trim()}>{children}</div>;
}
