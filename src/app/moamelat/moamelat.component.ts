import { Component, OnInit, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelat.component.html',
  styleUrls: ['./moamelat.component.css']
})
export class MoamelatComponent implements OnInit {

  constructor() { }

  @ViewChild('safeKharid') safeKharidComponent: DarkhastComponent;
  @ViewChild('safeForush') safeForushComponent: DarkhastComponent;

  ngOnInit() {
    
  }

  doTrade(){
    // چک میکنیم آیا ردیفی برای انجام معامله وحود دارد یا خیر
    // مشخص میکنیم تعداد درخواست خرید ها بیشتر است یا فروش ها
    // تعداد سهام درخواستی و وضعیت درخواست را به روز رسانی میکنیم
    // برای ردیف های درخواست خرید و فروش ، یک ردیف معامله ثبت میکنیم
    // یک ردیف در جدول معاملات ثبت میکنیم
    // جدول دارایی سهام را به روز رسانی میکنیم
    // نمای گریدهای خرید و فروش را به روز رسانی میکنیم
    // وضعیت دکمه ثبت معامله را به روز رسانی میکنیم
  }
}
