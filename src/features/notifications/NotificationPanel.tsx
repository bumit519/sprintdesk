import {
    Check,
    CheckCheck,
    ChevronLeft,
    ChevronRight,
    X,
  } from "lucide-react";
  
  import type { Notification } from "./notification.store";
  
  interface NotificationPanelProps {
    notifications: Notification[];
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onMarkRead: (id: number) => void;
    onMarkAllRead: () => void;
    onClose: () => void;
  }
  
  export default function NotificationPanel({
    notifications,
    page,
    totalPages,
    onPageChange,
    onMarkRead,
    onMarkAllRead,
    onClose,
  }: NotificationPanelProps) {
    return (
      <div className="absolute right-0 top-14 z-[100] w-[calc(100vw-2rem)] max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0D1322] shadow-2xl shadow-black/40">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <h2 className="text-sm font-bold text-white">
              Notifications
            </h2>
  
            <p className="mt-0.5 text-[11px] text-slate-500">
              Latest updates
            </p>
          </div>
  
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onMarkAllRead}
              title="Mark all as read"
              aria-label="Mark all notifications as read"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <CheckCheck size={17} />
            </button>
  
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notifications"
              className="rounded-lg p-2 text-slate-500 transition hover:bg-white/5 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>
        </div>
  
        <div className="max-h-[420px] overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex min-h-40 items-center justify-center px-5 text-center">
              <div>
                <p className="text-sm font-medium text-slate-400">
                  No notifications
                </p>
  
                <p className="mt-1 text-xs text-slate-600">
                  New notifications will appear here.
                </p>
              </div>
            </div>
          ) : (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className={`border-b border-white/5 px-4 py-3 ${
                  notification.read
                    ? "bg-transparent"
                    : "bg-blue-500/[0.06]"
                }`}
              >
                <div className="flex gap-3">
                  <div
                    className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                      notification.read
                        ? "bg-slate-700"
                        : "bg-blue-400"
                    }`}
                  />
  
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3
                        className={`text-xs font-semibold ${
                          notification.read
                            ? "text-slate-400"
                            : "text-white"
                        }`}
                      >
                        {notification.title}
                      </h3>
  
                      {!notification.read && (
                        <button
                          type="button"
                          onClick={() =>
                            onMarkRead(
                              notification.id,
                            )
                          }
                          title="Mark as read"
                          aria-label={`Mark ${notification.title} as read`}
                          className="shrink-0 rounded-md p-1 text-slate-500 hover:bg-white/5 hover:text-white"
                        >
                          <Check size={14} />
                        </button>
                      )}
                    </div>
  
                    <p className="mt-1 line-clamp-2 text-[11px] leading-4 text-slate-500">
                      {notification.message}
                    </p>
  
                    <p className="mt-1.5 text-[9px] text-slate-600">
                      {new Date(
                        notification.createdAt,
                      ).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
  
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-white/10 px-4 py-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() =>
                onPageChange(page - 1)
              }
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              <ChevronLeft size={14} />
              Previous
            </button>
  
            <span className="text-[10px] font-medium text-slate-500">
              Page {page} of {totalPages}
            </span>
  
            <button
              type="button"
              disabled={page === totalPages}
              onClick={() =>
                onPageChange(page + 1)
              }
              className="flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs text-slate-400 hover:bg-white/5 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
            >
              Next
              <ChevronRight size={14} />
            </button>
          </div>
        )}
      </div>
    );
  }