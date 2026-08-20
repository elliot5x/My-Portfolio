import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils/cn";

type ButtonVariant = "primary" | "secondary" | "ghost";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "button button-primary",
  secondary: "button button-secondary",
  ghost: "button button-ghost"
};

type BaseProps = {
  variant?: ButtonVariant;
  children: ReactNode;
};

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
type LinkButtonProps = BaseProps & AnchorHTMLAttributes<HTMLAnchorElement>;

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button className={cn(buttonStyles[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function ButtonLink({ variant = "primary", className, children, ...props }: LinkButtonProps) {
  return (
    <a className={cn(buttonStyles[variant], className)} {...props}>
      {children}
    </a>
  );
}
