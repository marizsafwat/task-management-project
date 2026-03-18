import { TaskPriority } from "../types/task-periority.type";
import { TaskStatus } from "../types/task-status.type";
import { Assignee } from "./assignee.interface";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  isOverdue: boolean;
  completedAt: string;
  assignee: Assignee;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}