import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MainLayoutComponent } from './main-layout.component';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { By } from '@angular/platform-browser';
import { LoadingService } from '../../core/services/loading.service';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => ({ subscribe: (cb: any) => cb(null) })
  })
};

describe('MainLayoutComponent', () => {
  let component: MainLayoutComponent;
  let fixture: ComponentFixture<MainLayoutComponent>;
  let httpMock: HttpTestingController;
  let loadingService: LoadingService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([]),
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MainLayoutComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    loadingService = TestBed.inject(LoadingService);
    fixture.detectChanges();

    const req = httpMock.match('assets/tasks.json');
    req.forEach(r => r.flush({ tasks: [] }));
    fixture.detectChanges();
  });

  afterEach(() => httpMock.verify());

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should inject LoadingService', () => {
    expect(component.loadingService).toBeTruthy();
  });

  it('should render navbar', () => {
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    expect(navbar).toBeTruthy();
  });

  it('should render sidebar', () => {
    const sidebar = fixture.debugElement.query(By.css('app-sidebar'));
    expect(sidebar).toBeTruthy();
  });

  it('should render router outlet', () => {
    const routerOutlet = fixture.debugElement.query(By.css('router-outlet'));
    expect(routerOutlet).toBeTruthy();
  });

  it('should render layout container', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.layout-container')).toBeTruthy();
  });

  it('should render content wrapper', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.content')).toBeTruthy();
  });

  it('should not show loading spinner by default', () => {
    loadingService.isLoading.set(false);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeFalsy();
  });

  it('should show loading spinner when isLoading is true', () => {
    loadingService.isLoading.set(true);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();
  });

  it('should hide loading spinner when isLoading is false', () => {
    loadingService.isLoading.set(true);
    fixture.detectChanges();
    loadingService.isLoading.set(false);
    fixture.detectChanges();
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeFalsy();
  });

  it('should show loading overlay when isLoading is true', () => {
    loadingService.isLoading.set(true);
    fixture.detectChanges();
    const overlay = fixture.debugElement.query(By.css('.fixed.inset-0'));
    expect(overlay).toBeTruthy();
  });

  it('should show Loading text when isLoading is true', () => {
    loadingService.isLoading.set(true);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Loading...');
  });

  it('should call onSearchChanged with event value', () => {
    spyOn(console, 'log');
    component.onSearchChanged('test query');
    expect(console.log).toHaveBeenCalledWith('test query');
  });

  it('should handle navbar searchChanged event', () => {
    spyOn(component, 'onSearchChanged');
    const navbar = fixture.debugElement.query(By.css('app-navbar'));
    navbar.triggerEventHandler('searchChanged', 'test query');
    expect(component.onSearchChanged).toHaveBeenCalledWith('test query');
  });
});