import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { BoardTask } from "./services/board.api";

export type BoardColumn =
  | "backlog"
  | "in-progress"
  | "review"
  | "done";

export interface TaskComment {
  id: number;
  taskId: number;
  text: string;
  createdAt: string;
}

interface BoardState {
  tasks: BoardTask[];
  comments: TaskComment[];
  previousTasks: BoardTask[] | null;

  setTasks: (tasks: BoardTask[]) => void;

  addTask: (task: BoardTask) => void;

  updateTask: (
    taskId: number,
    updates: Partial<BoardTask>,
  ) => void;

  deleteTask: (taskId: number) => void;

  moveTask: (
    taskId: number,
    status: BoardColumn,
    order: number,
  ) => void;

  undoLastMove: () => void;

  addComment: (
    taskId: number,
    text: string,
  ) => void;

  deleteComment: (commentId: number) => void;

  clearBoard: () => void;
}

export const useBoardStore = create<BoardState>()(
  persist(
    (set) => ({
      tasks: [],
      comments: [],
      previousTasks: null,

      setTasks: (tasks) => set({ tasks }),

      addTask: (task) =>
        set((state) => {
          const columnTasks = state.tasks
            .filter((item) => item.status === task.status)
            .sort((a, b) => a.order - b.order);

          const now = new Date().toISOString();

          const newTask: BoardTask = {
            ...task,
            order: columnTasks.length + 1,
            createdAt: task.createdAt || now,
            updatedAt: now,
          };

          return {
            tasks: [...state.tasks, newTask],
          };
        }),

      updateTask: (taskId, updates) =>
        set((state) => {
          const existingTask = state.tasks.find(
            (task) => task.id === taskId,
          );

          if (!existingTask) {
            return state;
          }

          const updatedTask: BoardTask = {
            ...existingTask,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          if (
            updates.status &&
            updates.status !== existingTask.status
          ) {
            const oldColumn = state.tasks
              .filter(
                (task) =>
                  task.status === existingTask.status &&
                  task.id !== taskId,
              )
              .sort((a, b) => a.order - b.order)
              .map((task, index) => ({
                ...task,
                order: index + 1,
              }));

            const newColumn = state.tasks
              .filter(
                (task) =>
                  task.status === updates.status &&
                  task.id !== taskId,
              )
              .sort((a, b) => a.order - b.order)
              .map((task, index) => ({
                ...task,
                order: index + 1,
              }));

            updatedTask.order = newColumn.length + 1;

            return {
              tasks: [
                ...oldColumn,
                ...newColumn,
                updatedTask,
              ],
            };
          }

          return {
            tasks: state.tasks.map((task) =>
              task.id === taskId ? updatedTask : task,
            ),
          };
        }),

      deleteTask: (taskId) =>
        set((state) => {
          const deletedTask = state.tasks.find(
            (task) => task.id === taskId,
          );

          if (!deletedTask) {
            return state;
          }

          const remainingTasks = state.tasks.filter(
            (task) => task.id !== taskId,
          );

          const affectedColumn = remainingTasks
            .filter(
              (task) => task.status === deletedTask.status,
            )
            .sort((a, b) => a.order - b.order);

          const orderMap = new Map(
            affectedColumn.map((task, index) => [
              task.id,
              index + 1,
            ]),
          );

          return {
            tasks: remainingTasks.map((task) => ({
              ...task,
              order:
                orderMap.get(task.id) ?? task.order,
            })),
            comments: state.comments.filter(
              (comment) => comment.taskId !== taskId,
            ),
          };
        }),

      moveTask: (taskId, status, order) =>
        set((state) => {
          const task = state.tasks.find(
            (item) => item.id === taskId,
          );

          if (!task) {
            return state;
          }

          const previousTasks = state.tasks.map(
            (item) => ({ ...item }),
          );

          const sourceStatus = task.status;

          const sourceTasks = state.tasks
            .filter(
              (item) =>
                item.status === sourceStatus &&
                item.id !== taskId,
            )
            .sort((a, b) => a.order - b.order);

          const destinationTasks = state.tasks
            .filter(
              (item) =>
                item.status === status &&
                item.id !== taskId,
            )
            .sort((a, b) => a.order - b.order);

          const newOrder = Math.max(
            1,
            Math.min(
              order,
              destinationTasks.length + 1,
            ),
          );

          const movedTask: BoardTask = {
            ...task,
            status,
            order: newOrder,
            completedAt:
              status === "done"
                ? task.completedAt ??
                  new Date().toISOString()
                : null,
            updatedAt: new Date().toISOString(),
          };

          /*
           * Moving inside the same column
           */
          if (sourceStatus === status) {
            const reordered = [...sourceTasks];

            reordered.splice(
              newOrder - 1,
              0,
              movedTask,
            );

            const orderMap = new Map(
              reordered.map((item, index) => [
                item.id,
                index + 1,
              ]),
            );

            return {
              previousTasks,
              tasks: state.tasks.map((item) => {
                const itemOrder = orderMap.get(item.id);

                if (item.id === taskId) {
                  return {
                    ...movedTask,
                    order: itemOrder ?? newOrder,
                  };
                }

                if (itemOrder !== undefined) {
                  return {
                    ...item,
                    order: itemOrder,
                  };
                }

                return item;
              }),
            };
          }

          /*
           * Moving between columns
           */
          const finalDestination = [
            ...destinationTasks.slice(
              0,
              newOrder - 1,
            ),
            movedTask,
            ...destinationTasks.slice(
              newOrder - 1,
            ),
          ];

          const sourceOrderMap = new Map(
            sourceTasks.map((item, index) => [
              item.id,
              index + 1,
            ]),
          );

          const destinationOrderMap = new Map(
            finalDestination.map((item, index) => [
              item.id,
              index + 1,
            ]),
          );

          return {
            previousTasks,
            tasks: state.tasks.map((item) => {
              /*
               * The moved task must explicitly receive
               * the new status.
               */
              if (item.id === taskId) {
                return {
                  ...movedTask,
                  order:
                    destinationOrderMap.get(item.id) ??
                    newOrder,
                };
              }

              if (item.status === sourceStatus) {
                return {
                  ...item,
                  order:
                    sourceOrderMap.get(item.id) ??
                    item.order,
                };
              }

              if (item.status === status) {
                const destinationOrder =
                  destinationOrderMap.get(item.id);

                if (destinationOrder !== undefined) {
                  return {
                    ...item,
                    order: destinationOrder,
                  };
                }
              }

              return item;
            }),
          };
        }),

      undoLastMove: () =>
        set((state) => {
          if (!state.previousTasks) {
            return state;
          }

          return {
            tasks: state.previousTasks,
            previousTasks: null,
          };
        }),

      addComment: (taskId, text) =>
        set((state) => {
          const trimmedText = text.trim();

          if (!trimmedText) {
            return state;
          }

          return {
            comments: [
              ...state.comments,
              {
                id: Date.now(),
                taskId,
                text: trimmedText,
                createdAt: new Date().toISOString(),
              },
            ],
          };
        }),

      deleteComment: (commentId) =>
        set((state) => ({
          comments: state.comments.filter(
            (comment) => comment.id !== commentId,
          ),
        })),

      clearBoard: () =>
        set({
          tasks: [],
          comments: [],
          previousTasks: null,
        }),
    }),
    {
      name: "sprintdesk-board-storage",

      partialize: (state) => ({
        tasks: state.tasks,
        comments: state.comments,
      }),
    },
  ),
);