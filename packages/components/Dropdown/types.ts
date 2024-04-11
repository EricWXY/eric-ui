import type { VNode } from "vue";
import type { TooltipProps } from "../Tooltip/types";

export interface DropdownItemProps {
  command?: string | number;
  label?: string | VNode;
  disabled?: boolean;
  divided?: boolean;
}

export interface DropdownProps extends TooltipProps {
  items?: DropdownItemProps[];
  hideOnClick?: boolean;
}

export interface DropdownEmits {
  (e: "visible-change", value: boolean): void;
  (e: "command", value: DropdownItemProps["command"]): void;
}

export interface DropdownInstance {
  open(): void;
  close(): void;
}

export interface DropdownContext {
  handleItemClick(item: DropdownItemProps): void;
}
