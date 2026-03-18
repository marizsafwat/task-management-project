import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TasksService } from './tasks.service';
import { Task } from '../../shared/interfaces/task.interface';

describe('TasksService', () => {
  let service: TasksService;
  let httpMock: HttpTestingController;

  const mockTasks: Task[] = [
    {
      id: '1',
      title: 'Test Task',
      description: 'Test Description',
      status: 'todo',
      priority: 'high',
      dueDate: '2025-01-01',
      isOverdue: false,
      completedAt: '',
      assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
      tags: ['test'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      TasksService,
      provideHttpClient(withInterceptorsFromDi()),
      provideHttpClientTesting() // 👈 replaces HttpClientTestingModule
    ]
  });
  service = TestBed.inject(TasksService);
  httpMock = TestBed.inject(HttpTestingController);
});

  afterEach(() => httpMock.verify());

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch tasks from JSON', () => {
    service.getTasks().subscribe(tasks => {
      expect(tasks?.length).toBe(1);
      expect(tasks?.[0].title).toBe('Test Task');
    });

    const req = httpMock.expectOne('assets/tasks.json');
    expect(req.request.method).toBe('GET');
    req.flush({ tasks: mockTasks });
  });

  it('should add a task', () => {
    service['tasks$'].next(mockTasks);

    const newTask: Task = { ...mockTasks[0], id: '2', title: 'New Task' };
    service.addTask(newTask);

    service.getTasks().subscribe(tasks => {
      expect(tasks?.length).toBe(2);
      expect(tasks?.[1].title).toBe('New Task');
    });
  });

  it('should update a task', () => {
    service['tasks$'].next(mockTasks);

    const updated = { ...mockTasks[0], title: 'Updated Title' };
    service.updateTask(updated);

    service.getTasks().subscribe(tasks => {
      expect(tasks?.[0].title).toBe('Updated Title');
    });
  });

  it('should delete a task', () => {
    service['tasks$'].next(mockTasks);
    service.deleteTask('1');

    service.getTasks().subscribe(tasks => {
      expect(tasks?.length).toBe(0);
    });
  });
});
