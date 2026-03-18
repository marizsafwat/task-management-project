import { Component, inject, input, output } from '@angular/core';
import { Task } from '../../interfaces/task.interface';
import { MatCardModule } from '@angular/material/card';
import { NgClass, NgFor, SlicePipe, UpperCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { TasksService } from '../../../core/services/tasks.service';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { TaskStatus } from '../../types/task-status.type';

@Component({
  selector: 'app-task-card',
  imports: [MatCardModule,NgClass,NgFor,UpperCasePipe,SlicePipe,DragDropModule],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.css'
})
export class TaskCardComponent {
  taskService=inject(TasksService);
router=inject(Router);
data=input<Task[]>();
listId = input<string>('');
  connectedTo = input<string[]>([]);
  taskDropped = output<{ task: Task; newStatus: TaskStatus }>();
priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-600',
  medium: 'bg-orange-100 text-orange-500',
  low: 'bg-green-100 text-green-600',
};

priorityBorder: Record<string, string> = {
  high: 'border-l-red-400',
  medium: 'border-l-orange-400',
  low: 'border-l-green-400',
};
  isToday(date: Date): boolean {
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
}

differenceInDays(date1: Date, date2: Date = new Date()): number {
  const diffTime = date2.getTime() - new Date(date1).getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
}

differenceInWeeks(date1: Date, date2: Date = new Date()): number {
  return Math.floor(this.differenceInDays(date1, date2) / 7);
}
differenceInMonths(date1: Date, date2: Date = new Date()): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  return (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
}

  getDateDifferenceLabel(dueDate: string): string {
    let date= new Date(dueDate);
  if (this.isToday(date)) return 'Today';

  const now = new Date();
  const days = this.differenceInDays(now, date);

  
  if (days>0 && days < 7) return `Due in ${days} day(s)`;
  else if(days<0){
    if(this.data()?.[0].status=='done'){
    return `completed from ${Math.abs(days)} day(s)`;
    }
    
return `overdue by ${Math.abs(days)} day(s)`;
    
  } 
  if (days < 30) return `Due in ${this.differenceInWeeks(now, date)} week(s)`;
  return `Due in${this.differenceInMonths(now, date)} month(s)`;
}
onTaskClick(task:Task){
this.taskService.setFilteredTask(task);
  this.router.navigate(['/tasks', task.id]);
}
onDrop(event: CdkDragDrop<Task[]>): void {
  debugger
    if (event.previousContainer !== event.container) {
      this.taskDropped.emit({
        task: event.previousContainer.data[event.previousIndex],
        newStatus: event.container.id as TaskStatus
      });
    }
  }
}
