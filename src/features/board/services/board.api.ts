import mockData from "../../../data/mock-data.json";

export interface BoardTask {
  id: number;
  title: string;
  description: string;
  status: string;
  priority: string;
  assigneeId: number;
  dueDate: string;
  sprintId: number;
  order: number;
  createdAt: string;
  completedAt: string | null;
  updatedAt: string;
}

export async function getTasks(): Promise<BoardTask[]> {
  return mockData.tasks.slice(0, 30);
}