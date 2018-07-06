import { Component, OnInit } from '@angular/core';
import 'rxjs/add/operator/catch';
import { RequestService, DarkhastType } from './request.service';
declare var $: any;
@Component({
  selector: 'app-request-admin',
  templateUrl: './request-admin.component.html',
  styleUrls: ['./request-admin.component.css']
})

export class RequestAdminComponent implements OnInit {
  listDarkhast: DarkhastType[];

  constructor(private requestService: RequestService) { }

  ngOnInit() {
    this.requestService.getListDarkhastUser().subscribe((data) => {
      this.listDarkhast = data;
      console.log(data);
    })
  }

  cancel(message){
    alert(message);
  }
}
