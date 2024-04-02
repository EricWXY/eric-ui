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
}

export interface SelectStates {
  inputValue: string;
  selectedOption: SelectOptionProps | undefined | null;
}

export interface SelectEmits {
  (e: "update:modelValue", value: string): void;
  (e: "change", value: string): void;
  (e: "visible-change", vlaue: boolean): void;
}

export interface SleectContext {
  handleItemSelect: (item: SelectOptionProps) => void;
  selectStates: SelectStates;
}
