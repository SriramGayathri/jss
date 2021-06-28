import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-globalheader',
  templateUrl: './globalheader.component.html',
  styleUrls: ['./globalheader.component.css']
})
export class GlobalheaderComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('globalheader component initialized with component data', this.rendering);
  }
}
