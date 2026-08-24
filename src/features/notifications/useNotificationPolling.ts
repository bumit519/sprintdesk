import { useEffect, useRef } from "react";

import { getNotifications } from "./notification.api";
import { useNotificationStore } from "./notification.store";

const POLLING_INTERVAL = 10000;

export function useNotificationPolling(
  onNewNotifications?: (count: number) => void,
) {
  const addNotifications =
    useNotificationStore(
      (state) => state.addNotifications,
    );

  const knownIds = useRef<Set<number>>(
    new Set(),
  );

  useEffect(() => {
    let intervalId: number | null = null;
    let cancelled = false;

    const poll = async () => {
      try {
        const posts = await getNotifications();

        if (cancelled) return;

        const newPosts = posts.filter(
          (post) =>
            !knownIds.current.has(post.id),
        );

        posts.forEach((post) => {
          knownIds.current.add(post.id);
        });

        if (newPosts.length === 0) {
          return;
        }

        addNotifications(
          newPosts.map((post) => ({
            id: post.id,
            title: "New notification",
            message: post.title,
            createdAt: new Date().toISOString(),
            read: false,
          })),
        );

        if (
          document.visibilityState ===
          "visible"
        ) {
          onNewNotifications?.(
            newPosts.length,
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
      if (intervalId !== null) return;

      poll();

      intervalId = window.setInterval(
        poll,
        POLLING_INTERVAL,
      );
    };

    const stopPolling = () => {
      if (intervalId === null) return;

      window.clearInterval(intervalId);
      intervalId = null;
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "hidden"
      ) {
        stopPolling();
      } else {
        startPolling();
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange,
    );

    startPolling();

    return () => {
      cancelled = true;
      stopPolling();

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [addNotifications, onNewNotifications]);
}