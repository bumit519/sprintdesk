import {
    CalendarDays,
    GripVertical,
    Pencil,
    Trash2,
  } from "lucide-react";
  import { useSortable } from "@dnd-kit/sortable";
  import { CSS } from "@dnd-kit/utilities";
  
  import type { BoardTask } from "../services/board.api";
  
  interface SortableTaskProps {
    task: BoardTask;
    onEdit: (task: BoardTask) => void;
    onDelete: (taskId: number) => void;
  }
  
  const priorityStyles: Record<string, string> = {
    high: "bg-red-50 text-red-600 ring-red-200",
    medium: "bg-amber-50 text-amber-600 ring-amber-200",
    low: "bg-blue-50 text-blue-600 ring-blue-200",
  };
  
  export default function SortableTask({
    task,
    onEdit,
    onDelete,
  }: SortableTaskProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: task.id,
    });
  
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };
  
    const priority =
      priorityStyles[task.priority.toLowerCase()] ??
      "bg-slate-50 text-slate-600 ring-slate-200";
  
    return (
      <article
        ref={setNodeRef}
        style={style}
        className={[
          "group rounded-xl border border-slate-200 bg-white p-4",
          "shadow-sm transition-all duration-200",
          "hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md",
          isDragging
            ? "relative z-50 rotate-1 scale-[1.02] shadow-xl"
            : "",
        ].join(" ")}
      >
        {/* Top row */}
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-2">
            <button
              type="button"
              {...attributes}
              {...listeners}
              className="mt-0.5 cursor-grab rounded p-1 text-slate-300 transition hover:bg-slate-100 hover:text-slate-500 active:cursor-grabbing"
              aria-label="Drag task"
            >
              <GripVertical size={16} />
            </button>
  
            <div className="min-w-0">
              <h3 className="truncate text-sm font-semibold text-slate-800">
                {task.title}
              </h3>
  
              <span className="mt-1 block text-[11px] font-medium text-slate-400">
                TASK-{task.id}
              </span>
            </div>
          </div>
  
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ring-1 ${priority}`}
          >
            {task.priority}
          </span>
        </div>
  
        {/* Description */}
        <p className="mb-4 line-clamp-2 text-xs leading-5 text-slate-500">
          {task.description}
        </p>
  
        {/* Bottom information */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex items-center gap-3">
            {/* Assignee */}
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-[10px] font-bold text-white ring-2 ring-white"
              title={`Assignee #${task.assigneeId}`}
            >
              {task.assigneeId}
            </div>
  
            {/* Due date */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <CalendarDays size={13} />
  
              <span>
                {task.dueDate
                  ? new Date(task.dueDate).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      },
                    )
                  : "No date"}
              </span>
            </div>
          </div>
  
          {/* Actions */}
          <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(task);
              }}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              aria-label="Edit task"
            >
              <Pencil size={14} />
            </button>
  
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(task.id);
              }}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-600"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </article>
    );
  }