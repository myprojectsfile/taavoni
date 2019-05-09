import { Component, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';
import { MoamelehType } from '../shared/types/moameleh';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';
import { Observable } from '../../../node_modules/rxjs';
import { ApiService } from '../shared/services/api.service';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelat.component.html',
  styleUrls: ['./moamelat.component.css']
})
export class MoamelatComponent {
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  @ViewChild('safeKharid')
  safeKharidComponent: DarkhastComponent;

  @ViewChild('safeForush')
  safeForushComponent: DarkhastComponent;

  tradeButtonEnabled = true;
  avalinForushandeh: DarkhastType;
  avalinKharidar: DarkhastType;
  gheymatSahmForushandeh;
  gheymatSahmKharidar;

  doTrade() {
    this.avalinForushandeh = this.safeForushComponent.getAvalinDarkhast();
    this.avalinKharidar = this.safeKharidComponent.getAvalinDarkhast();
    const tedadSahmForushandeh = this.avalinForushandeh.tedadBaghiMandeh;
    const tedadSahmKharidar = this.avalinKharidar.tedadBaghiMandeh;
    this.gheymatSahmForushandeh = this.avalinForushandeh.gheymatSahm;
    this.gheymatSahmKharidar = this.avalinKharidar.gheymatSahm;
    let _tedadSahmMoameleh = 0;
    // مشخصات درخواست های خرید و فروش
    let _tedadBaghimandehKharidar = this.avalinKharidar.tedadBaghiMandeh;
    let _tedadMoamelehShodehKharidar = this.avalinKharidar.tedadMoamelehShodeh;
    let _tedadBaghimandehForushandeh = this.avalinForushandeh.tedadBaghiMandeh;
    let _tedadMoamelehShodehForushandeh = this.avalinForushandeh
      .tedadMoamelehShodeh;

    // مشخص میکنیم تعداد درخواست خرید ها بیشتر است یا فروش ها
    // در صورتی که تعداد فروشنده بیشتر یا مساوی خریدار باشد
    if (tedadSahmForushandeh >= tedadSahmKharidar) {
      _tedadSahmMoameleh = tedadSahmKharidar;
      // در صورتی که تعداد فروشنده کمتر از خریدار باشد
    } else {
      _tedadSahmMoameleh = tedadSahmForushandeh;
    }

    // محاسبه تعداد معامله شده و تعداد باقیمانده خریدار و فروشنده
    _tedadMoamelehShodehKharidar =
      _tedadMoamelehShodehKharidar + _tedadSahmMoameleh;
    _tedadBaghimandehKharidar =
      this.avalinKharidar.tedadSahm - _tedadMoamelehShodehKharidar;
    _tedadMoamelehShodehForushandeh =
      _tedadMoamelehShodehForushandeh + _tedadSahmMoameleh;
    _tedadBaghimandehForushandeh =
      this.avalinForushandeh.tedadSahm - _tedadMoamelehShodehForushandeh;

    // وضعیت درخواست خرید و فروش را محاسبه می کنیم
    let vazeiatDarkhastKharid, vazeiatDarkhastForush: string;

    if (_tedadBaghimandehKharidar === 0) {
      vazeiatDarkhastKharid = 'انجام شده';
    } else {
      vazeiatDarkhastKharid = 'در حال انجام';
    }

    if (_tedadBaghimandehForushandeh === 0) {
      vazeiatDarkhastForush = 'انجام شده';
    } else {
      vazeiatDarkhastForush = 'در حال انجام';
    }

    // قیمت معامله را محاسبه میکنیم
    const _gheymatMoameleh = this.gheymatSahmKharidar;
    // ردیف معامله را آماده میکنیم
    const moamelehNewRow: any = {
      tedadSahmMoameleh: _tedadSahmMoameleh,
      gheymatMoameleh: _gheymatMoameleh,
      arzeshSahmMoameleh: _tedadSahmMoameleh * _gheymatMoameleh,
      kharidar: this.avalinKharidar.user._id,
      forushandeh: this.avalinForushandeh.user._id,
      sabtKonandeh: this.authService.getUserId,
      darkhastKharid: this.avalinKharidar._id,
      darkhastForush: this.avalinForushandeh._id
    };

    // آبجکت به روز رسانی درخواست خرید و فروش را ایجاد می کنیم
    const darkhastKharidUpdateObj: DarkhastType = {};
    const darkhastForushUpdateObj: DarkhastType = {};

    const darkhastKharidId: string = this.avalinKharidar._id;
    const darkhastForushId: string = this.avalinForushandeh._id;

    darkhastKharidUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehKharidar;
    darkhastKharidUpdateObj.tedadBaghiMandeh = _tedadBaghimandehKharidar;
    darkhastKharidUpdateObj.vazeiat = vazeiatDarkhastKharid;

    darkhastForushUpdateObj.tedadBaghiMandeh = _tedadBaghimandehForushandeh;
    darkhastForushUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehForushandeh;
    darkhastForushUpdateObj.vazeiat = vazeiatDarkhastForush;

    // ثبت معامله
    this.apiService.sabtMoameleh(moamelehNewRow).subscribe(
      (newMoameleh: MoamelehType) => {
        this.toastr.success('معامله جدید با موفقیت ثبت شد');
        this.updateDarkhastKharid(
          darkhastKharidUpdateObj,
          darkhastKharidId
        ).subscribe(
          data => {
            // برای ردیف درخواست خرید ، یک ردیف معامله ثبت میکنیم
            // this.toastr.success('مشخصات درخواست خرید با موفقیت به روزرسانی شد');
            this.updateDarkhastForush(
              darkhastForushUpdateObj,
              darkhastForushId
            ).subscribe(
              () => {
                // برای ردیف درخواست فروش ، یک ردیف معامله ثبت میکنیم
                // this.toastr.success('مشخصات درخواست فروش با موفقیت به روزرسانی شد');
                // نمای گریدهای خرید و فروش را به روز رسانی میکنیم
                this.safeKharidComponent.loadDarkhastData();
                this.safeForushComponent.loadDarkhastData();
                // جدول دارایی سهام - پورتفو - خریدار و فروشنده را به روز رسانی میکنیم
                // this.UpdatePortfoKharidar(
                //   this.avalinKharidar,
                //   _tedadSahmMoameleh,
                //   newMoameleh
                // );
                // this.UpdatePortfoForushandeh(
                //   this.avalinForushandeh,
                //   _tedadSahmMoameleh,
                //   newMoameleh
                // );
              },
              error => {
                console.log(error);
                this.toastr.error(
                  'خطا در به روز رسانی مشخصات درخواست فروش.با پشتیبان سامانه تماس بگیرید'
                );
              }
            );
          },
          error => {
            console.log(error);
            this.toastr.error(
              'خطا در به روز رسانی مشخصات درخواست خرید.با پشتیبان سامانه تماس بگیرید'
            );
          }
        );
      },
      error => {
        console.log(error);
      }
    );
  }


  private updateDarkhastForush(
    darkhastForushUpdateObj: DarkhastType,
    darkhastForushId: string
  ): Observable<DarkhastType> {
    return this.apiService.updateDarkhastById(
      darkhastForushUpdateObj,
      darkhastForushId
    );
  }

  private updateDarkhastKharid(
    darkhastKharidUpdateObj: DarkhastType,
    darkhastKharidId: string
  ): Observable<DarkhastType> {
    return this.apiService.updateDarkhastById(
      darkhastKharidUpdateObj,
      darkhastKharidId
    );
  }

  listKharidChanged(listKharid: DarkhastType[]) {
    this.avalinForushandeh = this.safeForushComponent.getAvalinDarkhast();
    this.avalinKharidar = this.safeKharidComponent.getAvalinDarkhast();
    this.gheymatSahmForushandeh = this.avalinForushandeh
      ? this.avalinForushandeh.gheymatSahm
      : 0;
    this.gheymatSahmKharidar = this.avalinKharidar
      ? this.avalinKharidar.gheymatSahm
      : 0;
    const listKharidGtZero: boolean = listKharid.length > 0;
    this.tradeButtonEnabled =
      this.tradeButtonEnabled &&
      listKharidGtZero &&
      this.gheymatSahmKharidar >= this.gheymatSahmForushandeh;
  }

  listForushChanged(listForush: DarkhastType[]) {
    this.avalinForushandeh = this.safeForushComponent.getAvalinDarkhast();
    this.avalinKharidar = this.safeKharidComponent.getAvalinDarkhast();
    this.gheymatSahmForushandeh = this.avalinForushandeh
      ? this.avalinForushandeh.gheymatSahm
      : 0;
    this.gheymatSahmKharidar = this.avalinKharidar
      ? this.avalinKharidar.gheymatSahm
      : 0;
    const listForushGtZero: boolean = listForush.length > 0;
    this.tradeButtonEnabled =
      this.tradeButtonEnabled &&
      listForushGtZero &&
      this.gheymatSahmKharidar >= this.gheymatSahmForushandeh;
  }
}
