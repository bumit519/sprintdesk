import { CheckCircle2, X, AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  type?: ToastType;
  message: ReactNode;
  onClose?: () => void;
};

const styles = {
  success: {
    icon: CheckCircle2,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  error: {
    icon: AlertCircle,
    className: "border-red-200 bg-red-50 text-red-700",
  },
  info: {
    icon: AlertCircle,
    className: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

export default function Toast({
  type = "success",
  message,
  onClose,
}: ToastProps) {
  const config = styles[type];
  const Icon = config.icon;

  return (
    <div
      role="status"
      className={`fixed right-4 top-4 z-[100] flex max-w-sm items-center gap-3 rounded-xl border px-4 py-3 shadow-lg ${config.className}`}
    >
      <Icon size={18} className="shrink-0" />

      <p className="flex-1 text-sm font-medium">
        {message}
      </p>

      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close notification"
          className="rounded-md p-1 transition hover:bg-black/5"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}