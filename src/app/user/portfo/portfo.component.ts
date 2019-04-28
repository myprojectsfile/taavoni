import { Component, OnInit, OnChanges } from '@angular/core';
import { ApiService } from '../../shared/services/api.service';
import { MoamelehType } from '../../shared/types/moameleh';
import { ToastrService, Toast } from 'ngx-toastr';
import { AuthService } from '../../auth/auth.service';
import { UserType } from '../../shared/types/user';

@Component({
  selector: 'app-portfo',
  templateUrl: './portfo.component.html',
  styleUrls: ['./portfo.component.css']
})
export class PortfoComponent implements OnInit {
  user: UserType;
  moameleha: MoamelehType[];
  calcNoeMoameleh: any;
  constructor(
    private apiService: ApiService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    // define calcNoeMoameleh for using in dataGrid
    this.calcNoeMoameleh = row => {
      const userId = this.authService.getUserId();
      if (row.forushandeh._id === userId) {
        return 'فروش';
      } else {
        return 'خرید';
      }
    };

    this.apiService.getUserPortfoById().subscribe(
      user => {
        console.log(user);
        this.user = user;
        this.moameleha = user.moameleha;
      },
      error => {
        console.log(error);
        this.toastr.error(
          'خطا در بازیابی داده های پورتفوی کاربر.با پشتیبان سامانه تماس بگیرید.'
        );
      }
    );
  }
}
