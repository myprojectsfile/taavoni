import { Component, OnInit } from '@angular/core';
import { ApiService } from '../shared/services/api.service';
import { MessageType } from '../shared/types/message';
import { SematType } from '../shared/types/semat';

@Component({
  selector: 'app-send-message',
  templateUrl: './send-message.component.html',
  styleUrls: ['./send-message.component.css']
})
export class SendMessageComponent implements OnInit {
  message: MessageType = {};
  sematha: SematType[] = [];

  constructor(private apiService: ApiService) {}

  sabtMessage() {
    this.apiService.sabtMessage(this.message).subscribe(
      newMessage => {
        console.log(newMessage);
      },
      error => {}
    );
  }

  ngOnInit() {
    this.getSematha();
  }

  getSematha() {
    this.apiService.getSematha().subscribe(
      sematha => {
        this.sematha = sematha;
        console.log(sematha);
      },
      error => {}
    );
  }
}
