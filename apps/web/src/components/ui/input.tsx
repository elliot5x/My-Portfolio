import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
};

export function Input({ className, label, helperText, id, ...props }: InputProps) {
  const inputId = id ?? props.name;

  return (
    <label className="field" htmlFor={inputId}>
      {label ? <span className="field-label">{label}</span> : null}
      <input id={inputId} className={cn("input", className)} {...props} />
      {helperText ? <span className="field-help">{helperText}</span> : null}
    </label>
  );
}
