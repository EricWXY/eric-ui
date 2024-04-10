import type { Ref } from "vue";
export interface InputProps {
  id?: string;
  modelValue: string;
  type?: string;
  size?: "large" | "small";
  disabled?: boolean;
  clearable?: boolean;
  showPassword?: boolean;

  placeholder?: string;
  readonly?: boolean;
  autocomplete?: string;
  autofocus?: boolean;

  form?: string;
}

export interface InputEmits {
  (e: "update:modelValue", value: string): void;

  (e: "input", value: string): void;
  // 修改值且 失去焦点 才触发'change'
  (e: "change", value: string): void;
  (e: "focus", value: FocusEvent): void;
  (e: "blur", value: FocusEvent): void;
  (e: "clear"): void;
}

export interface InputInstance {
  ref: Ref<HTMLInputElement | HTMLTextAreaElement | void>;
  focus(): Promise<void>;
  blur(): void;
  select(): void;
  clear(): void;
}
