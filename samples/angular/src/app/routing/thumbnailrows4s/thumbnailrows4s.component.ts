import { Component, OnInit } from '@angular/core';
import * as datalist from "../../../thumbnail4col.json";

@Component({
  selector: 'app-thumbnailrows4s',
  templateUrl: './thumbnailrows4s.component.html',
  styleUrls: ['./thumbnailrows4s.component.css']
})
export class Thumbnailrows4sComponent implements OnInit {

  thumbnaildatalist: any = (datalist as any).default;
  constructor() {
   
  }

  ngOnInit(): void {
    
    console.log("datalist" + this.thumbnaildatalist);
  
  
  }

}
