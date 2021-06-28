import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-globalnavigation',
  templateUrl: './globalnavigation.component.html',
  styleUrls: ['./globalnavigation.component.css']
})
export class GlobalnavigationComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('globalnavigation component initialized with component data', this.rendering);
  }
}
