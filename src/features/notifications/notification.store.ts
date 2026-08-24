import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Notification {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];

  addNotifications: (
    notifications: Notification[],
  ) => void;

  markAsRead: (id: number) => void;

  markAllAsRead: () => void;

  clearNotifications: () => void;
}

export const useNotificationStore =
  create<NotificationState>()(
    persist(
      (set) => ({
        notifications: [],

        addNotifications: (newNotifications) =>
          set((state) => {
            const existingIds = new Set(
              state.notifications.map(
                (notification) => notification.id,
              ),
            );

            const uniqueNotifications =
              newNotifications.filter(
                (notification) =>
                  !existingIds.has(notification.id),
              );

            if (
              uniqueNotifications.length === 0
            ) {
              return state;
            }

            return {
              notifications: [
                ...uniqueNotifications,
                ...state.notifications,
              ].slice(0, 100),
            };
          }),

        markAsRead: (id) =>
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) =>
                  notification.id === id
                    ? {
                        ...notification,
                        read: true,
                      }
                    : notification,
              ),
          })),

        markAllAsRead: () =>
          set((state) => ({
            notifications:
              state.notifications.map(
                (notification) => ({
                  ...notification,
                  read: true,
                }),
              ),
          })),

        clearNotifications: () =>
          set({
            notifications: [],
          }),
      }),
      {
        name: "sprintdesk-notifications",
      },
    ),
  );