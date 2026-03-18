import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsComponent } from './analytics.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
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
  }
];

describe('AnalyticsComponent', () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
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

  it('should render Analytics header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Analytics');
  });

  it('should render subtitle', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Track your task performance and activity');
  });

  it('should render app-charts', () => {
    const charts = fixture.debugElement.query(By.css('app-charts'));
    expect(charts).toBeTruthy();
  });

  it('should render app-activity-feed', () => {
    const feed = fixture.debugElement.query(By.css('app-activity-feed'));
    expect(feed).toBeTruthy();
  });
});