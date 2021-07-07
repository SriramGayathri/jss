import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
flag:boolean;
  constructor() { }

  ngOnInit(): void {
  }  onPlaceholderLoaded(placeholderName: string) {
    // you may optionally hook to the loaded event for a placeholder,
    // which can be useful for analytics and other DOM-based things that need to know when a placeholder's content is available.
    console.log(`layout.component.ts: placeholder component fired loaded event for the ${placeholderName} placeholder`);
    if (placeholderName.includes('jss-banner')) {
      this.flag = false;
     } else {
      this.flag = true;
    }
    console.log('test', this.flag);
  }

}
