import { TasksService } from './../../../core/services/tasks.service';
import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskFormDialogComponent } from '../task-form-dialog/task-form-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-task-btn',
  imports: [   MatButtonModule,
    MatIconModule ],
  templateUrl: './add-task-btn.component.html',
  styleUrl: './add-task-btn.component.css'
})
export class AddTaskBtnComponent {
  private dialog = inject(MatDialog);
  TasksService = inject(TasksService);

  openDialog(event: MouseEvent): void {
     (event.target as HTMLElement).closest('button')?.blur(); 
    const dialogRef = this.dialog.open(TaskFormDialogComponent, {
      width: '480vh',
      data:{
        type:'add'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Form Data:', result);
        this.TasksService.addTask(result).subscribe(newTask => {
          console.log('New Task Added:', newTask);
        });
      }
    });
  }
}
