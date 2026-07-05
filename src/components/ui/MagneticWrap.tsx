import { cloneElement, isValidElement, type ReactElement, type Ref } from "react";
import { useMagnetic } from "../../hooks/useMagnetic";

interface MagneticWrapProps {
  strength?: number;
  children: ReactElement<{ ref?: Ref<HTMLElement> }>;
}

export function MagneticWrap({ strength = 0.35, children }: MagneticWrapProps) {
  const ref = useMagnetic<HTMLElement>({ strength });

  if (!isValidElement(children)) return children;

  return cloneElement(children, { ref });
}
