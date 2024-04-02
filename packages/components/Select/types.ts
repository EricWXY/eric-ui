import type { VNode } from "vue";

export type RenderLabelFunc = (option: SelectOptionProps) => VNode | string;
export type CustomFilterFunc = (value: string) => SelectOptionProps[];
export type CustomFilterRemoteFunc = (
  value: string
) => Promise<SelectOptionProps[]>;

export interface SelectOptionProps {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  modelValue: string;
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
  selectedOption: SelectOptionProps | undefined | null;
  mouseHover: boolean;
  loading: boolean;
}

export interface SelectEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "visible-change", vlaue: boolean): void;

  (e: "clear"): void;
}

export interface SleectContext {
  handleSelect: (item: SelectOptionProps) => void;
  selectStates: SelectStates;
  renderLabel?: RenderLabelFunc;
}
