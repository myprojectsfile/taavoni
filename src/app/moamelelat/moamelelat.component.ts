import { Component, OnInit, ViewChild } from '@angular/core';
import { DarkhastComponent } from '../darkhast/darkhast.component';

@Component({
  selector: 'app-moamelelat',
  templateUrl: './moamelelat.component.html',
  styleUrls: ['./moamelelat.component.css']
})
export class MoamelelatComponent implements OnInit {

  constructor() { }

  @ViewChild('safeKharid') safeKharidComponent: DarkhastComponent;
  @ViewChild('safeForush') safeForushComponent: DarkhastComponent;

  ngOnInit() {
    
  }

}
