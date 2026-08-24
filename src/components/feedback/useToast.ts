import { create } from "zustand";

import type { ToastType } from "./Toast";

interface ToastState {
  type: ToastType;
  message: string;
  isVisible: boolean;

  showToast: (
    type: ToastType,
    message: string,
  ) => void;

  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;

  hideToast: () => void;
}

export const useToast = create<ToastState>((set) => ({
  type: "info",
  message: "",
  isVisible: false,

  showToast: (type, message) =>
    set({
      type,
      message,
      isVisible: true,
    }),

  showSuccess: (message) =>
    set({
      type: "success",
      message,
      isVisible: true,
    }),

  showError: (message) =>
    set({
      type: "error",
      message,
      isVisible: true,
    }),

  showInfo: (message) =>
    set({
      type: "info",
      message,
      isVisible: true,
    }),

  hideToast: () =>
    set({
      isVisible: false,
    }),
}));