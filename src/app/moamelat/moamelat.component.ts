import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';
import { MoamelatService } from './moamelat.service';
import { MoamelehType } from '../shared/types/moameleh';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelat.component.html',
  styleUrls: ['./moamelat.component.css']
})
export class MoamelatComponent implements OnInit, AfterViewInit {


  constructor(private moamelehService: MoamelatService, private toastr: ToastrService) { }

  @ViewChild('safeKharid')
  safeKharidComponent: DarkhastComponent;
  @ViewChild('safeForush')
  safeForushComponent: DarkhastComponent;

  tradeButtonEnabled: boolean = true;

  ngOnInit() {

  }

  ngAfterViewInit(): void {
  }


  doTrade() {
    let avalinForushandeh: DarkhastType = this.safeForushComponent.getAvalinDarkhast();
    let avalinKharidar: DarkhastType = this.safeKharidComponent.getAvalinDarkhast();
    let tedadSahmForushandeh = avalinForushandeh.tedadBaghiMandeh;
    let tedadSahmKharidar = avalinKharidar.tedadBaghiMandeh;
    let _tedadSahmMoameleh = 0;
    let _arzeshSahmMoameleh = 0;
    // مشخصات درخواست های خرید و فروش
    let _tedadBaghimandehKharidar = avalinKharidar.tedadBaghiMandeh;
    let _tedadMoamelehShodehKharidar = avalinKharidar.tedadMoamelehShodeh;
    let _tedadBaghimandehForushandeh = avalinForushandeh.tedadBaghiMandeh;
    let _tedadMoamelehShodehForushandeh = avalinForushandeh.tedadMoamelehShodeh;

    // مشخص میکنیم تعداد درخواست خرید ها بیشتر است یا فروش ها
    // در صورتی که تعداد فروشنده بیشتر یا مساوی خریدار باشد
    if (tedadSahmForushandeh >= tedadSahmKharidar) {
      _tedadSahmMoameleh = tedadSahmKharidar;
      //در صورتی که تعداد فروشنده کمتر از خریدار باشد
    } else {
      _tedadSahmMoameleh = tedadSahmForushandeh;
    }

    // محاسبه تعداد معامله شده و تعداد باقیمانده خریدار و فروشنده
    _tedadMoamelehShodehKharidar = _tedadMoamelehShodehKharidar + _tedadSahmMoameleh;
    _tedadBaghimandehKharidar = avalinKharidar.tedadSahm - _tedadMoamelehShodehKharidar;
    _tedadMoamelehShodehForushandeh = _tedadMoamelehShodehForushandeh + _tedadSahmMoameleh;;
    _tedadBaghimandehForushandeh = avalinForushandeh.tedadSahm - _tedadMoamelehShodehForushandeh;

    // وضعیت درخواست خرید و فروش را محاسبه می کنیم

    // آبجکت به روز رسانی درخواست خرید و فروش را ایجاد می کنیم

    // ردیف معامله را ثبت میکنیم
    this.PostNewMoameleh(avalinForushandeh, avalinKharidar, _tedadSahmMoameleh, _arzeshSahmMoameleh);
    // برای ردیف های درخواست خرید و فروش ، یک ردیف معامله ثبت میکنیم

    // جدول دارایی سهام را به روز رسانی میکنیم

    // لیست صف خرید و فروش را به روز رسانی میکنیم 

    // نمای گریدهای خرید و فروش را به روز رسانی میکنیم

  };

  private PostNewMoameleh(avalinForushandeh: DarkhastType, avalinKharidar: DarkhastType, _tedadSahmMoameleh: number, _arzeshSahmMoameleh: number) {
    let _forushandeh_username = avalinForushandeh.username;
    let _forushandeh_fullName = avalinForushandeh.fullName;
    let _forushandeh_darkhastId = avalinForushandeh._id;
    let _kharidar_username = avalinKharidar.username;
    let _kharidar_fullName = avalinKharidar.fullName;
    let _kharidar_darkhastId = avalinKharidar._id;

    let moameleh: MoamelehType = {
      tedadSahmMoameleh: _tedadSahmMoameleh,
      arzeshSahmMoameleh: _arzeshSahmMoameleh,
      forushandeh_username: _forushandeh_username,
      forushandeh_fullName: _forushandeh_fullName,
      forushandeh_darkhastId: _forushandeh_darkhastId,
      kharidar_username: _kharidar_username,
      kharidar_fullName: _kharidar_fullName,
      kharidar_darkhastId: _kharidar_darkhastId
    };
    this.moamelehService.sabtMoameleh(moameleh).subscribe((newMoameleh) => {
      console.log(newMoameleh);
      this.toastr.success('معامله جدید با موفقیت ثبت شد');
    }, (error) => {
      console.log(error);
    });
  }

  listKharidChanged(listKharid: DarkhastType[]) {
    let listKharidGtZero: boolean = (listKharid.length > 0);
    this.tradeButtonEnabled = this.tradeButtonEnabled && listKharidGtZero;
  }

  listForushChanged(listForush: DarkhastType[]) {
    let listForushGtZero: boolean = (listForush.length > 0);
    this.tradeButtonEnabled = this.tradeButtonEnabled && listForushGtZero;
  }
}
