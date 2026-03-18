import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => ({ subscribe: () => {} })
  })
};

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render Dashboard link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Dashboard');
  });

  it('should render Tasks link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Tasks');
  });

  it('should render Analytics link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Analytics');
  });

  it('should render Team link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Team');
  });

  it('should render Settings link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Settings');
  });

  it('should render Calendar link', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Calendar');
  });

  it('should render New Task button', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('New Task');
  });

  it('should have correct routerLink for dashboard', () => {
    const buttons = fixture.nativeElement.querySelectorAll('button[ng-reflect-router-link]');
    const dashboardBtn = Array.from(buttons).find((btn: any) =>
      btn.textContent.includes('Dashboard')
    ) as HTMLElement;
    expect(dashboardBtn).toBeTruthy();
  });
});