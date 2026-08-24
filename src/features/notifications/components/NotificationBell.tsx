import { Bell } from "lucide-react";

interface NotificationBellProps {
  unreadCount: number;
  isOpen: boolean;
  onClick: () => void;
}

export default function NotificationBell({
  unreadCount,
  isOpen,
  onClick,
}: NotificationBellProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Notifications${
        unreadCount > 0
          ? `, ${unreadCount} unread`
          : ""
      }`}
      aria-expanded={isOpen}
      className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-[#080D18] text-slate-400 transition hover:border-white/20 hover:bg-white/5 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
    >
      <Bell size={19} />

      {unreadCount > 0 && (
        <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white ring-2 ring-[#0D1322]">
          {unreadCount > 99
            ? "99+"
            : unreadCount}
        </span>
      )}
    </button>
  );
}