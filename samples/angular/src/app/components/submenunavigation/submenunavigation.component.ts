import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-submenunavigation',
  templateUrl: './submenunavigation.component.html',
  styleUrls: ['./submenunavigation.component.css']
})
export class SubmenunavigationComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('submenunavigation component initialized with component data', this.rendering);
  }
}
