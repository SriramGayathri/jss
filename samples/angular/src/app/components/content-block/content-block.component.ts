import { Component, OnInit,Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';

@Component({
  selector: 'app-content-block',
  templateUrl: './content-block.component.html',
})
export class ContentBlockComponent implements OnInit{
  @Input() rendering: ComponentRendering;
 constructor() { }

  ngOnInit() {
    // remove this after implementation is done
    console.log('component initialized with component data', this.rendering);
    console.log('initialized with component data', this.rendering.fields.viewJobstBtn);
  }
}
