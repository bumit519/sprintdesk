import {
    CheckCircle2,
    Clock3,
    ListTodo,
    AlertCircle,
    ArrowRight,
    Plus,
  } from "lucide-react";
  import { useNavigate } from "react-router-dom";
  
  import LogoutButton from "../../auth/components/LogoutButton";
  
  const stats = [
    {
      label: "Total Tasks",
      value: "24",
      icon: ListTodo,
      description: "Across all projects",
    },
    {
      label: "Completed",
      value: "12",
      icon: CheckCircle2,
      description: "50% completion rate",
    },
    {
      label: "In Progress",
      value: "8",
      icon: Clock3,
      description: "Currently active",
    },
    {
      label: "Overdue",
      value: "4",
      icon: AlertCircle,
      description: "Needs attention",
    },
  ];
  
  const recentTasks = [
    {
      title: "Design dashboard interface",
      project: "SprintDesk",
      status: "In Progress",
      priority: "High",
    },
    {
      title: "Implement authentication",
      project: "SprintDesk",
      status: "Completed",
      priority: "High",
    },
    {
      title: "Create analytics page",
      project: "SprintDesk",
      status: "In Progress",
      priority: "Medium",
    },
    {
      title: "Improve responsive layout",
      project: "SprintDesk",
      status: "Pending",
      priority: "Low",
    },
  ];
  
  export default function DashboardPage() {
    const navigate = useNavigate();
  
    return (
      <main className="min-h-screen bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
  
          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="mb-1 text-sm text-slate-400">
                Welcome back
              </p>
  
              <h1 className="text-3xl font-bold tracking-tight">
                Dashboard
              </h1>
  
              <p className="mt-1 text-sm text-slate-400">
                Here's what's happening with your workspace today.
              </p>
            </div>
  
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/board")}
                className="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                <Plus size={16} />
                New Task
              </button>
  
              <LogoutButton />
            </div>
          </div>
  
          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => {
              const Icon = stat.icon;
  
              return (
                <div
                  key={stat.label}
                  className="rounded-xl border border-slate-800 bg-slate-900/70 p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-slate-400">
                        {stat.label}
                      </p>
  
                      <p className="mt-2 text-3xl font-bold">
                        {stat.value}
                      </p>
                    </div>
  
                    <div className="rounded-lg bg-slate-800 p-2.5">
                      <Icon size={20} className="text-slate-300" />
                    </div>
                  </div>
  
                  <p className="mt-3 text-xs text-slate-500">
                    {stat.description}
                  </p>
                </div>
              );
            })}
          </section>
  
          {/* Main Content */}
          <section className="mt-6 grid gap-6 lg:grid-cols-3">
  
            {/* Recent Tasks */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 lg:col-span-2">
              <div className="flex items-center justify-between border-b border-slate-800 px-5 py-4">
                <div>
                  <h2 className="font-semibold">
                    Recent Tasks
                  </h2>
  
                  <p className="mt-1 text-xs text-slate-500">
                    Your latest workspace activity
                  </p>
                </div>
  
                <button
                  type="button"
                  onClick={() => navigate("/board")}
                  className="inline-flex items-center gap-1 text-sm text-slate-400 transition hover:text-white"
                >
                  View all
                  <ArrowRight size={15} />
                </button>
              </div>
  
              <div className="divide-y divide-slate-800">
                {recentTasks.map((task) => (
                  <div
                    key={task.title}
                    className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-800/30 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <h3 className="text-sm font-medium">
                        {task.title}
                      </h3>
  
                      <p className="mt-1 text-xs text-slate-500">
                        {task.project}
                      </p>
                    </div>
  
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          task.status === "Completed"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : task.status === "In Progress"
                              ? "bg-blue-500/10 text-blue-400"
                              : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {task.status}
                      </span>
  
                      <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-400">
                        {task.priority}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
  
            {/* Progress */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-5">
              <h2 className="font-semibold">
                Task Progress
              </h2>
  
              <p className="mt-1 text-xs text-slate-500">
                Overall project completion
              </p>
  
              <div className="mt-8 flex items-center justify-center">
                <div className="relative flex h-40 w-40 items-center justify-center rounded-full border-[14px] border-slate-800">
                  <div className="text-center">
                    <p className="text-3xl font-bold">
                      50%
                    </p>
  
                    <p className="text-xs text-slate-500">
                      Completed
                    </p>
                  </div>
                </div>
              </div>
  
              <div className="mt-8 space-y-4">
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">
                      Completed
                    </span>
  
                    <span>12</span>
                  </div>
  
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-1/2 rounded-full bg-emerald-500" />
                  </div>
                </div>
  
                <div>
                  <div className="mb-2 flex justify-between text-xs">
                    <span className="text-slate-400">
                      Remaining
                    </span>
  
                    <span>12</span>
                  </div>
  
                  <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                    <div className="h-full w-1/2 rounded-full bg-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          </section>
  
          {/* Quick Actions */}
          <section className="mt-6 rounded-xl border border-slate-800 bg-slate-900/70 p-5">
            <h2 className="font-semibold">
              Quick Actions
            </h2>
  
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
  
              {/* Create Task */}
              <button
                type="button"
                onClick={() => navigate("/board")}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-sm font-medium">
                  Create Task
                </p>
  
                <p className="mt-1 text-xs text-slate-500">
                  Add a new task to your board
                </p>
              </button>
  
              {/* Open Board */}
              <button
                type="button"
                onClick={() => navigate("/board")}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-sm font-medium">
                  Open Board
                </p>
  
                <p className="mt-1 text-xs text-slate-500">
                  Manage your current tasks
                </p>
              </button>
  
              {/* Analytics */}
              <button
                type="button"
                onClick={() => navigate("/analytics")}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-sm font-medium">
                  View Analytics
                </p>
  
                <p className="mt-1 text-xs text-slate-500">
                  Check project performance
                </p>
              </button>
  
              {/* Notifications */}
              <button
                type="button"
                onClick={() => navigate("/board")}
                className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-left transition hover:border-slate-600 hover:bg-slate-900"
              >
                <p className="text-sm font-medium">
                  Notifications
                </p>
  
                <p className="mt-1 text-xs text-slate-500">
                  Check recent updates
                </p>
              </button>
  
            </div>
          </section>
        </div>
      </main>
    );
  }