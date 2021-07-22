import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnailrows3mComponent } from './thumbnailrows3m.component';

describe('Thumbnailrows3mComponent', () => {
  let component: Thumbnailrows3mComponent;
  let fixture: ComponentFixture<Thumbnailrows3mComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnailrows3mComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnailrows3mComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
