import { useEffect, useRef, useState } from "react";

import NotificationBell from "./components/NotificationBell";
import NotificationPanel from "./NotificationPanel";
import { useNotificationStore } from "./notification.store";

interface NotificationPost {
  id: number;
  title: string;
  body: string;
}

const API_URL =
  "https://jsonplaceholder.typicode.com/posts?_limit=5";

export default function NotificationSystem() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [page, setPage] = useState(1);

  const previousIds = useRef<Set<number>>(new Set());

  const {
    addNotifications,
    notifications,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  const unreadCount = notifications.filter(
    (notification) => !notification.read,
  ).length;

  const pageSize = 20;

  const totalPages = Math.max(
    1,
    Math.ceil(notifications.length / pageSize),
  );

  const paginatedNotifications =
    notifications.slice(
      (page - 1) * pageSize,
      page * pageSize,
    );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    let intervalId: number | undefined;

    const pollNotifications = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch notifications: ${response.status}`,
          );
        }

        const posts: NotificationPost[] =
          await response.json();

        /*
         * First poll:
         * Remember existing post IDs.
         */
        if (previousIds.current.size === 0) {
          previousIds.current = new Set(
            posts.map((post) => post.id),
          );
          return;
        }

        /*
         * Find posts that were not present
         * during the previous poll.
         */
        const newPosts = posts.filter(
          (post) =>
            !previousIds.current.has(post.id),
        );

        previousIds.current = new Set(
          posts.map((post) => post.id),
        );

        if (newPosts.length === 0) {
          return;
        }

        /*
         * Convert API posts into our
         * notification format.
         */
        const newNotifications = newPosts.map(
          (post) => ({
            id: post.id,
            title: post.title,
            message: post.body,
            createdAt: new Date().toISOString(),
            read: false,
          }),
        );

        addNotifications(newNotifications);

        /*
         * Notify the toast system only when
         * the notification panel is closed.
         */
        if (!panelOpen) {
          newNotifications.forEach(
            (notification) => {
              window.dispatchEvent(
                new CustomEvent("notification:new", {
                  detail: notification,
                }),
              );
            },
          );
        }
      } catch (error) {
        console.error(
          "Notification polling failed:",
          error,
        );
      }
    };

    const startPolling = () => {
      if (document.hidden) return;

      void pollNotifications();

      intervalId = window.setInterval(
        () => {
          void pollNotifications();
        },
        5000,
      );
    };

    const stopPolling = () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        intervalId = undefined;
      }
    };

    const handleVisibilityChange = () => {
      stopPolling();

      if (!document.hidden) {
        startPolling();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    startPolling();

    return () => {
      stopPolling();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [addNotifications, panelOpen]);

  const handlePageChange = (nextPage: number) => {
    if (
      nextPage < 1 ||
      nextPage > totalPages
    ) {
      return;
    }

    setPage(nextPage);
  };

  return (
    <div className="relative">
      <NotificationBell
        isOpen={panelOpen}
        unreadCount={unreadCount}
        onClick={() =>
          setPanelOpen((open) => !open)
        }
      />

{panelOpen && (
  <NotificationPanel
    notifications={paginatedNotifications}
    page={page}
    totalPages={totalPages}
    onPageChange={handlePageChange}
    onClose={() => setPanelOpen(false)}
    onMarkRead={markAsRead}
    onMarkAllRead={markAllAsRead}
  />
)}
    </div>
  );
}