import type {
    ButtonHTMLAttributes,
    ReactNode,
  } from "react";
  
  type ButtonVariant =
    | "primary"
    | "secondary"
    | "danger"
    | "ghost";
  
  interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    variant?: ButtonVariant;
    loading?: boolean;
  }
  
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-500 focus:ring-blue-500/30",
  
    secondary:
      "border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 focus:ring-white/20",
  
    danger:
      "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500/30",
  
    ghost:
      "text-slate-400 hover:bg-white/5 hover:text-white focus:ring-white/20",
  };
  
  export default function Button({
    children,
    variant = "primary",
    loading = false,
    disabled,
    className = "",
    ...props
  }: ButtonProps) {
    return (
      <button
        {...props}
        disabled={disabled || loading}
        className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold outline-none transition focus:ring-2 disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      >
        {loading && (
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        )}
  
        {children}
      </button>
    );
  }