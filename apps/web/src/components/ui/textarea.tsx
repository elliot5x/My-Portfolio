import type { TextareaHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: ReactNode;
  helperText?: ReactNode;
};

export function Textarea({ className, label, helperText, id, ...props }: TextareaProps) {
  const textareaId = id ?? props.name;

  return (
    <label className="field" htmlFor={textareaId}>
      {label ? <span className="field-label">{label}</span> : null}
      <textarea id={textareaId} className={cn("textarea", className)} {...props} />
      {helperText ? <span className="field-help">{helperText}</span> : null}
    </label>
  );
}
