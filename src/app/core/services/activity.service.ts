import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Activity } from '../../shared/interfaces/activity.interface';
import { Task } from '../../shared/interfaces/task.interface';
import { ActivityAction } from '../../shared/types/activity-action.type';

@Injectable({ providedIn: 'root' })
export class ActivityService {
  private activities$ = new BehaviorSubject<Activity[]>([]);

  getActivities(): Observable<Activity[]> {
    return this.activities$.asObservable();
  }

  log(action: ActivityAction, task: Task, extra?: string): void {
    const activity: Activity = {
      id: crypto.randomUUID(),
      taskId: task.id,
      taskTitle: task.title,
      action,
      description: this.buildDescription(action, task, extra),
      timestamp: new Date()
    };

    const current = this.activities$.getValue();
    this.activities$.next([activity, ...current].slice(0, 20)); // keep last 20
  }

  private buildDescription(action: ActivityAction, task: Task, extra?: string): string {
    switch (action) {
      case 'created': return `"${task.title}" was created`;
      case 'updated': return `"${task.title}" was updated`;
      case 'deleted': return `"${task.title}" was deleted`;
      case 'status_changed': return `"${task.title}" moved to ${extra}`;
      default: return '';
    }
  }
}
