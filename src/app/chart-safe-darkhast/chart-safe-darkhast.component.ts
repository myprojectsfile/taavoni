import { Component, OnInit } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';
import { Label } from 'ng2-charts';
import { ApiService, DarkhastAggType } from '../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chart-safe-darkhast',
  templateUrl: './chart-safe-darkhast.component.html',
  styleUrls: ['./chart-safe-darkhast.component.css']
})
export class ChartSafeDarkhastComponent implements OnInit {
  public barChartOptions: ChartOptions = {
    title: {
      display: true,
      text: 'تعداد سهام صف درخواست خرید و فروش'
    },
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'center',
        align: 'center'
      }
    }
  };
  public barChartLabels: Label[] = ['صف خرید و فروش'];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];

  public barChartData: ChartDataSets[] = [
    { data: [], borderWidth: 1, label: 'صف خرید' },
    { data: [], borderWidth: 1, label: 'صف فروش' }
  ];
  public barChartColors = [
    {
      backgroundColor: ['#ebe0ff', '#fff5dd']
    }
  ];
  constructor(private apiService: ApiService, private toastr: ToastrService) {}

  ngOnInit() {
    this.apiService.getAggDarkhastSaff().subscribe(
      (darkhastha: DarkhastAggType[]) => {
        darkhastha.forEach((darkhast: DarkhastAggType) => {
          if (darkhast._id === 'خرید') {
            (this.barChartData[0].data as (number | Chart.ChartPoint)[]).push(
              darkhast.tedadSahm
            );
          } else {
            (this.barChartData[1].data as (number | Chart.ChartPoint)[]).push(
              darkhast.tedadSahm
            );
          }
        });
        (this.barChartData[0].data as (number | Chart.ChartPoint)[]).push(0);
        (this.barChartData[1].data as (number | Chart.ChartPoint)[]).push(0);
      },
      error => {
        this.toastr.error(
          'خطا در دریافت اطلاعات نمودار صف درخواست ها',
          'خطا در فرواخوانی سرویس'
        );
        console.log(error);
      }
    );
  }
}
