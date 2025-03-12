export interface FormGroupProps {
  id: string;
  label: string;
  required?: boolean;
  tooltip?: string;
  helperText?: string;
  children: React.ReactNode;
  error?: string;
}

export interface InputGroupProps {
  id: string;
  type: "number" | "text";
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

export interface TooltipProps {
  text: string;
}

export interface ValidationErrors {
  [key: string]: string;
}

export interface SelectProps {
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: Array<{
    value: string;
    label: string;
  }>;
} 