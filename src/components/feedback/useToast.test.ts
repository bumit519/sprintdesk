import { describe, expect, it, beforeEach } from "vitest";
import { useToast } from "./useToast";

describe("useToast", () => {
  beforeEach(() => {
    useToast.getState().hideToast();
  });

  it("shows a success toast", () => {
    useToast.getState().showSuccess("Task created");

    const state = useToast.getState();

    expect(state.type).toBe("success");
    expect(state.message).toBe("Task created");
    expect(state.isVisible).toBe(true);
  });

  it("shows an error toast", () => {
    useToast.getState().showError("Something went wrong");

    const state = useToast.getState();

    expect(state.type).toBe("error");
    expect(state.message).toBe("Something went wrong");
    expect(state.isVisible).toBe(true);
  });

  it("hides the toast", () => {
    useToast.getState().showInfo("Hello");
    useToast.getState().hideToast();

    expect(useToast.getState().isVisible).toBe(false);
  });
});