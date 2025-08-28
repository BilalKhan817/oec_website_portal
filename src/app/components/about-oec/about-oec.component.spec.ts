import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutOecComponent } from './about-oec.component';

describe('AboutOecComponent', () => {
  let component: AboutOecComponent;
  let fixture: ComponentFixture<AboutOecComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AboutOecComponent]
    });
    fixture = TestBed.createComponent(AboutOecComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
