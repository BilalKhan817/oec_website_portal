import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExecutiveDialogComponent } from './executive-dialog.component';

describe('ExecutiveDialogComponent', () => {
  let component: ExecutiveDialogComponent;
  let fixture: ComponentFixture<ExecutiveDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExecutiveDialogComponent]
    });
    fixture = TestBed.createComponent(ExecutiveDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
