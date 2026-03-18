import { Component, inject, signal } from '@angular/core';
import { TasksService } from '../../core/services/tasks.service';
import { Router } from '@angular/router';
import { UserWithTasks } from '../../shared/interfaces/user-with-tasks.interface';
import { DecimalPipe, NgClass, SlicePipe, UpperCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
@Component({
  selector: 'app-team',
  imports: [MatCardModule, MatIconModule, MatButtonModule, NgClass,SlicePipe,UpperCasePipe,DecimalPipe],
  templateUrl: './team.component.html',
  styleUrl: './team.component.css'
})
export class TeamComponent {
tasksService = inject(TasksService);
  router = inject(Router);
  users = signal<UserWithTasks[]>([]);

  ngOnInit(): void {
    this.tasksService.getTasks().subscribe(tasks => {
      const map = new Map<string, UserWithTasks>();

      tasks?.forEach(task => {
        const id = task.assignee.id;
        if (!map.has(id)) {
          map.set(id, {
            assignee: task.assignee,
            tasks: [],
            todoCount: 0,
            inProgressCount: 0,
            doneCount: 0
          });
        }
        const user = map.get(id)!;
        user.tasks.push(task);
        if (task.status === 'todo') user.todoCount++;
        if (task.status === 'in_progress') user.inProgressCount++;
        if (task.status === 'done') user.doneCount++;
      });

      this.users.set(Array.from(map.values()));
    });
  }

  getAvatarColor(name: string): string {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-pink-500'
    ];
    return colors[name.charCodeAt(0) % colors.length];
  }
}
