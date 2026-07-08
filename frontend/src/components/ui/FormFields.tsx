import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/utils";


const fieldBase =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400 focus:border-brand-600 focus:ring-1 focus:ring-brand-600 disabled:bg-surface-sunken disabled:text-ink-soft";

interface FieldWrapProps {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
}

const FieldChrome = ({
  label,
  error,
  hint,
  required,
  children,
}: FieldWrapProps & { children: React.ReactNode }) => (
  <div className="space-y-1.5">
    {label && (
      <label className="block text-sm font-medium text-ink">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
    )}
    {children}
    {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
    {error && <p className="text-xs text-rose-600">{error}</p>}
  </div>
);

interface InputProps extends InputHTMLAttributes<HTMLInputElement>, FieldWrapProps {}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <FieldChrome label={label} error={error} hint={hint} required={required}>
      <input
        ref={ref}
        className={cn(fieldBase, error && "border-rose-400 focus:border-rose-500 focus:ring-rose-500", className)}
        {...props}
      />
    </FieldChrome>
  )
);
Input.displayName = "Input";

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement>, FieldWrapProps {}
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, error, hint, required, ...props }, ref) => (
    <FieldChrome label={label} error={error} hint={hint} required={required}>
      <textarea
        ref={ref}
        className={cn(fieldBase, "min-h-[100px] resize-y", error && "border-rose-400", className)}
        {...props}
      />
    </FieldChrome>
  )
);
TextArea.displayName = "TextArea";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement>, FieldWrapProps {}
export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, hint, required, children, ...props }, ref) => (
    <FieldChrome label={label} error={error} hint={hint} required={required}>
      <select
        ref={ref}
        className={cn(fieldBase, "cursor-pointer", error && "border-rose-400", className)}
        {...props}
      >
        {children}
      </select>
    </FieldChrome>
  )
);
Select.displayName = "Select";
