import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TaskCardComponent } from './task-card.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { Task } from '../../interfaces/task.interface';

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
    tags: ['bug', 'frontend'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    title: 'Update docs',
    description: 'Update API documentation',
    status: 'in_progress',
    priority: 'low',
    dueDate: '2025-02-01',
    isOverdue: true,
    completedAt: '',
    assignee: { id: 'a2', name: 'John', email: 'john@test.com', avatar: '' },
    tags: ['docs'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

describe('TaskCardComponent', () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockTasks);
    fixture.componentRef.setInput('listId', 'todo');
    fixture.componentRef.setInput('connectedTo', ['in_progress', 'done']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render all task cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(2);
  });

  it('should render task titles', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Fix login bug');
    expect(el.textContent).toContain('Update docs');
  });

  it('should render task descriptions', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Login page crashes on mobile');
    expect(el.textContent).toContain('Update API documentation');
  });

  it('should render priority badges', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('HIGH');
    expect(el.textContent).toContain('LOW');
  });

  it('should render assignee names', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('@Sarah');
    expect(el.textContent).toContain('@John');
  });

  it('should render tags', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('bug');
    expect(el.textContent).toContain('frontend');
    expect(el.textContent).toContain('docs');
  });

  it('should show overdue icon for overdue tasks', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('⚠️');
  });

  it('should show due date icon for non-overdue tasks', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('📅');
  });

  it('should render assignee initials', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('SA');
    expect(el.textContent).toContain('JO');
  });

  it('should emit taskDropped when onDrop is called with different containers', () => {
    spyOn(component.taskDropped, 'emit');
    const mockEvent: any = {
      previousContainer: { data: mockTasks, id: 'todo' },
      container: { data: [], id: 'done' },
      previousIndex: 0,
      currentIndex: 0
    };
    component.onDrop(mockEvent);
    expect(component.taskDropped.emit).toHaveBeenCalledWith({
      task: mockTasks[0],
      newStatus: 'done' as any
    });
  });


  it('should navigate on task click', () => {
    spyOn(component, 'onTaskClick');
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    cards[0].triggerEventHandler('click', {});
    expect(component.onTaskClick).toHaveBeenCalledWith(mockTasks[0]);
  });

  it('should render empty list when data is empty', () => {
    fixture.componentRef.setInput('data', []);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('mat-card'));
    expect(cards.length).toBe(0);
  });
});