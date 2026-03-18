import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TeamComponent } from './team.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Task } from '../../shared/interfaces/task.interface';

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
    assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
    tags: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    title: 'Design homepage',
    description: 'Design new homepage layout',
    status: 'done',
    priority: 'low',
    dueDate: '2025-03-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a2', name: 'John', email: 'john@test.com', avatar: '' },
    tags: ['design'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

describe('TeamComponent', () => {
  let component: TeamComponent;
  let fixture: ComponentFixture<TeamComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TeamComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TeamComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    fixture.detectChanges();

    const req = httpMock.expectOne('assets/tasks.json');
    req.flush({ tasks: mockTasks });
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Team header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Team');
  });

  it('should render correct assignee count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('2 assignees found');
  });

  it('should group tasks by assignee correctly', () => {
    expect(component.users().length).toBe(2);
  });

  it('should render user cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(2);
  });

  it('should render assignee names', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Sarah');
    expect(el.textContent).toContain('John');
  });

  it('should render assignee emails', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('sarah@test.com');
    expect(el.textContent).toContain('john@test.com');
  });

  it('should render correct task counts', () => {
    const sarahUser = component.users().find(u => u.assignee.id === 'a1');
    expect(sarahUser?.tasks.length).toBe(2);

    const johnUser = component.users().find(u => u.assignee.id === 'a2');
    expect(johnUser?.tasks.length).toBe(1);
  });

  it('should count todo tasks correctly', () => {
    const sarahUser = component.users().find(u => u.assignee.id === 'a1');
    expect(sarahUser?.todoCount).toBe(1);
  });

  it('should count in progress tasks correctly', () => {
    const sarahUser = component.users().find(u => u.assignee.id === 'a1');
    expect(sarahUser?.inProgressCount).toBe(1);
  });

  it('should count done tasks correctly', () => {
    const johnUser = component.users().find(u => u.assignee.id === 'a2');
    expect(johnUser?.doneCount).toBe(1);
  });

  it('should render progress bar', () => {
    const progressBar = fixture.debugElement.query(By.css('.bg-green-400'));
    expect(progressBar).toBeTruthy();
  });

  it('should render Todo status breakdown', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Todo');
  });

  it('should render In Progress status breakdown', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('In Progress');
  });

  it('should render Done status breakdown', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Done');
  });

  it('should render assignee initials', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('SA');
    expect(el.textContent).toContain('JO');
  });

  it('should return correct avatar color', () => {
    const color = component.getAvatarColor('Sarah');
    expect(['bg-blue-500', 'bg-green-500', 'bg-purple-500',
      'bg-red-500', 'bg-yellow-500', 'bg-pink-500']).toContain(color);
  });

  it('should render completion percentage', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('% completed');
  });
});