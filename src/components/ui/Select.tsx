import type { SelectHTMLAttributes } from "react";

export type SelectOption = {
  label: string;
  value: string;
};

export type SelectProps =
  SelectHTMLAttributes<HTMLSelectElement> & {
    options?: SelectOption[];
  };

export default function Select({
  options = [],
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      {...props}
      className={`h-11 w-full rounded-xl border border-white/10 bg-[#080D18] px-4 text-sm text-slate-300 outline-none transition focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 ${className}`}
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}