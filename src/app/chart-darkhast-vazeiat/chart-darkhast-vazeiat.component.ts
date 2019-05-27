import { Component, OnInit } from '@angular/core';
import { ChartType, ChartOptions } from 'chart.js';
import { Label } from 'ng2-charts';
// import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import * as pluginDataLabels from 'chartjs-plugin-labels';
import { ApiService } from '../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';
declare var Chart: any;

@Component({
  selector: 'app-chart-darkhast-vazeiat',
  templateUrl: './chart-darkhast-vazeiat.component.html',
  styleUrls: ['./chart-darkhast-vazeiat.component.css']
})
export class ChartDarkhastVazeiatComponent implements OnInit {
  public pieChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'وضعیت صف درخواست ها'
    },
    responsive: true,
    legend: {
      position: 'top',
      labels: {
        fontColor: 'black',
        fontFamily: 'sahel'
      }
    },
    plugins: {
      labels: [
        {
          render: 'percentage',
          // arc: true,
          position: 'border'
        }
      ]
    }
  };
  public pieChartLabels: Label[] = [];
  public pieChartData: number[] = [];
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;
  public pieChartPlugins = [pluginDataLabels];
  public pieChartColors = [
    {
      backgroundColor: ['#fbd5dd', '#ffecd9', '#dbf2f2', '#ebe0ff']
    }
  ];

  constructor(private apiService: ApiService, private toastr: ToastrService) {
    Chart.Legend.prototype.afterFit = function() {
      this.height = this.height + 5;
    };
  }

  ngOnInit() {
    Chart.defaults.global.defaultFontColor = 'black';
    Chart.defaults.global.defaultFontFamily = 'sahel';
    this.apiService.getAggDarkhastByVazeiat().subscribe(
      darkhastha => {
        this.pieChartLabels = darkhastha.map(a => a._id);
        this.pieChartData = darkhastha.map(a => a.tedadDarkhast);
      },
      error => {
        this.toastr.error(
          'خطا در دریافت اطلاعات نمودار درخواست ها',
          'خطا در فرواخوانی سرویس'
        );
        console.log(error);
      }
    );
  }

  // events
  public chartClicked({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active
  }: {
    event: MouseEvent;
    active: {}[];
  }): void {
    console.log(event, active);
  }

  addSlice() {
    this.pieChartLabels.push(['Line 1', 'Line 2', 'Line 3']);
    this.pieChartData.push(400);
    this.pieChartColors[0].backgroundColor.push('rgba(196,79,244,0.3)');
  }

  removeSlice() {
    this.pieChartLabels.pop();
    this.pieChartData.pop();
    this.pieChartColors[0].backgroundColor.pop();
  }

  changeLegendPosition() {
    this.pieChartOptions.legend.position =
      this.pieChartOptions.legend.position === 'left' ? 'top' : 'left';
  }
}
