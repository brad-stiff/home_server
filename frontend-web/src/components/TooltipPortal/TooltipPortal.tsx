import { createPortal } from "react-dom";
import type { ReactNode } from "react";

type TooltipPortalProps = {
  children: ReactNode
}

export function TooltipPortal({ children }: TooltipPortalProps) {
  return createPortal(children, document.body);
}
