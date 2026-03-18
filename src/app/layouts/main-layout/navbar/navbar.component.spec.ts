import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { Router } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Task } from '../../../shared/interfaces/task.interface';
import { TasksService } from '../../../core/services/tasks.service';

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

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let httpMock: HttpTestingController;
  let router: Router;
  let tasksService: TasksService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    tasksService = TestBed.inject(TasksService);
    fixture.detectChanges();

    // flush initial tasks request from effect
    const req = httpMock.match('assets/tasks.json');
    req.forEach(r => r.flush({ tasks: mockTasks }));
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Task Manager title', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Task Manager');
  });

  it('should render search input', () => {
    const input = fixture.debugElement.query(By.css('input[matInput]'));
    expect(input).toBeTruthy();
  });

  it('should render search label', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Search Tasks');
  });

  it('should render notifications icon', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('notifications');
  });

  it('should render account icon', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('account_circle');
  });

  it('should render search icon', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('search');
  });

it('should update searchTerm on input', fakeAsync(() => {
  const input = fixture.debugElement.query(By.css('input[matInput]'));
  input.nativeElement.value = 'Fix login';
  input.nativeElement.dispatchEvent(new Event('input'));
  fixture.detectChanges();
  tick(300);

  // flush the http request triggered by the debounce effect
  const req = httpMock.match('assets/tasks.json');
  req.forEach(r => r.flush({ tasks: mockTasks }));
  fixture.detectChanges();

  expect(component.searchTerm()).toBe('Fix login');
}));

  it('should show all tasks when search is empty', fakeAsync(() => {
    component.tasks.set(mockTasks);
    component.searchTerm.set('');
    tick(300);

    const req = httpMock.match('assets/tasks.json');
    req.forEach(r => r.flush({ tasks: mockTasks }));
    fixture.detectChanges();

    expect(component.filteredTasks().length).toBe(2);
  }));

 it('should clear search term on clearSearch', fakeAsync(() => {
  component.searchTerm.set('some value');
  tick(300);

  const req = httpMock.match('assets/tasks.json');
  req.forEach(r => r.flush({ tasks: mockTasks }));

  component.clearSearch();
  tick(300);

  const req2 = httpMock.match('assets/tasks.json');
  req2.forEach(r => r.flush({ tasks: mockTasks }));

  expect(component.searchTerm()).toBe('');
}));

  it('should not navigate if same task is selected', () => {
    spyOn(router, 'navigate');
    const mockTask = mockTasks[0];
    spyOn(tasksService, 'getFilteredTask').and.returnValue(mockTask);
    component.selectTask(mockTask);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to task detail on selectTask', () => {
    spyOn(router, 'navigate');
    spyOn(tasksService, 'getFilteredTask').and.returnValue(null);
    component.selectTask(mockTasks[0]);
    expect(router.navigate).toHaveBeenCalledWith(['/tasks', '1']);
  });

  it('should call setFilteredTask on selectTask', () => {
    spyOn(tasksService, 'getFilteredTask').and.returnValue(null);
    spyOn(tasksService, 'setFilteredTask');
    component.selectTask(mockTasks[0]);
    expect(tasksService.setFilteredTask).toHaveBeenCalledWith(mockTasks[0]);
  });
});