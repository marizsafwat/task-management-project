import { Component, effect, inject, signal } from '@angular/core';
import { ActivityService } from '../../../core/services/activity.service';
import { Activity } from '../../../shared/interfaces/activity.interface';
import { ActivityAction } from '../../../shared/types/activity-action.type';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-activity-feed',
  imports: [MatCardModule, CommonModule],
  templateUrl: './activity-feed.component.html',
  styleUrl: './activity-feed.component.css'
})
export class ActivityFeedComponent {
activityService = inject(ActivityService);
  activities = signal<Activity[]>([]);

  actionIcons: Record<ActivityAction, string> = {
    created: '🟢',
    updated: '🔵',
    deleted: '🔴',
    status_changed: '🟡'
  };

  actionColors: Record<ActivityAction, string> = {
    created: 'text-green-600 bg-green-50',
    updated: 'text-blue-600 bg-blue-50',
    deleted: 'text-red-600 bg-red-50',
    status_changed: 'text-yellow-600 bg-yellow-50'
  };

  constructor() {
    effect(() => {
      this.activityService.getActivities().subscribe(a => this.activities.set(a));
    });
  }

  getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  }
}
