import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartMoamelatComponent } from './chart-moamelat.component';

describe('ChartMoamelatComponent', () => {
  let component: ChartMoamelatComponent;
  let fixture: ComponentFixture<ChartMoamelatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartMoamelatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartMoamelatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
