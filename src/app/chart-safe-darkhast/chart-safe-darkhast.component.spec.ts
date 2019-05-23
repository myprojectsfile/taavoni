import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartSafeDarkhastComponent } from './chart-safe-darkhast.component';

describe('ChartSafeDarkhastComponent', () => {
  let component: ChartSafeDarkhastComponent;
  let fixture: ComponentFixture<ChartSafeDarkhastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartSafeDarkhastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartSafeDarkhastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
