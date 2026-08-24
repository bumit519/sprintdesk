import { beforeEach, describe, expect, it } from "vitest";

import { useBoardStore } from "./board.store";
import type { BoardTask } from "./services/board.api";

const createTask = (
    id: number,
    status: BoardTask["status"] = "backlog",
  ): BoardTask => ({
    id,
    title: `Task ${id}`,
    description: `Description ${id}`,
    status,
    priority: "medium",
    assigneeId: 1,
    order: 1,
    dueDate: new Date().toISOString(),
    sprintId: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    completedAt: null,
  });
describe("Board Zustand store", () => {
  beforeEach(() => {
    useBoardStore.getState().clearBoard();
  });

  it("adds a task", () => {
    const task = createTask(1);

    useBoardStore.getState().addTask(task);

    const tasks = useBoardStore.getState().tasks;

    expect(tasks).toHaveLength(1);
    expect(tasks[0].id).toBe(1);
    expect(tasks[0].order).toBe(1);
  });

  it("moves a task", () => {
    const task = createTask(1);

    useBoardStore.getState().addTask(task);

    useBoardStore
      .getState()
      .moveTask(1, "in-progress", 1);

    const movedTask = useBoardStore
      .getState()
      .tasks.find((item) => item.id === 1);

    expect(movedTask?.status).toBe("in-progress");
    expect(movedTask?.order).toBe(1);
  });

  it("deletes a task", () => {
    const task = createTask(1);

    useBoardStore.getState().addTask(task);
    useBoardStore.getState().deleteTask(1);

    expect(useBoardStore.getState().tasks).toHaveLength(0);
  });
});