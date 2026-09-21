import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-[hsl(220,13%,91%)] bg-white px-3 py-2 text-sm text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)]",
          "transition-colors duration-150 ease-out",
          "focus-visible:outline-none focus-visible:border-[hsl(224,12%,12%)] focus-visible:ring-2 focus-visible:ring-amber-400/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[hsl(220,14%,96%)]",
          error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[80px] w-full rounded-lg border border-[hsl(220,13%,91%)] bg-white px-3 py-2 text-sm text-[hsl(224,12%,12%)] placeholder:text-[hsl(220,10%,65%)]",
          "transition-colors duration-150 ease-out resize-none",
          "focus-visible:outline-none focus-visible:border-[hsl(224,12%,12%)] focus-visible:ring-2 focus-visible:ring-amber-400/20",
          "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-[hsl(220,14%,96%)]",
          error && "border-red-400 focus-visible:border-red-400 focus-visible:ring-red-400/20",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium text-[hsl(224,12%,12%)] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

// FormGroup for label + input + error
interface FormGroupProps {
  label: string;
  htmlFor?: string;
  error?: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}

const FormGroup = ({
  label,
  htmlFor,
  error,
  required,
  hint,
  children,
  className,
}: FormGroupProps) => (
  <div className={cn("flex flex-col gap-1.5", className)}>
    <Label htmlFor={htmlFor}>
      {label}
      {required && <span className="text-red-500 ml-0.5">*</span>}
    </Label>
    {children}
    {hint && !error && (
      <p className="text-xs text-[hsl(220,10%,55%)]">{hint}</p>
    )}
    {error && <p className="text-xs text-red-500">{error}</p>}
  </div>
);

export { Input, Textarea, Label, FormGroup };
