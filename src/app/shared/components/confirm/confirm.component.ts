import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {

  constructor(public bsModalRef: BsModalRef) { }
  title: string;
  message: string;
  options: string[];
  answer: string = "";

  respond(answer: string) {
    this.answer = answer;

    this.bsModalRef.hide();
  }
}
