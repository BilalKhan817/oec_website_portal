import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OecAtGlanceComponent } from './oec-at-glance.component';

describe('OecAtGlanceComponent', () => {
  let component: OecAtGlanceComponent;
  let fixture: ComponentFixture<OecAtGlanceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OecAtGlanceComponent]
    });
    fixture = TestBed.createComponent(OecAtGlanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
