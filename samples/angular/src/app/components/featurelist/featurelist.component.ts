import { Component, OnInit, Input } from '@angular/core';
import { ComponentRendering } from '@sitecore-jss/sitecore-jss-angular';
import { DocumentNode } from 'graphql';
import { JssGraphQLService } from '../../jss-graphql.service';
import { ApolloQueryResult } from '@apollo/client/core';
import { Observable } from 'rxjs';

const ComponentQuery: DocumentNode = require('graphql-tag/loader!./featurelist.component.graphql');

@Component({
  selector: 'app-featurelist',
  templateUrl: './featurelist.component.html',
  styleUrls: ['./featurelist.component.css']
})
export class FeaturelistComponent implements OnInit {
  @Input() rendering: ComponentRendering;

  query$: Observable<ApolloQueryResult<any>>;
  constructor(private graphQLService: JssGraphQLService) { }

  ngOnInit(): void {
    this.query$ = this.graphQLService.query({
      query: ComponentQuery,
      renderingContext: this.rendering
    });
      console.log('featurelist graphql query', this.query$);
  }
}
