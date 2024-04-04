import type {
  RuleItem,
  ValidateError,
  ValidateFieldsError,
} from "async-validator";

export interface FromItemRule extends RuleItem {
  trigger?: string;
}
export type FormRules = Record<string, FromItemRule[]>;

export interface FormProps {
  model: Record<string, any>;
  rules?: FormRules;
}

export interface FormItemProps {
  prop?: string;
  label?: string;
}

export interface FormInstance {
  validate(): Promise<any>;
}

export interface FormContext extends FormProps {
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext) => void;
}

export interface FormItemContext {
  validate: (trigger?: string) => any;
  prop: string;
}

export interface FormValidateFailuer {
  errors?: ValidateError[];
  fields: ValidateFieldsError;
}
