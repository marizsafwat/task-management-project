import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTaskBtnComponent } from './add-task-btn.component';

describe('AddTaskBtnComponent', () => {
  let component: AddTaskBtnComponent;
  let fixture: ComponentFixture<AddTaskBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddTaskBtnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddTaskBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
