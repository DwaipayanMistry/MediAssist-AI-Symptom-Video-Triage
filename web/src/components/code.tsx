import { type JSX } from "react";

export function Code({
  children,
  // className,
}: {
  children: React.ReactNode;
  // className?: string;
}): JSX.Element {
  return <code className="bg-amber-600">{children}</code>;
}
