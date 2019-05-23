import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

@Component({
  selector: 'app-chart-safe-darkhast',
  templateUrl: './chart-safe-darkhast.component.html',
  styleUrls: ['./chart-safe-darkhast.component.css']
})
export class ChartSafeDarkhastComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'صف خرید' },
    { data: [65, 59, 80, 81, 56, 55, 40], label: 'صف فروش' }
  ];
  public lineChartLabels: Label[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July'
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true
  };
  public lineChartColors: Color[] = [
    {
      borderColor: '#70aa03',
      backgroundColor: '#a0ed10'
    },
    {
      borderColor: '#c4a701',
      backgroundColor: '#ffd902'
    }
  ];
  public lineChartLegend = true;
  public lineChartType: ChartType = 'bar';
  public lineChartPlugins = [];

  constructor() {}

  ngOnInit() {}
}
