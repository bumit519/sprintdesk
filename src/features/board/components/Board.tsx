import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  DndContext,
  closestCorners,
  type DragEndEvent,
} from "@dnd-kit/core";

import {
  Search,
  Plus,
  SlidersHorizontal,
  LayoutDashboard,
  CheckCircle2,
  Clock3,
  Eye,
  CircleDot,
  BarChart3,
} from "lucide-react";

import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";

import { getTasks } from "../services/board.api";
import { useBoardStore } from "../board.store";
import SortableTask from "./SortableTask";
import TaskDrawer from "./TaskDrawer";
import NotificationSystem from "../../notifications/NotificationSystem";
const columns = [
  {
    id: "backlog",
    title: "Backlog",
    icon: CircleDot,
    header: "border-blue-500/30 bg-blue-500/10",
    iconBg: "bg-blue-500/15 text-blue-400",
    count: "bg-blue-500/15 text-blue-300",
  },
  {
    id: "in-progress",
    title: "In Progress",
    icon: Clock3,
    header: "border-amber-500/30 bg-amber-500/10",
    iconBg: "bg-amber-500/15 text-amber-400",
    count: "bg-amber-500/15 text-amber-300",
  },
  {
    id: "review",
    title: "Review",
    icon: Eye,
    header: "border-violet-500/30 bg-violet-500/10",
    iconBg: "bg-violet-500/15 text-violet-400",
    count: "bg-violet-500/15 text-violet-300",
  },
  {
    id: "done",
    title: "Done",
    icon: CheckCircle2,
    header: "border-emerald-500/30 bg-emerald-500/10",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    count: "bg-emerald-500/15 text-emerald-300",
  },
] as const;

export default function Board() {
  const location = useLocation();

  const tasks = useBoardStore((state) => state.tasks);
  const setTasks = useBoardStore((state) => state.setTasks);
  const moveTask = useBoardStore((state) => state.moveTask);
  const deleteTask = useBoardStore((state) => state.deleteTask);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const [editingTask, setEditingTask] =
    useState<(typeof tasks)[number] | null>(null);

  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] =
    useState("all");

  const [assigneeFilter, setAssigneeFilter] =
    useState("all");

  useEffect(() => {
    if (tasks.length > 0) return;

    const loadTasks = async () => {
      try {
        const data = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error(
          "Failed to load board tasks:",
          error,
        );
      }
    };

    loadTasks();
  }, [tasks.length, setTasks]);

  const assignees = useMemo(() => {
    return Array.from(
      new Set(tasks.map((task) => task.assigneeId)),
    ).sort((a, b) => a - b);
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tasks.filter((task) => {
      const matchesSearch =
        !query ||
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query);

      const matchesPriority =
        priorityFilter === "all" ||
        task.priority.toLowerCase() === priorityFilter;

      const matchesAssignee =
        assigneeFilter === "all" ||
        String(task.assigneeId) === assigneeFilter;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesAssignee
      );
    });
  }, [
    tasks,
    search,
    priorityFilter,
    assigneeFilter,
  ]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeId = Number(active.id);
    const overId = Number(over.id);

    const activeTask = tasks.find(
      (task) => task.id === activeId,
    );

    const overTask = tasks.find(
      (task) => task.id === overId,
    );

    if (!activeTask || !overTask) return;

    const columnTasks = tasks
      .filter(
        (task) =>
          task.status === overTask.status,
      )
      .sort((a, b) => a.order - b.order);

    const targetIndex = columnTasks.findIndex(
      (task) => task.id === overTask.id,
    );

    if (targetIndex === -1) return;

    moveTask(
      activeTask.id,
      overTask.status as
        | "backlog"
        | "in-progress"
        | "review"
        | "done",
      targetIndex + 1,
    );
  };

  const handleCreateTask = () => {
    setEditingTask(null);
    setDrawerOpen(true);
  };

  const handleEditTask = (
    task: (typeof tasks)[number],
  ) => {
    setEditingTask(task);
    setDrawerOpen(true);
  };

  const handleDeleteTask = (taskId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?",
    );

    if (confirmed) {
      deleteTask(taskId);
    }
  };

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1800px] px-4 py-5 sm:px-5 md:px-8 md:py-6">
        {/* Header */}
        <header className="mb-7 rounded-2xl border border-white/10 bg-[#0D1322]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
            {/* Brand + Navigation */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                  <LayoutDashboard size={24} />
                </div>

                <div>
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                    SprintDesk
                  </h1>

                  <p className="text-sm text-slate-400">
                    Manage your sprint tasks
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav
                aria-label="Main navigation"
                className="flex w-fit items-center rounded-xl border border-white/10 bg-[#080D18] p-1"
              >
                <Link
                  to="/board"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    location.pathname === "/board"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <LayoutDashboard size={15} />
                  Board
                </Link>

                <Link
                  to="/analytics"
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition ${
                    location.pathname === "/analytics"
                      ? "bg-white/10 text-white shadow-sm"
                      : "text-slate-500 hover:text-slate-200"
                  }`}
                >
                  <BarChart3 size={15} />
                  Analytics
                </Link>
              </nav>
            </div>

            {/* Controls */}
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {/* Search */}
              <div className="relative">
                <Search
                  size={17}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search tasks"
                  aria-label="Search tasks"
                />
              </div>

              {/* Priority */}
              <div className="relative">
                <SlidersHorizontal
                  size={15}
                  aria-hidden="true"
                  className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-slate-500"
                />

<Select
  value={priorityFilter}
  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
    setPriorityFilter(event.target.value)
  }
  aria-label="Filter by priority"
  options={[
    {
      label: "All Priority",
      value: "all",
    },
    {
      label: "High",
      value: "high",
    },
    {
      label: "Medium",
      value: "medium",
    },
    {
      label: "Low",
      value: "low",
    },
  ]}
/>
              </div>

              {/* Assignee */}
              <Select
  value={assigneeFilter}
  onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
    setAssigneeFilter(event.target.value)
  }
  aria-label="Filter by assignee"
  options={[
    {
      label: "All Assignees",
      value: "all",
    },
    ...assignees.map((id) => ({
      label: `Assignee #${id}`,
      value: String(id),
    })),
  ]}
/>
<NotificationSystem />
              {/* Create task */}
              <Button
                type="button"
                onClick={handleCreateTask}
                className="bg-gradient-to-r from-blue-600 to-violet-600 shadow-lg shadow-blue-600/20 hover:from-blue-500 hover:to-violet-500"
              >
                <Plus size={18} />
                Create Task
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 md:grid-cols-4">
            {columns.map((column) => {
              const count = tasks.filter(
                (task) =>
                  task.status === column.id,
              ).length;

              const Icon = column.icon;

              return (
                <div
                  key={column.id}
                  className={`rounded-xl border p-3 ${column.header}`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${column.iconBg}`}
                    >
                      <Icon size={16} />
                    </div>

                    <span className="text-xl font-bold">
                      {count}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-400">
                    {column.title}
                  </p>
                </div>
              );
            })}
          </div>
        </header>

        {/* Board */}
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
            {columns.map((column) => {
              const columnTasks = filteredTasks
                .filter(
                  (task) =>
                    task.status === column.id,
                )
                .sort(
                  (a, b) =>
                    a.order - b.order,
                );

              const Icon = column.icon;

              return (
                <section
                  key={column.id}
                  aria-labelledby={`column-${column.id}`}
                  className="min-h-[620px] rounded-2xl border border-white/10 bg-[#0C1220]/80 p-3 shadow-xl shadow-black/10 backdrop-blur"
                >
                  {/* Column header */}
                  <div
                    className={`mb-4 rounded-xl border p-3 ${column.header}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`flex h-9 w-9 items-center justify-center rounded-lg ${column.iconBg}`}
                        >
                          <Icon size={18} />
                        </div>

                        <div>
                          <h2
                            id={`column-${column.id}`}
                            className="text-sm font-bold text-white"
                          >
                            {column.title}
                          </h2>

                          <p className="text-[10px] text-slate-500">
                            Sprint tasks
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${column.count}`}
                      >
                        {columnTasks.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="space-y-3">
                    {columnTasks.map((task) => (
                      <SortableTask
                        key={task.id}
                        task={task}
                        onEdit={handleEditTask}
                        onDelete={handleDeleteTask}
                      />
                    ))}

                    {columnTasks.length === 0 && (
                      <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-center">
                        <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-white/5">
                          <Icon
                            size={18}
                            className="text-slate-600"
                          />
                        </div>

                        <p className="text-xs font-medium text-slate-500">
                          No tasks here
                        </p>

                        <p className="mt-1 text-[10px] text-slate-600">
                          Drag tasks into this
                          column
                        </p>
                      </div>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        </DndContext>

        {/* Task Drawer */}
        {drawerOpen && (
          <TaskDrawer
            task={editingTask}
            onClose={() =>
              setDrawerOpen(false)
            }
          />
        )}
      </div>
    </main>
  );
}