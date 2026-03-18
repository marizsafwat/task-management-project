import { Assignee } from "./assignee.interface";
import { Task } from "./task.interface";

export interface UserWithTasks {
  assignee: Assignee;
  tasks: Task[];
  todoCount: number;
  inProgressCount: number;
  doneCount: number;
}