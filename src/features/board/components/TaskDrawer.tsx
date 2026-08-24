import { useEffect, useState } from "react";
import {
  CalendarDays,
  MessageSquare,
  Save,
  Send,
  UserRound,
  X,
  CircleDot,
} from "lucide-react";

import type { BoardTask } from "../services/board.api";
import {
  useBoardStore,
  type BoardColumn,
} from "../board.store";

interface TaskDrawerProps {
  task?: BoardTask | null;
  onClose: () => void;
}

const priorityStyles: Record<string, string> = {
  low: "bg-blue-50 text-blue-700 ring-blue-200",
  medium: "bg-amber-50 text-amber-700 ring-amber-200",
  high: "bg-red-50 text-red-700 ring-red-200",
};

const statusLabels: Record<BoardColumn, string> = {
  backlog: "Backlog",
  "in-progress": "In Progress",
  review: "Review",
  done: "Done",
};

export default function TaskDrawer({
  task,
  onClose,
}: TaskDrawerProps) {
  const addTask = useBoardStore((state) => state.addTask);
  const updateTask = useBoardStore(
    (state) => state.updateTask,
  );
  const comments = useBoardStore(
    (state) => state.comments,
  );
  const addComment = useBoardStore(
    (state) => state.addComment,
  );
  const deleteComment = useBoardStore(
    (state) => state.deleteComment,
  );

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] =
    useState<BoardColumn>("backlog");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [commentText, setCommentText] = useState("");

  const isEditing = Boolean(task);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setPriority(task.priority);
      setStatus(task.status as BoardColumn);
      setAssigneeId(String(task.assigneeId));
      setDueDate(task.dueDate);
    } else {
      setTitle("");
      setDescription("");
      setPriority("medium");
      setStatus("backlog");
      setAssigneeId("");
      setDueDate("");
    }

    setCommentText("");
  }, [task]);

  const taskComments = task
    ? comments.filter(
        (comment) => comment.taskId === task.id,
      )
    : [];

  const handleSubmit = (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!title.trim()) return;

    if (isEditing && task) {
      updateTask(task.id, {
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assigneeId: assigneeId
          ? Number(assigneeId)
          : task.assigneeId,
        dueDate,
      });
    } else {
      const newTask: BoardTask = {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        assigneeId: assigneeId
          ? Number(assigneeId)
          : 1,
        dueDate,
        sprintId: 1,
        order: 999,
        createdAt: new Date().toISOString(),
        completedAt: null,
        updatedAt: new Date().toISOString(),
      };

      addTask(newTask);
    }

    onClose();
  };

  const handleAddComment = () => {
    if (!task || !commentText.trim()) return;

    addComment(task.id, commentText.trim());
    setCommentText("");
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <button
        type="button"
        aria-label="Close task drawer"
        onClick={onClose}
        className="absolute inset-0 cursor-default bg-slate-950/45 backdrop-blur-sm"
      />

      {/* Drawer */}
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-[560px] flex-col border-l border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <CircleDot size={20} />
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-indigo-500">
                    Sprint task
                  </p>

                  {task && (
                    <span className="text-[11px] font-medium text-slate-400">
                      TASK-{task.id}
                    </span>
                  )}
                </div>

                <h2 className="mt-1 text-xl font-bold tracking-tight text-slate-900">
                  {isEditing
                    ? "Task details"
                    : "Create new task"}
                </h2>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-400 transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-700"
            >
              <X size={18} />
            </button>
          </div>

          {task && (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${
                  priorityStyles[
                    task.priority.toLowerCase()
                  ] ??
                  "bg-slate-50 text-slate-600 ring-slate-200"
                }`}
              >
                {task.priority}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-600">
                {statusLabels[
                  task.status as BoardColumn
                ] ?? task.status}
              </span>
            </div>
          )}
        </header>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-slate-50/60">
          <form
            id="task-form"
            onSubmit={handleSubmit}
            className="space-y-5 p-6"
          >
            {/* Main details */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">
                  Task information
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Define the scope and ownership of this task.
                </p>
              </div>

              {/* Title */}
              <div>
                <label
                  htmlFor="task-title"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Task title
                </label>

                <input
                  id="task-title"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="e.g. Implement dashboard filters"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>

              {/* Description */}
              <div className="mt-5">
                <label
                  htmlFor="task-description"
                  className="mb-2 block text-xs font-bold text-slate-700"
                >
                  Description
                </label>

                <textarea
                  id="task-description"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  rows={5}
                  placeholder="Describe what needs to be done..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                />
              </div>
            </section>

            {/* Task settings */}
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5">
                <h3 className="text-sm font-bold text-slate-900">
                  Task settings
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Manage status, priority and ownership.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {/* Status */}
                <div>
                  <label
                    htmlFor="task-status"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Status
                  </label>

                  <select
                    id="task-status"
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value as BoardColumn,
                      )
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="backlog">
                      Backlog
                    </option>
                    <option value="in-progress">
                      In Progress
                    </option>
                    <option value="review">
                      Review
                    </option>
                    <option value="done">Done</option>
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label
                    htmlFor="task-priority"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Priority
                  </label>

                  <select
                    id="task-priority"
                    value={priority}
                    onChange={(event) =>
                      setPriority(event.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                {/* Assignee */}
                <div>
                  <label
                    htmlFor="task-assignee"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Assignee
                  </label>

                  <div className="relative">
                    <UserRound
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="task-assignee"
                      type="number"
                      min="1"
                      value={assigneeId}
                      onChange={(event) =>
                        setAssigneeId(event.target.value)
                      }
                      placeholder="User ID"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>

                {/* Due date */}
                <div>
                  <label
                    htmlFor="task-due-date"
                    className="mb-2 block text-xs font-bold text-slate-700"
                  >
                    Due date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id="task-due-date"
                      type="date"
                      value={dueDate}
                      onChange={(event) =>
                        setDueDate(event.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                    />
                  </div>
                </div>
              </div>
            </section>
          </form>

          {/* Comments */}
          {isEditing && task && (
            <section className="border-t border-slate-200 px-6 py-6">
              <div className="mb-5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <MessageSquare size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Comments
                    </h3>

                    <p className="text-[11px] text-slate-400">
                      Discuss this task with your team.
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-500">
                  {taskComments.length}
                </span>
              </div>

              <div className="space-y-3">
                {taskComments.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-200 bg-white px-5 py-8 text-center">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-300">
                      <MessageSquare size={19} />
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No comments yet
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Start the conversation below.
                    </p>
                  </div>
                ) : (
                  taskComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white">
                            U
                          </div>

                          <div>
                            <p className="text-xs font-bold text-slate-700">
                              Team member
                            </p>

                            <p className="mt-0.5 text-[10px] text-slate-400">
                              {new Date(
                                comment.createdAt,
                              ).toLocaleString()}
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            deleteComment(comment.id)
                          }
                          className="text-[11px] font-semibold text-slate-400 transition hover:text-red-500"
                        >
                          Delete
                        </button>
                      </div>

                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        {comment.text}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Comment composer */}
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
                <textarea
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(event.target.value)
                  }
                  rows={3}
                  placeholder="Write a comment..."
                  className="w-full resize-none border-0 bg-transparent px-2 py-1 text-sm text-slate-700 outline-none placeholder:text-slate-400"
                />

                <div className="flex justify-end border-t border-slate-100 pt-3">
                  <button
                    type="button"
                    onClick={handleAddComment}
                    disabled={!commentText.trim()}
                    className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Send size={14} />
                    Add comment
                  </button>
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white p-4">
          <div className="flex gap-3">
            <button
              type="submit"
              form="task-form"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md"
            >
              <Save size={16} />
              {isEditing
                ? "Save Changes"
                : "Create Task"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </footer>
      </aside>
    </div>
  );
}