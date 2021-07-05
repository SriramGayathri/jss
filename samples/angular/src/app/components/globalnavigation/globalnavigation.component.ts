import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { DocumentNode } from 'graphql';
import { JssGraphQLService } from '../../jss-graphql.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

const ComponentQuery: DocumentNode = require('graphql-tag/loader!./globalnavigation.component.graphql');

@Component({
  selector: 'app-globalnavigation',
  templateUrl: './globalnavigation.component.html',
  styleUrls: ['./globalnavigation.component.css']
})
export class GlobalnavigationComponent implements OnInit {
  @Input() rendering: ComponentRendering;
 query$: Observable<ApolloQueryResult<any>>;
   constructor(private graphQLService: JssGraphQLService) {}

  // ngOnInit() {
  //   // remove this after implementation is done
  //   console.log('globalnavigation component initialized with component data', this.rendering);
  // }

   ngOnInit(): void {
    // the query result is an Rx Observable, so any observable patterns
    // are usable here - async pipe (like this sample), subscribing manually,
    // (don't forget to unsubscribe in ngOnDestroy), etc.
    this.query$ = this.graphQLService.query({
      query: ComponentQuery,
      // passing in a rendering allows usage of the ambient $datasource GraphQL variable.
      // if it's not passed, the variable will not be defined (but $contextItem is still available)
      renderingContext: this.rendering
    });
     console.log('globalnavigation component initialized with component data', this.rendering);
      console.log('globalnavigation graphql query', this.query$);
  }
}
