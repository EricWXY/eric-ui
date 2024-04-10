import type { VNode, ComputedRef } from "vue";

export type RenderLabelFunc = (option: SelectOptionProps) => VNode | string;
export type CustomFilterFunc = (value: string) => SelectOptionProps[];
export type CustomFilterRemoteFunc = (
  value: string
) => Promise<SelectOptionProps[] | void>;

export interface SelectOptionProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue: string;
  id?: string;
  options?: SelectOptionProps[];
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  renderLabel?: RenderLabelFunc;
  filterable?: boolean;
  filterMethod?: CustomFilterFunc;
  remote?: boolean;
  remoteMethod?: CustomFilterRemoteFunc;
}

export interface SelectStates {
  inputValue: string;
  selectedOption: SelectOptionProps | void | null;
  mouseHover: boolean;
  loading: boolean;
  highlightedIndex: number;
}

export interface SelectEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "visible-change", vlaue: boolean): void;

  (e: "clear"): void;
  (e: "focus"): void;
  (e: "blur"): void;
}

export interface SelectContext {
  selectStates: SelectStates;
  renderLabel?: RenderLabelFunc;
  highlightedLine?: ComputedRef<SelectOptionProps | void>;
  handleSelect(item: SelectOptionProps): void;
}

export interface SelectInstance {
  focus(): void;
  blur(): void;
}
