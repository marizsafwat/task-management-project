import { TaskPriority } from './../../types/task-periority.type';
import { TaskStatus } from './../../types/task-status.type';
import { Component, effect, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import {
  MatNativeDateModule,
  provideNativeDateAdapter,
} from '@angular/material/core';
import { Task } from '../../interfaces/task.interface';
import { Assignee } from '../../interfaces/assignee.interface';
import { TasksService } from '../../../core/services/tasks.service';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
@Component({
  selector: 'app-task-form-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './task-form-dialog.component.html',
  styleUrl: './task-form-dialog.component.css',
})
export class TaskFormDialogComponent implements OnInit {
  fb = inject(FormBuilder);
  dialogRef = inject(MatDialogRef<TaskFormDialogComponent>);
  tasksService = inject(TasksService);
  dialog = inject(MatDialog);
  data = inject(MAT_DIALOG_DATA);

  priorities: TaskPriority[] = ['high', 'low', 'medium'];
  statuses: TaskStatus[] = ['done', 'in_progress', 'todo'];

  taskForm = this.fb.group({
    id: [''],
    title: ['', Validators.required],
    description: [''],
    status: ['Todo' as TaskStatus, Validators.required],
    priority: ['Medium' as TaskPriority, Validators.required],
    dueDate: [''],
    tags: this.fb.array([]),
    assignee: [null, Validators.required],
    isOverdue: [false],
    completedAt: [''],
    createdAt: [new Date().toISOString()],
    updatedAt: [''],
  });

  assigneList = signal<Assignee[]>([]);
  isConfirmDialogOpen = false;

  constructor() {
    // intercept backdrop click and escape key
    this.dialogRef.disableClose = true;

    this.dialogRef.backdropClick().subscribe(() => this.confirmClose());

    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === 'Escape') this.confirmClose();
    });

    effect(() => {
      this.tasksService.getAssigneesFromTasks().subscribe((assignees) => {
        debugger;
        this.assigneList.set(assignees);
      });
    });
  }

  ngOnInit(): void {
    if (this.data.type === 'edit' && this.data.task) {
      this.taskForm.patchValue({
        id: this.data.task.id,
        title: this.data.task.title,
        description: this.data.task.description,
        priority: this.data.task.priority,
        status: this.data.task.status,
        dueDate: this.data.task.dueDate ? this.data.task.dueDate : '',
        assignee: this.data.task.assignee,
        isOverdue: this.data.task.isOverdue,
        completedAt: this.data.task.completedAt ?? '',
        createdAt: this.data.task.createdAt ?? '',
        updatedAt: this.data.task.updatedAt ?? '',
      });

      this.taskForm.setControl('tags', this.fb.array(this.data.task.tags));
    }
  }

compareAssignee(a: Assignee, b: Assignee): boolean {
  return a?.id === b?.id;
}
confirmClose(): void {
  if (!this.taskForm.dirty) {
    this.dialogRef.close();
    return;
  }

  if (this.isConfirmDialogOpen) return; // 👈 prevent multiple triggers
  this.isConfirmDialogOpen = true;

  this.dialog.open(ConfirmationDialogComponent, {
    data: {
      header: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to leave?',
      btnLabel: 'Leave'
    }
  }).afterClosed().subscribe(result => {
    debugger;
    this.isConfirmDialogOpen = false; // 👈 reset flag
   if (result) {
      this.dialogRef.close(); // user clicked Leave → close form
    } else {
      // user clicked Cancel → reopen form dialog
      // this.dialog.open(TaskFormDialogComponent, {
      //   width: '480px',
      //   data: this.data
      // });
  }});
}

  save(): void {
    if (this.taskForm.valid) {
      const formValue: Task = {
        id: this.data?.task?.id ?? crypto.randomUUID(),
        title: this.taskForm.value.title!,
        description: this.taskForm.value.description ?? '',
        status: this.taskForm.value.status!,
        priority: this.taskForm.value.priority!,
        dueDate: this.taskForm.value.dueDate ?? '',
        assignee: this.taskForm.value.assignee!,
        tags: (this.taskForm.value.tags ?? []).filter(
          (t): t is string => t !== null,
        ),
        isOverdue: false,
        completedAt: '',
        createdAt: this.data?.task?.createdAt ?? new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      this.dialogRef.close(formValue);
    }
  }

  cancel(): void {
    this.confirmClose();
  }
}