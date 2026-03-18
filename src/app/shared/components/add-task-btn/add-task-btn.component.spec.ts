import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddTaskBtnComponent } from './add-task-btn.component';
import { MatDialog } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

const mockDialog = {
  open: jasmine.createSpy('open').and.returnValue({
    afterClosed: () => ({ subscribe: () => {} })
  })
};

describe('AddTaskBtnComponent', () => {
  let component: AddTaskBtnComponent;
  let fixture: ComponentFixture<AddTaskBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskBtnComponent],
      providers: [
        provideNoopAnimations(),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: MatDialog, useValue: mockDialog }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddTaskBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render New Task text', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('New Task');
  });

  it('should render add icon', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('add');
  });

  it('should open dialog when button is clicked', () => {
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('should call openDialog on button click', () => {
    spyOn(component, 'openDialog');
    const button = fixture.nativeElement.querySelector('button');
    button.click();
    expect(component.openDialog).toHaveBeenCalled();
  });
});