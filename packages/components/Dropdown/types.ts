import type { VNode, ComputedRef } from "vue";
import type { TooltipProps } from "../Tooltip/types";
import type { ButtonType, ButtonSize } from "../Button/types";

export type DropdownCommand = string | number;

export interface DropdownItemProps {
  command?: DropdownCommand;
  label?: string | VNode;
  disabled?: boolean;
  divided?: boolean;
}

export interface DropdownProps extends TooltipProps {
  type?: ButtonType;
  size?: ButtonSize;
  items?: DropdownItemProps[];
  hideOnClick?: boolean;
  splitButton?: boolean;
}

export interface DropdownEmits {
  (e: "visible-change", value: boolean): void;
  (e: "command", value: DropdownCommand): void;
  (e: "click", value: MouseEvent): void;
}

export interface DropdownInstance {
  open(): void;
  close(): void;
}

export interface DropdownContext {
  handleItemClick(item: DropdownItemProps): void;
  size: ComputedRef<ButtonSize | void>;
}
