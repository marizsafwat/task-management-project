import { Component, inject, OnInit, signal } from '@angular/core';
import {MatGridListModule} from '@angular/material/grid-list';
import { StatisticsCardComponent } from '../../shared/components/statistics-card/statistics-card.component';
import {MatButtonToggleChange, MatButtonToggleModule} from '@angular/material/button-toggle';
import { StatusCardComponent } from "../../shared/components/status-card/status-card.component";
import { StatisticsService } from '../../core/services/statistics.service';
import { StatisticsResponse } from '../../shared/interfaces/statistics-response.interface';
import { TasksService } from '../../core/services/tasks.service';
import { TasksResponse } from '../../shared/interfaces/tasks-response.interface';
import { Task } from '../../shared/interfaces/task.interface';
import { TaskPriority } from '../../shared/types/task-periority.type';
import { CommonModule, NgFor } from '@angular/common';
import { AddTaskBtnComponent } from '../../shared/components/add-task-btn/add-task-btn.component';
import { TaskStatus } from '../../shared/types/task-status.type';
import { Subscription } from 'rxjs/internal/Subscription';
import { M } from '@angular/cdk/keycodes';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-dashboard',
  imports: [MatGridListModule, StatisticsCardComponent, MatButtonToggleModule,
    StatusCardComponent,AddTaskBtnComponent,CommonModule,MatIconModule,MatButtonModule,MatMenuModule,DragDropModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit{

  statisticsService=inject(StatisticsService);
  statisticsResponse=signal<StatisticsResponse>({
    statistics:[],
    lastUpdated:''
  });
  tasksService=inject(TasksService);
  tasks=signal<Task[]|null>(null); 
  toDoTasks=signal<Task[]>([]);
  inProgressTasks=signal<Task[]>([]);
  doneTasks=signal<Task[]>([]);
  filteredTasks=signal<Task[]>([]);

  currentStatus:TaskStatus|'all'='all';
  currentPriority:TaskPriority|'all'='all';
  priorityArray:TaskPriority[]=[
    'high',
    'low',
    'medium'
  ];
statusArray: ('all' | TaskStatus)[] = [
  'all',
  'todo',
  'in_progress',
  'done'
];

  sub = new Subscription();

  ngOnInit(): void {
    this.getStatisticsData();
    this.sub.add(this.getTasksData());
  }

  getStatisticsData(){
    this.statisticsService.getStatistics().subscribe({
      next:res=>{
        this.statisticsResponse.set(res);
      }
    })
  }

  getTasksData(){
    this.tasksService.getTasks().subscribe({
      next:res=>{
        this.tasks.set(res??[]);
      }
    })
  }

  getFilteredTasks(status:TaskStatus|'all',priority:TaskPriority|'all'):Task[]{
    //debugger
    return this.tasks()?.filter(res=>
     priority=='all'?res.status==status:res.status==status&& res.priority==priority
    ) ?? [];
  }
  // onStatusChange(event:MouseEvent){
  //   debugger
  //     const target = event.target as HTMLElement;
  //   this.currentStatus=target.innerText.toLowerCase() as TaskStatus|'all';
  // }

  onPriorityChange(event:MatButtonToggleChange){
    this.currentPriority=event.value
  }
  onTaskDropped(event: { task: Task; newStatus: TaskStatus }): void {
    debugger
  const updatedTask: Task = {
    ...event.task,
    status: event.newStatus,
    updatedAt: new Date().toISOString()
  };
  this.tasksService.updateTask(updatedTask).subscribe((updatedTasks) => {
    this.tasks.set(updatedTasks);
  });
}
}
