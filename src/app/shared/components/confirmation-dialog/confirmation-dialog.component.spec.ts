import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmationDialogComponent } from './confirmation-dialog.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

const mockDialogRef = {
  close: jasmine.createSpy('close')
};

const mockDialogData = {
  header: 'Confirm Delete',
  message: 'Are you sure you want to delete this task?',
  btnLabel: 'Delete'
};

describe('ConfirmationDialogComponent', () => {
  let component: ConfirmationDialogComponent;
  let fixture: ComponentFixture<ConfirmationDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDialogComponent],
      providers: [
        provideNoopAnimations(),
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render header', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Confirm Delete');
  });

  it('should render message', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Are you sure you want to delete this task?');
  });

  it('should render confirm button label', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Delete');
  });

  it('should render cancel button', () => {
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Cancel');
  });

  it('should call onClick with false when cancel is clicked', () => {
    spyOn(component, 'onClick');
    const cancelBtn = fixture.debugElement.queryAll(By.css('button'))[0];
    cancelBtn.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(component.onClick).toHaveBeenCalledWith(false, jasmine.anything());
  });

  it('should call onClick with true when confirm is clicked', () => {
    spyOn(component, 'onClick');
    const confirmBtn = fixture.debugElement.queryAll(By.css('button'))[1];
    confirmBtn.triggerEventHandler('click', { stopPropagation: () => {} });
    expect(component.onClick).toHaveBeenCalledWith(true, jasmine.anything());
  });
});