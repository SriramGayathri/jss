import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnail1s1lComponent } from './thumbnail1s1l.component';

describe('Thumbnail1s1lComponent', () => {
  let component: Thumbnail1s1lComponent;
  let fixture: ComponentFixture<Thumbnail1s1lComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnail1s1lComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnail1s1lComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
