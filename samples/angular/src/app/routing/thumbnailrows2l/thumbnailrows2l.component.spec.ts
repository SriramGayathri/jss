import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnailrows2lComponent } from './thumbnailrows2l.component';

describe('Thumbnailrows2lComponent', () => {
  let component: Thumbnailrows2lComponent;
  let fixture: ComponentFixture<Thumbnailrows2lComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnailrows2lComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnailrows2lComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
