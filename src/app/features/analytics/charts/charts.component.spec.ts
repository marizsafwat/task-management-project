import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChartsComponent } from './charts.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { Task } from '../../../shared/interfaces/task.interface';

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

describe('ChartsComponent', () => {
  let component: ChartsComponent;
  let fixture: ComponentFixture<ChartsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartsComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ChartsComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    // flush the http request
    const req = httpMock.expectOne('assets/tasks.json');
    req.flush({ tasks: mockTasks });
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Tasks by Priority title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Tasks by Priority');
  });

  it('should render Tasks by Status title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Tasks by Status');
  });

  it('should display total task count', () => {
    const el = fixture.nativeElement as HTMLElement;
    const totals = el.querySelectorAll('.text-gray-400');
    expect(totals[0].textContent).toContain('3');
  });

  it('should load tasks signal', () => {
    expect(component.tasks().length).toBe(3);
  });

  it('should render priority chart canvas', () => {
    const canvas = fixture.nativeElement.querySelector('canvas');
    expect(canvas).toBeTruthy();
  });

  it('should render two canvas elements', () => {
    const canvases = fixture.nativeElement.querySelectorAll('canvas');
    expect(canvases.length).toBe(2);
  });

  it('should count high priority tasks correctly', () => {
    const highCount = component.tasks().filter(t => t.priority === 'high').length;
    expect(highCount).toBe(1);
  });

  it('should count todo tasks correctly', () => {
    const todoCount = component.tasks().filter(t => t.status === 'todo').length;
    expect(todoCount).toBe(1);
  });
});