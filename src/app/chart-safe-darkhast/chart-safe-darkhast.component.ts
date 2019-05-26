import { Component, OnInit } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { ApiService, DarkhastAggType } from '../shared/services/api.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-chart-safe-darkhast',
  templateUrl: './chart-safe-darkhast.component.html',
  styleUrls: ['./chart-safe-darkhast.component.css']
})
export class ChartSafeDarkhastComponent implements OnInit {
  public lineChartData: ChartDataSets[] = [
    { data: [0] },
    { data: [0] }
  ];
  public lineChartLabels: Label[] = [
    'صف درخواست خرید و فروش'
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

  constructor(private apiService: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.apiService.getAggDarkhastSaff().subscribe(
      (darkhastha: DarkhastAggType[]) => {

        darkhastha.forEach((darkhast,index) => {
          // this.lineChartData.push({ data: [darkhast.tedadSahm, 0], label: darkhast._id });
          this.lineChartData[index].data.push(darkhast.tedadSahm);
          this.lineChartData[index].label = darkhast._id;
        });
        
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
