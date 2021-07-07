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

   ngOnInit(): void {
    this.query$ = this.graphQLService.query({
      query: ComponentQuery,
      renderingContext: this.rendering
    });
     console.log('globalnavigation component initialized with component data', this.rendering);
      console.log('globalnavigation graphql query', this.query$);
  }
}
