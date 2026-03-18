import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StatusCardComponent } from './status-card.component';
import {  provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { Task } from '../../../shared/interfaces/task.interface';

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Task One',
    description: 'Description',
    status: 'todo',
    priority: 'high',
    dueDate: '2025-01-01',
    isOverdue: false,
    completedAt: '',
    assignee: { id: 'a1', name: 'Sarah', email: 'sarah@test.com', avatar: '' },
    tags: ['tag1'],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

describe('StatusCardComponent', () => {
  let component: StatusCardComponent;
  let fixture: ComponentFixture<StatusCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatusCardComponent],
      
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(StatusCardComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('data', mockTasks);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display task count', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('1');
  });

  it('should render task titles', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Task One');
  });
});