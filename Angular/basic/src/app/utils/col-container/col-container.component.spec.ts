import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColContainerComponent } from './col-container.component';

describe('ColContainerComponent', () => {
  let component: ColContainerComponent;
  let fixture: ComponentFixture<ColContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ColContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
