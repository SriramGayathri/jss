import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlSegment, UrlMatchResult } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';
import { JssRouteResolver } from './jss-route-resolver.service';
import { JssRouteBuilderService } from './jss-route-builder.service';
import { JssModule } from '@sitecore-jss/sitecore-jss-angular';
import { BrowserModule } from '@angular/platform-browser';
import { NavigationComponent } from './navigation/navigation.component';
import { TranslateModule } from '@ngx-translate/core';
import { VisitorIdentificationComponent } from './visitor-identification/visitor-identification.component';
import { SubNavigationComponent } from './sub-navigation/sub-navigation.component';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';
import { ArticleDetailsComponent } from './article-details/article-details.component';
import { AppComponent } from '../app.component';
import { ThumbnailComponent } from './thumbnail/thumbnail.component';
import { FeaturedComponent } from './featured/featured.component';
import { AddPromoComponent } from './add-promo/add-promo.component';
import { Thumbnail1m3xs1vpComponent } from './thumbnail1m3xs1vp/thumbnail1m3xs1vp.component';
import { Thumbnail1m3xs1sComponent } from './thumbnail1m3xs1s/thumbnail1m3xs1s.component';
import { Thumbnailrows4sComponent } from './thumbnailrows4s/thumbnailrows4s.component';
import { Thumbnailrows3mComponent } from './thumbnailrows3m/thumbnailrows3m.component';
import { Thumbnailrows2lComponent } from './thumbnailrows2l/thumbnailrows2l.component';
import { Thumbnail1s1lComponent } from './thumbnail1s1l/thumbnail1s1l.component';
import { Thumbnail1m2xsComponent } from './thumbnail1m2xs/thumbnail1m2xs.component';

//import { AuthModule } from '../auth/auth.module';

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function jssRouteMatcher(url: UrlSegment[]): UrlMatchResult {

  // use the route builder to parse out language / server route
  const routeParser = new JssRouteBuilderService();
  const route = routeParser.parseRouteUrl(url.map((segment) => segment.toString()));
  console.log(routeParser);
  console.log(route);
  if (route == null) {
    return null;
  }

  // convert props to route parameters
  const posParams: { [key: string]: UrlSegment } = {};
  Object.keys(route).forEach((key) => {
    posParams[key] = new UrlSegment(route[key], null);
  });

  return {
    consumed: url,
    posParams
  };
}

const routes: Routes = [
 
  { path: 'NotFound', component: NotFoundComponent },
  { path: 'ServerError', component: ServerErrorComponent },
  { path: 'head', component: HeaderComponent },
  { path: 'home', component: HomeComponent },
  { path: 'article-details', component: ArticleDetailsComponent },
  // { path: 'auth',
  // loadChildren: () => import('../auth/auth.module').then(m => m.AuthModule)},  
  {
    // matcher is effectively a catch-all route
    matcher: jssRouteMatcher,
    component: AppComponent,
    resolve: {
      jssState: JssRouteResolver 
    },
    runGuardsAndResolvers: 'always',
    
  },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload', initialNavigation: 'enabled' }),
    JssModule,
    //AuthModule,
    TranslateModule,
    BrowserModule
  ],
  exports: [
    RouterModule,
    TranslateModule,
  ],
  declarations: [
    NotFoundComponent,
    ServerErrorComponent,
    LayoutComponent,
    
    NavigationComponent,
    VisitorIdentificationComponent,
    SubNavigationComponent,
    HeaderComponent,
    HomeComponent,
    ArticleDetailsComponent,
    ThumbnailComponent,
    FeaturedComponent,
    AddPromoComponent,
    Thumbnail1m3xs1vpComponent,
    Thumbnail1m3xs1sComponent,
    Thumbnailrows4sComponent,
    Thumbnailrows3mComponent,
    Thumbnailrows2lComponent,
    Thumbnail1s1lComponent,
    Thumbnail1m2xsComponent
  ],
  providers: [
    JssRouteResolver,
    JssRouteBuilderService,
  ]
})
export class RoutingModule { }
