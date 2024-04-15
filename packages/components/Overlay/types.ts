export interface OverlayProps {
  mask?: boolean;
  zIndex?: number;
  overlayClass?: string | string[] | Record<string, boolean>;
}

export interface OverlayEmits {
  (e: "click", value: MouseEvent): void;
}
