import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnailrows4sComponent } from './thumbnailrows4s.component';

describe('Thumbnailrows4sComponent', () => {
  let component: Thumbnailrows4sComponent;
  let fixture: ComponentFixture<Thumbnailrows4sComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnailrows4sComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnailrows4sComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
