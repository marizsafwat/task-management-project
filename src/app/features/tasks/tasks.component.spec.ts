import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TasksComponent } from './tasks.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { Task } from '../../shared/interfaces/task.interface';
import { TasksService } from '../../core/services/tasks.service';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { ParamMap, convertToParamMap } from '@angular/router';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Fix login bug',
    description: 'Login page crashes on mobile',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-01-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
    tags: ['bug'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Update docs',
    description: 'Update API documentation',
    status: 'in_progress',
    priority: 'medium',
    dueDate: '2025-02-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a2', name: 'John', email: 'john@test.com', avatar: '' },
    tags: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => of(null)
  })
};

const mockActivatedRoute = {
  paramMap: of(convertToParamMap({}))
};

describe('TasksComponent - Multiple Mode', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let httpMock: HttpTestingController;
  let tasksService: TasksService;

  beforeEach(async () => {
    mockDialog.open.calls.reset();

    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    tasksService = TestBed.inject(TasksService);
    fixture.detectChanges();

    const req = httpMock.match('assets/tasks.json');
    req.forEach(r => r.flush({ tasks: mockTasks }));
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be in multiple mode when no id param', () => {
    expect(component.mode).toBe('multiple');
  });

  it('should render task count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('2');
  });

  it('should render Showing tasks text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Showing');
    expect(el.textContent).toContain('tasks');
  });

  it('should render task titles', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Fix login bug');
    expect(el.textContent).toContain('Update docs');
  });

  it('should render edit and delete buttons for each task', () => {
    const buttons = fixture.debugElement.queryAll(By.css('button[mat-icon-button]'));
    expect(buttons.length).toBe(4); // 2 edit + 2 delete
  });

  it('should render app-task-card for each task', () => {
    const taskCards = fixture.debugElement.queryAll(By.css('app-task-card'));
    expect(taskCards.length).toBe(2);
  });

  it('should open confirm dialog on onDelete', () => {
    component.onDelete(mockTasks[0]);
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call deleteTask when confirm dialog returns true', () => {
    spyOn(tasksService, 'deleteTask').and.returnValue(of('1'));
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) });
    component.onDelete(mockTasks[0]);
    expect(tasksService.deleteTask).toHaveBeenCalledWith('1');
  });

  it('should not call deleteTask when confirm dialog returns false', () => {
    spyOn(tasksService, 'deleteTask').and.returnValue(of('1'));
    mockDialog.open.and.returnValue({ afterClosed: () => of(false) });
    component.onDelete(mockTasks[0]);
    expect(tasksService.deleteTask).not.toHaveBeenCalled();
  });

  it('should update tasks signal after delete', () => {
    spyOn(tasksService, 'deleteTask').and.returnValue(of('1'));
    mockDialog.open.and.returnValue({ afterClosed: () => of(true) });
    component.tasks.set(mockTasks);
    component.onDelete(mockTasks[0]);
    expect(component.tasks()?.length).toBe(1);
    expect(component.tasks()?.[0].id).toBe('2');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.sub, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.sub.unsubscribe).toHaveBeenCalled();
  });
});

describe('TasksComponent - Single Mode', () => {
  let component: TasksComponent;
  let fixture: ComponentFixture<TasksComponent>;
  let httpMock: HttpTestingController;
  let tasksService: TasksService;

  const mockActivatedRouteWithId = {
    paramMap: of(convertToParamMap({ id: '1' }))
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog },
        { provide: ActivatedRoute, useValue: mockActivatedRouteWithId }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TasksComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    tasksService = TestBed.inject(TasksService);
    spyOn(tasksService, 'getFilteredTask').and.returnValue(mockTasks[0]);
    fixture.detectChanges();

    const req = httpMock.match('assets/tasks.json');
    req.forEach(r => r.flush({ tasks: mockTasks }));
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should be in single mode when id param exists', () => {
    expect(component.mode).toBe('single');
  });



});