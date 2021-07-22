import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnail1m3xs1sComponent } from './thumbnail1m3xs1s.component';

describe('Thumbnail1m3xs1sComponent', () => {
  let component: Thumbnail1m3xs1sComponent;
  let fixture: ComponentFixture<Thumbnail1m3xs1sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnail1m3xs1sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnail1m3xs1sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
