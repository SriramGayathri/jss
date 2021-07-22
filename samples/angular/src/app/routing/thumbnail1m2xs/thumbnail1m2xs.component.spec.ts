import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Thumbnail1m2xsComponent } from './thumbnail1m2xs.component';

describe('Thumbnail1m2xsComponent', () => {
  let component: Thumbnail1m2xsComponent;
  let fixture: ComponentFixture<Thumbnail1m2xsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Thumbnail1m2xsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Thumbnail1m2xsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
