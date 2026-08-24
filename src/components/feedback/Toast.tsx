import type { ReactNode } from "react";

export type ToastType =
  | "success"
  | "error"
  | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

const icons: Record<ToastType, ReactNode> = {
  success: "✓",
  error: "!",
  info: "i",
};

export default function Toast({
  type,
  message,
  onClose,
}: ToastProps) {
  return (
    <div
      role="alert"
      className="fixed right-5 top-5 z-[100] flex w-full max-w-sm items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-xl"
    >
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-bold ${
          type === "success"
            ? "bg-green-100 text-green-700"
            : type === "error"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
        }`}
      >
        {icons[type]}
      </div>

      <p className="flex-1 pt-1 text-sm font-medium text-slate-700">
        {message}
      </p>

      <button
        type="button"
        onClick={onClose}
        aria-label="Close notification"
        className="rounded-md px-2 py-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
      >
        ✕
      </button>
    </div>
  );
}