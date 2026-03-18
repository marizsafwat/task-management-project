import {CommonModule } from '@angular/common';
import { Component, computed, inject, signal, effect, OnInit } from '@angular/core';
import { Task } from '../../shared/interfaces/task.interface';
import { TasksService } from '../../core/services/tasks.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { StatusCardComponent } from '../../shared/components/status-card/status-card.component';
import { TaskCardComponent } from '../../shared/components/task-card/task-card.component';
import { TaskFormDialogComponent } from '../../shared/components/task-form-dialog/task-form-dialog.component';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-tasks',
  imports: [MatCardModule,
    MatButtonModule,
    MatIconModule, CommonModule,TaskCardComponent],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.css'
})
export class TasksComponent implements OnInit{
tasks=signal<Task[]|null>(null);
dialog=inject(MatDialog);
tasksService=inject(TasksService);
activatedRoute=inject(ActivatedRoute);
mode:'single'|'multiple'='single';
paramMapSignal = toSignal(this.activatedRoute.paramMap);
sub = new Subscription();
id = computed(() => this.paramMapSignal()?.get('id'));

constructor(){
effect(()=>{
const id = this.id();

  if (!id) {
    this.mode='multiple';
  }else{
    this.mode='single';
  }

  this.loadTask(this.mode);
});
}
  ngOnInit(): void {
    debugger; 
    this.sub.add(this.tasksService.getTasks().subscribe(res=>{
      this.tasks.set(res);
    }));
  }

loadTask(currentMood:'single'|'multiple'){
  if(currentMood=='single'){
    this.tasks.set([]);
    this.tasksService.getFilteredTask().subscribe(res=>{
    this.tasks.update(tasks=>[...(tasks??[]),res]);
   })
  }
  else{
     this.tasksService.getTasks().subscribe(res=>{
         this.tasks.set(res);
  })
}}

statusColors: Record<string, string> = {
  todo: 'bg-blue-100 text-blue-800',
  'in-progress': 'bg-yellow-100 text-yellow-800',
  done: 'bg-green-100 text-green-800'
};

onEdit(task: Task,event: MouseEvent) {
    (event.target as HTMLElement).closest('button')?.blur(); 

  console.log('Edit task:', task);
  const dialogRef = this.dialog.open(TaskFormDialogComponent, {
     width: '480vh',
    data: {
      type: 'edit',
      task: task
    }
  });
  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // ✅ User confirmed delete
      console.log('edited:', result);
        

      this.tasksService.updateTask(result).subscribe((updatedTasks) =>{
 this.tasks.update(tasks =>[...(updatedTasks ?? [])]);
      });    
    }
  });
}

onDelete(task: Task) {
  console.log('Delete task:', task);
   const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    data: {
      header:'Delete',
      message: `Are you sure you want to delete "${task.title}"?`,
      btnLabel:'Delete'
    }
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      // ✅ User confirmed delete
      console.log('Deleted:', result);
      this.tasksService.deleteTask(task.id).subscribe(res=>{
        console.log('Deleted task ID:', res);
        this.tasks.update(tasks => tasks?.filter(t => t.id !== res) ?? []);
        // this.loadTask(this.mode);
      })

      // call your service here
      // this.taskService.deleteTask(task.id);
    }
  });
}
}
