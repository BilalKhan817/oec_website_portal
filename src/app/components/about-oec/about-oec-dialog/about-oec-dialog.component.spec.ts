import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOecDialogComponent } from './about-oec-dialog.component';

describe('AboutOecDialogComponent', () => {
  let component: AboutOecDialogComponent;
  let fixture: ComponentFixture<AboutOecDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutOecDialogComponent]
    });
    fixture = TestBed.createComponent(AboutOecDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
