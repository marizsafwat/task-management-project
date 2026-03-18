import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskFormDialogComponent } from './task-form-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Task } from '../../interfaces/task.interface';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

const mockTask: Task = {
  id: '1',
  title: 'Fix login bug',
  description: 'Login page crashes on mobile',
  status: 'in_progress',
  priority: 'high',
  dueDate: '2025-01-01',
  isOverdue: false,
  completedAt: '',
  assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
  tags: ['bug'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

const mockDialogRef = {
  close: jasmine.createSpy('close'),
  disableClose: false,
  backdropClick: () => ({ subscribe: () => {} }),
  keydownEvents: () => ({ subscribe: () => {} }),
  afterClosed: () => ({ subscribe: () => {} })
};

describe('TaskFormDialogComponent - Add Mode', () => {
  let component: TaskFormDialogComponent;
  let fixture: ComponentFixture<TaskFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { type: 'add' } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show Add New Task title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Add New Task');
  });

  it('should have invalid form when empty', () => {
    expect(component.taskForm.invalid).toBeTrue();
  });

  it('should have valid form when required fields are filled', () => {
    component.taskForm.patchValue({
      title: 'New Task',
      priority: 'high',
      status: 'todo',
      assignee: mockTask.assignee as any
    });
    expect(component.taskForm.valid).toBeTrue();
  });

  it('should close dialog on cancel', () => {
    component.taskForm.markAsPristine();
    component.cancel();
    expect(mockDialogRef.close).toHaveBeenCalled();
  });
});

describe('TaskFormDialogComponent - Edit Mode', () => {
  let component: TaskFormDialogComponent;
  let fixture: ComponentFixture<TaskFormDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskFormDialogComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { type: 'edit', task: mockTask } }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskFormDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should show Edit Task title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Edit Task');
  });

  it('should patch form with task data', () => {
    expect(component.taskForm.value.title).toBe('Fix login bug');
    expect(component.taskForm.value.priority).toBe('high');
    expect(component.taskForm.value.status).toBe('in_progress');
  });

  it('should call dialogRef.close with task on save', () => {
    component.taskForm.patchValue({ assignee: mockTask.assignee as any });
    component.save();
    expect(mockDialogRef.close).toHaveBeenCalledWith(jasmine.objectContaining({
      title: 'Fix login bug'
    }));
  });
});