import { Component, Input ,OnInit } from '@angular/core';
import * as datalist from "../../../thumbnail.json";

@Component({
  selector: 'app-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  i: number = 0;
  constructor() { }
  thumbnaildata: any = (datalist as any ).default;
  @Input() data: any;
  ngOnInit(): void {
  
      console.log("datum "+this.data);
  }
 
  
  
  
}
