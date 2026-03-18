import { ActivityAction } from "../types/activity-action.type";

export interface Activity {
  id: string;
  taskId: string;
  taskTitle: string;
  action: ActivityAction;
  description: string;
  timestamp: Date;
}