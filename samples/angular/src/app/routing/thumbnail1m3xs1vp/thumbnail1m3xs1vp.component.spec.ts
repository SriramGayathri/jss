import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnail1m3xs1vpComponent } from './thumbnail1m3xs1vp.component';

describe('Thumbnail1m3xs1vpComponent', () => {
  let component: Thumbnail1m3xs1vpComponent;
  let fixture: ComponentFixture<Thumbnail1m3xs1vpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnail1m3xs1vpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnail1m3xs1vpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
