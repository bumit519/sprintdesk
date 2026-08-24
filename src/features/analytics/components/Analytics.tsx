import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Activity,
  BarChart3,
  CheckCircle2,
  CircleDot,
  Clock3,
  Eye,
  LayoutDashboard,
  TrendingUp,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { useBoardStore } from "../../board/board.store";

const STATUS_CONFIG = [
  {
    key: "backlog",
    label: "Backlog",
    color: "#3b82f6",
  },
  {
    key: "in-progress",
    label: "In Progress",
    color: "#f59e0b",
  },
  {
    key: "review",
    label: "Review",
    color: "#8b5cf6",
  },
  {
    key: "done",
    label: "Done",
    color: "#10b981",
  },
] as const;

const PRIORITY_COLORS = {
  low: "#64748b",
  medium: "#f59e0b",
  high: "#ef4444",
};

export default function Analytics() {
  const tasks = useBoardStore((state) => state.tasks);

  const analytics = useMemo(() => {
    const statusData = STATUS_CONFIG.map((status) => ({
      name: status.label,
      value: tasks.filter(
        (task) => task.status === status.key,
      ).length,
      color: status.color,
    }));

    const priorityData = STATUS_CONFIG.map((status) => {
      const columnTasks = tasks.filter(
        (task) => task.status === status.key,
      );

      return {
        name: status.label,
        low: columnTasks.filter(
          (task) => task.priority === "low",
        ).length,
        medium: columnTasks.filter(
          (task) => task.priority === "medium",
        ).length,
        high: columnTasks.filter(
          (task) => task.priority === "high",
        ).length,
      };
    });

    const sprintMap = new Map<number, number>();

    tasks.forEach((task) => {
      if (
        task.status === "done" &&
        task.completedAt
      ) {
        sprintMap.set(
          task.sprintId,
          (sprintMap.get(task.sprintId) ?? 0) + 1,
        );
      }
    });

    const velocityData = Array.from(
      sprintMap.entries(),
    )
      .sort(([a], [b]) => a - b)
      .map(([sprintId, completed]) => ({
        sprint: `Sprint ${sprintId}`,
        completed,
      }));

    const completionMap = new Map<string, number>();

    tasks.forEach((task) => {
      if (
        task.status === "done" &&
        task.completedAt
      ) {
        const date = new Date(task.completedAt);

        if (Number.isNaN(date.getTime())) return;

        const key = date.toISOString().slice(0, 10);

        completionMap.set(
          key,
          (completionMap.get(key) ?? 0) + 1,
        );
      }
    });

    const completionData = Array.from(
      completionMap.entries(),
    )
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, completed]) => ({
        date: new Date(
          `${date}T00:00:00`,
        ).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
        }),
        completed,
      }));

    return {
      statusData,
      priorityData,
      velocityData,
      completionData,
    };
  }, [tasks]);

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter(
    (task) => task.status === "done",
  ).length;

  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress",
  ).length;

  const reviewTasks = tasks.filter(
    (task) => task.status === "review",
  ).length;

  const completionRate =
    totalTasks > 0
      ? Math.round(
          (completedTasks / totalTasks) * 100,
        )
      : 0;

  return (
    <main className="min-h-screen bg-[#070B14] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-600/10 blur-3xl" />

        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-emerald-600/5 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-[1800px] px-4 py-5 sm:px-6 md:px-8 md:py-6">
        {/* Header */}
        <header className="mb-6 rounded-2xl border border-white/10 bg-[#0D1322]/90 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 shadow-lg shadow-blue-500/20">
                  <BarChart3 size={24} />
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                    SprintDesk
                  </p>

                  <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                    Analytics
                  </h1>

                  <p className="mt-1 text-sm text-slate-400">
                    Sprint performance and task
                    insights
                  </p>
                </div>
              </div>

              {/* Navigation */}
              <nav className="flex w-fit items-center rounded-xl border border-white/10 bg-[#080D18] p-1">
                <Link
                  to="/board"
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-500 transition hover:text-slate-200"
                >
                  <LayoutDashboard size={15} />
                  Board
                </Link>

                <Link
                  to="/analytics"
                  className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs font-semibold text-white shadow-sm"
                >
                  <BarChart3 size={15} />
                  Analytics
                </Link>
              </nav>
            </div>

            {/* Live indicator */}
            <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />

              <span className="text-xs font-medium text-emerald-300">
                Live board data
              </span>
            </div>
          </div>
        </header>

        {/* Summary */}
        <section className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            icon={<Activity size={17} />}
            label="Total Tasks"
            value={totalTasks}
            description="Across all columns"
            iconClass="bg-blue-500/10 text-blue-400"
          />

          <StatCard
            icon={<CheckCircle2 size={17} />}
            label="Completed"
            value={completedTasks}
            description={`${completionRate}% completion rate`}
            iconClass="bg-emerald-500/10 text-emerald-400"
          />

          <StatCard
            icon={<Clock3 size={17} />}
            label="In Progress"
            value={inProgressTasks}
            description="Currently active"
            iconClass="bg-amber-500/10 text-amber-400"
          />

          <StatCard
            icon={<Eye size={17} />}
            label="In Review"
            value={reviewTasks}
            description="Awaiting review"
            iconClass="bg-violet-500/10 text-violet-400"
          />
        </section>

        {/* Sprint Velocity */}
        <ChartCard
          icon={<TrendingUp size={17} />}
          title="Sprint Velocity"
          description="Completed tasks by sprint"
        >
          {analytics.velocityData.length === 0 ? (
            <EmptyChart message="No completed sprint data yet." />
          ) : (
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={analytics.velocityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="sprint"
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0D1322",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        {/* Status + Priority */}
        <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          {/* Status */}
          <ChartCard
            icon={<CircleDot size={17} />}
            title="Task Status"
            description="Distribution across board columns"
          >
            {totalTasks === 0 ? (
              <EmptyChart message="No tasks available." />
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <PieChart>
                  <Pie
                    data={analytics.statusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="45%"
                    innerRadius="50%"
                    outerRadius="72%"
                    paddingAngle={4}
                    animationDuration={700}
                  >
                    {analytics.statusData.map(
                      (entry) => (
                        <Cell
                          key={entry.name}
                          fill={entry.color}
                          stroke="transparent"
                        />
                      ),
                    )}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      background: "#0D1322",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Legend
                    verticalAlign="bottom"
                    height={30}
                    wrapperStyle={{
                      fontSize: 12,
                      color: "#94a3b8",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </ChartCard>

          {/* Priority */}
          <ChartCard
            icon={<Activity size={17} />}
            title="Priority Breakdown"
            description="Priority distribution across columns"
          >
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart
                data={analytics.priorityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fontSize: 10,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fontSize: 11,
                    fill: "#64748b",
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  contentStyle={{
                    background: "#0D1322",
                    border:
                      "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />

                <Legend
                  wrapperStyle={{
                    fontSize: 12,
                    color: "#94a3b8",
                  }}
                />

                <Bar
                  dataKey="low"
                  name="Low"
                  stackId="priority"
                  fill={PRIORITY_COLORS.low}
                  animationDuration={700}
                />

                <Bar
                  dataKey="medium"
                  name="Medium"
                  stackId="priority"
                  fill={PRIORITY_COLORS.medium}
                  animationDuration={700}
                />

                <Bar
                  dataKey="high"
                  name="High"
                  stackId="priority"
                  fill={PRIORITY_COLORS.high}
                  radius={[5, 5, 0, 0]}
                  animationDuration={700}
                />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </section>

        {/* Completion Trend */}
        <section className="mt-6">
          <ChartCard
            icon={<TrendingUp size={17} />}
            title="Completion Trend"
            description="Completed tasks over time"
          >
            {analytics.completionData.length ===
            0 ? (
              <EmptyChart message="No completion history available yet." />
            ) : (
              <ResponsiveContainer
                width="100%"
                height="100%"
              >
                <LineChart
                  data={analytics.completionData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: -20,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="3 3"
                    vertical={false}
                  />

                  <XAxis
                    dataKey="date"
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <YAxis
                    allowDecimals={false}
                    tick={{
                      fontSize: 11,
                      fill: "#64748b",
                    }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip
                    contentStyle={{
                      background: "#0D1322",
                      border:
                        "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "12px",
                      color: "#fff",
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="completed"
                    name="Completed"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: "#8b5cf6",
                    }}
                    activeDot={{
                      r: 6,
                    }}
                    animationDuration={800}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </ChartCard>
        </section>

        {/* Footer */}
        <div className="mt-6 flex items-center justify-between rounded-xl border border-white/10 bg-[#0D1322]/70 px-4 py-3">
          <p className="text-xs text-slate-500">
            Analytics are calculated from current
            board state.
          </p>

          <span className="text-xs font-medium text-slate-600">
            {tasks.length} records
          </span>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
  description,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  description: string;
  iconClass: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0D1322]/90 p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-lg ${iconClass}`}
        >
          {icon}
        </div>

        <span className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {value}
        </span>
      </div>

      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-1 text-xs text-slate-500">
        {description}
      </p>
    </div>
  );
}

function ChartCard({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-white/10 bg-[#0D1322]/90 p-4 shadow-xl shadow-black/10 backdrop-blur sm:p-5">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-300">
          {icon}
        </div>

        <div>
          <h2 className="text-base font-bold text-white">
            {title}
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <div className="h-[280px] w-full min-w-0 sm:h-[320px]">
        {children}
      </div>
    </section>
  );
}

function EmptyChart({
  message,
}: {
  message: string;
}) {
  return (
    <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02]">
      <div className="text-center">
        <BarChart3
          size={24}
          className="mx-auto text-slate-700"
        />

        <p className="mt-2 px-4 text-sm text-slate-500">
          {message}
        </p>
      </div>
    </div>
  );
}