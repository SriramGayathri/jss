import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-job-banner',
  templateUrl: './job-banner.component.html',
  styleUrls: ['./job-banner.component.css']
})
export class JobBannerComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('jobBanner component initialized with component data', this.rendering);
  }
}
