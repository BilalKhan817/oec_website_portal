import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GoverningLawComponent } from './governing-law.component';

describe('GoverningLawComponent', () => {
  let component: GoverningLawComponent;
  let fixture: ComponentFixture<GoverningLawComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GoverningLawComponent]
    });
    fixture = TestBed.createComponent(GoverningLawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
