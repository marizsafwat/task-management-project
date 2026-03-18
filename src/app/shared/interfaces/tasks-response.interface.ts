import { Assignee } from "./assignee.interface";
import { Task } from "./task.interface";




export interface TasksResponse {
  tasks: Task[];
  meta: {
    totalCount: number;
    lastUpdated: string;
  };
}