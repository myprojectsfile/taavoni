import { Component, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';
import { MoamelehType } from '../shared/types/moameleh';
import { ToastrService } from 'ngx-toastr';
import { DarkhastType } from '../shared/types/darkhast';
import { Observable } from '../../../node_modules/rxjs';
import { PortfoType } from '../shared/types/portfo';
import { ApiService } from '../shared/services/api.service';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelat.component.html',
  styleUrls: ['./moamelat.component.css']
})
export class MoamelatComponent {
  constructor(private apiService: ApiService, private toastr: ToastrService) {}

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
    const moamelehNewRow = this.prepareNewMoamelehRow(
      this.avalinForushandeh,
      this.avalinKharidar,
      _tedadSahmMoameleh,
      _gheymatMoameleh
    );
    // آبجکت به روز رسانی درخواست خرید و فروش را ایجاد می کنیم
    const moamelatDarkhastKharid = this.avalinKharidar.moamelat || [];
    const moamelatDarkhastForush = this.avalinForushandeh.moamelat || [];
    const darkhastKharidUpdateObj: DarkhastType = {};
    const darkhastForushUpdateObj: DarkhastType = {};
    const darkhastKharidId: string = this.avalinKharidar._id;
    const darkhastForushId: string = this.avalinForushandeh._id;

    darkhastKharidUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehKharidar;
    darkhastKharidUpdateObj.tedadBaghiMandeh = _tedadBaghimandehKharidar;
    darkhastKharidUpdateObj.vazeiat = vazeiatDarkhastKharid;
    moamelatDarkhastKharid.push(moamelehNewRow);
    darkhastKharidUpdateObj.moamelat = moamelatDarkhastKharid;

    darkhastForushUpdateObj.tedadBaghiMandeh = _tedadBaghimandehForushandeh;
    darkhastForushUpdateObj.tedadMoamelehShodeh = _tedadMoamelehShodehForushandeh;
    darkhastForushUpdateObj.vazeiat = vazeiatDarkhastForush;
    moamelatDarkhastForush.push(moamelehNewRow);
    darkhastForushUpdateObj.moamelat = moamelatDarkhastForush;

    // ثبت معامله
    this.apiService.sabtMoameleh(moamelehNewRow).subscribe(
      newMoameleh => {
        moamelehNewRow._id = newMoameleh._id;
        this.toastr.success('معامله جدید با موفقیت ثبت شد');
        this.updateDarkhastKharid(
          darkhastKharidUpdateObj,
          darkhastKharidId
        ).subscribe(
          data => {
            // برای ردیف درخواست خرید ، یک ردیف معامله ثبت میکنیم
            this.toastr.success('مشخصات درخواست خرید با موفقیت به روزرسانی شد');
            this.updateDarkhastForush(
              darkhastForushUpdateObj,
              darkhastForushId
            ).subscribe(
              () => {
                // برای ردیف درخواست فروش ، یک ردیف معامله ثبت میکنیم
                this.toastr.success(
                  'مشخصات درخواست فروش با موفقیت به روزرسانی شد'
                );
                // نمای گریدهای خرید و فروش را به روز رسانی میکنیم
                this.safeKharidComponent.loadDarkhastData();
                this.safeForushComponent.loadDarkhastData();
                // جدول دارایی سهام - پورتفو - خریدار و فروشنده را به روز رسانی میکنیم
                this.UpdatePortfoKharidar(
                  this.avalinKharidar,
                  _tedadSahmMoameleh,
                  newMoameleh
                );
                this.UpdatePortfoForushandeh(
                  this.avalinForushandeh,
                  _tedadSahmMoameleh,
                  newMoameleh
                );
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

  private UpdatePortfoKharidar(
    avalinKharidar: DarkhastType,
    _tedadSahmMoameleh: number,
    moamelehNewRow: MoamelehType
  ) {
    this.apiService.getPortfohByUsername(avalinKharidar.username).subscribe(
      portfo => {
        portfo = portfo[0];
        // تعداد سهم جدید خریدار را محاسبه میکنیم
        const tedadSahmJadid = portfo.tedadSahm + _tedadSahmMoameleh;
        const moamelatPortfoKharidar = portfo.moamelat || [];
        const portfoKharidarUpdateObj: PortfoType = {
          tedadSahm: tedadSahmJadid,
          moamelat: moamelatPortfoKharidar
        };

        // افزودن معامله به لیست معاملات پورتفو خریدار
        moamelehNewRow.shenasehMoameleh = moamelehNewRow._id;
        portfoKharidarUpdateObj.moamelat.push(moamelehNewRow);
        // پورتفو را به روزرسانی میکنیم
        this.apiService
          .updatePortfoById(portfoKharidarUpdateObj, portfo._id)
          .subscribe(
            () => {
              this.toastr.success(
                'مشخصات جدول پورتفو خریدار با موفقیت به روزرسانی شد'
              );
            },
            error => {
              console.log(error);
              this.toastr.error(
                'خطا در به روز رسانی جدول پورتفو خریدار.با پشتیبان سامانه تماس بگیرید'
              );
            }
          );
      },
      error => {
        console.log(error);
        this.toastr.error(
          'خطا در به بازیابی مشخصات پورتفو خریدار.با پشتیبان سامانه تماس بگیرید'
        );
      }
    );
  }

  private UpdatePortfoForushandeh(
    avalinForushandeh: DarkhastType,
    _tedadSahmMoameleh: number,
    moamelehNewRow: MoamelehType
  ) {
    this.apiService.getPortfohByUsername(avalinForushandeh.username).subscribe(
      portfo => {
        // تعداد سهم جدید فروشنده را محاسبه میکنیم
        portfo = portfo[0];
        const tedadSahmJadid = portfo.tedadSahm - _tedadSahmMoameleh;
        const moamelatPortfoForushandeh = portfo.moamelat || [];
        const portfoForushandehUpdateObj: PortfoType = {
          tedadSahm: tedadSahmJadid,
          moamelat: moamelatPortfoForushandeh
        };
        // افزودن معامله به لیست معاملات پورتفو فروشنده
        moamelehNewRow.shenasehMoameleh = moamelehNewRow._id;
        portfoForushandehUpdateObj.moamelat.push(moamelehNewRow);
        // پورتفو فروشنده را به روزرسانی میکنیم
        this.apiService
          .updatePortfoById(portfoForushandehUpdateObj, portfo._id)
          .subscribe(
            () => {
              this.toastr.success(
                'مشخصات جدول پورتفو فروشنده با موفقیت به روزرسانی شد'
              );
            },
            error => {
              console.log(error);
              this.toastr.error(
                'خطا در به روز رسانی جدول پورتفو فروشنده.با پشتیبان سامانه تماس بگیرید'
              );
            }
          );
      },
      error => {
        console.log(error);
        this.toastr.error(
          'خطا در به بازیابی مشخصات پورتفو فروشنده.با پشتیبان سامانه تماس بگیرید'
        );
      }
    );
  }

  private prepareNewMoamelehRow(
    avalinForushandeh: DarkhastType,
    avalinKharidar: DarkhastType,
    _tedadSahmMoameleh: number,
    _gheymatMoameleh: number
  ): MoamelehType {
    const _forushandeh_username = avalinForushandeh.username;
    const _forushandeh_fullName = avalinForushandeh.fullName;
    const _forushandeh_darkhastId = avalinForushandeh._id;
    const _kharidar_username = avalinKharidar.username;
    const _kharidar_fullName = avalinKharidar.fullName;
    const _kharidar_darkhastId = avalinKharidar._id;
    const moameleh: MoamelehType = {
      tedadSahmMoameleh: _tedadSahmMoameleh,
      gheymatMoameleh: _gheymatMoameleh,
      arzeshSahmMoameleh: _tedadSahmMoameleh * _gheymatMoameleh,
      forushandeh_username: _forushandeh_username,
      forushandeh_fullName: _forushandeh_fullName,
      forushandeh_darkhastId: _forushandeh_darkhastId,
      kharidar_username: _kharidar_username,
      kharidar_fullName: _kharidar_fullName,
      kharidar_darkhastId: _kharidar_darkhastId
    };

    return moameleh;
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

  // private PostNewMoameleh(avalinForushandeh: DarkhastType,
  //   avalinKharidar: DarkhastType,
  //   _tedadSahmMoameleh: number,
  //   _arzeshSahmMoameleh: number): MoamelehType {
  //   const _forushandeh_username = avalinForushandeh.username;
  //   const _forushandeh_fullName = avalinForushandeh.fullName;
  //   const _forushandeh_darkhastId = avalinForushandeh._id;
  //   const _kharidar_username = avalinKharidar.username;
  //   const _kharidar_fullName = avalinKharidar.fullName;
  //   const _kharidar_darkhastId = avalinKharidar._id;

  //   const moameleh: MoamelehType = {
  //     tedadSahmMoameleh: _tedadSahmMoameleh,
  //     arzeshSahmMoameleh: _arzeshSahmMoameleh,
  //     forushandeh_username: _forushandeh_username,
  //     forushandeh_fullName: _forushandeh_fullName,
  //     forushandeh_darkhastId: _forushandeh_darkhastId,
  //     kharidar_username: _kharidar_username,
  //     kharidar_fullName: _kharidar_fullName,
  //     kharidar_darkhastId: _kharidar_darkhastId
  //   };

  //   this.apiService.sabtMoameleh(moameleh).subscribe((newMoameleh) => {
  //     console.log(newMoameleh);
  //     this.toastr.success('معامله جدید با موفقیت ثبت شد');
  //   }, (error) => {
  //     console.log(error);
  //   });

  //   return moameleh;
  // }

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
