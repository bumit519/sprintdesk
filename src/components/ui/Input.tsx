import type {
    InputHTMLAttributes,
  } from "react";
  
  type InputProps =
    InputHTMLAttributes<HTMLInputElement> & {
      label?: string;
      error?: string;
    };
  
  export default function Input({
    label,
    error,
    className = "",
    id,
    ...props
  }: InputProps) {
    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={id}
            className="mb-1.5 block text-sm font-medium text-slate-700"
          >
            {label}
          </label>
        )}
  
        <input
          id={id}
          className={`h-11 w-full rounded-xl border bg-white px-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 ${
            error
              ? "border-red-400 focus:border-red-500 focus:ring-red-500/10"
              : "border-slate-200 focus:border-blue-500 focus:ring-blue-500/10"
          } ${className}`}
          aria-invalid={Boolean(error)}
          aria-describedby={
            error && id
              ? `${id}-error`
              : undefined
          }
          {...props}
        />
  
        {error && (
          <p
            id={`${id}-error`}
            className="mt-1.5 text-xs text-red-500"
          >
            {error}
          </p>
        )}
      </div>
    );
  }