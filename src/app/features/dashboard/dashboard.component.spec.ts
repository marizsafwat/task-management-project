import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardComponent } from './dashboard.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Task } from '../../shared/interfaces/task.interface';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task One',
    description: 'Description One',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-01-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
    tags: ['tag1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Task Two',
    description: 'Description Two',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-02-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a2', name: 'John', email: 'john@test.com', avatar: '' },
    tags: ['tag2'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Task Three',
    description: 'Description Three',
    status: 'done',
    priority: 'low',
    dueDate: '2025-03-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a3', name: 'Mike', email: 'mike@test.com', avatar: '' },
    tags: ['tag3'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => ({ subscribe: (cb: any) => cb(null) })
  })
};

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const tasksReq = httpMock.expectOne('assets/tasks.json');
tasksReq.flush({ tasks: mockTasks });

const statsReq = httpMock.expectOne('assets/statistics.json');
statsReq.flush({ statistics: [] });
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render status filter buttons', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('all');
    expect(el.textContent).toContain('todo');
    expect(el.textContent).toContain('in_progress');
    expect(el.textContent).toContain('done');
  });

  it('should render Priority filter button', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Priority');
  });

  it('should default currentStatus to all', () => {
    expect(component.currentStatus).toBe('all');
  });

  it('should show 3 status columns when status is all', () => {
    component.currentStatus = 'all';
    fixture.detectChanges();
    const statusCards = fixture.nativeElement.querySelectorAll('app-status-card');
    expect(statusCards.length).toBe(3);
  });

  it('should show 1 status column when status is filtered', () => {
    component.currentStatus = 'todo';
    fixture.detectChanges();
    const statusCards = fixture.nativeElement.querySelectorAll('app-status-card');
    expect(statusCards.length).toBe(1);
  });

  it('should change currentStatus on filter button click', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button[mat-flat-button]');
    const todoBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.trim() === 'todo'
    ) as HTMLElement;
    todoBtn.click();
    fixture.detectChanges();
    expect(component.currentStatus).toBe('todo');
  });

  it('should filter tasks by status correctly', () => {
    const todoTasks = component.getFilteredTasks('todo', 'all');
    expect(todoTasks?.length).toBe(1);
    expect(todoTasks?.[0].title).toBe('Task One');
  });

  it('should filter tasks by priority correctly', () => {
    const highTasks = component.getFilteredTasks('all' as any, 'high');
    expect(highTasks?.every(t => t.priority === 'high')).toBeTrue();
  });

  it('should update task status on drop', () => {
    spyOn(component, 'onTaskDropped');
    component.onTaskDropped({ task: mockTasks[0], newStatus: 'done' });
    expect(component.onTaskDropped).toHaveBeenCalled();
  });
});