import { Component, OnInit, OnDestroy } from '@angular/core';
//import { TranslateService } from '@ngx-translate/core';
//import { JssContextService } from './jss-context.service';
//import { environment as env } from '../environments/environment';
/* eslint-disable no-shadow */
import { JssState } from './JssState';
import { ActivatedRoute } from '@angular/router';
import { MetaService } from '@ngx-meta/core';
import { RouteData, Field, LayoutServiceContextData } from '@sitecore-jss/sitecore-jss-angular';
import { Subscription } from 'rxjs';

enum LayoutState {
  Layout,
  NotFound,
  Error
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {
 // private contextSubscription: Subscription;
  route: RouteData;
  state: LayoutState;
  LayoutState = LayoutState;
  subscription: Subscription;
  errorContextData: LayoutServiceContextData;
  flag: boolean;
  constructor(
   // translate: TranslateService,
    //jssContextService: JssContextService,
    private activatedRoute: ActivatedRoute,
    private readonly meta: MetaService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
  //  translate.setDefaultLang(env.defaultLanguage);

    // the lang to use. if the lang isn't available, it will use the current loader to get them
    //translate.use(env.defaultLanguage);

    // this.subscription = jssContextService.state.subscribe(jssState => {
    //   // listen for language changes
    //   if (jssState.language) {
    //     translate.use(jssState.language);
    //   }
    // });
  }
  ngOnInit() {
    // route data is populated by the JssRouteResolver
    console.log(JssState);
    this.subscription = this.activatedRoute.data.subscribe((data: { jssState: JssState }) => {
      if (!data.jssState) {
        this.state = LayoutState.NotFound;
        return;
      }
      console.log(data);
      console.log(data.jssState.sitecore);
      console.log(data.jssState.sitecore.route);
      if (data.jssState.sitecore && data.jssState.sitecore.route) {
        this.route = data.jssState.sitecore.route;
        this.setMetadata(this.route.fields);
        this.state = LayoutState.Layout;
        console.log(`layout the ${data.jssState.sitecore} ok`);
      }

      if (data.jssState.routeFetchError) {
        if (data.jssState.routeFetchError.status >= 400 && data.jssState.routeFetchError.status < 500) {
          this.state = LayoutState.NotFound;
        } else {
          this.state = LayoutState.Error;
        }

        this.errorContextData = data.jssState.routeFetchError.data && data.jssState.routeFetchError.data.sitecore;
      }
    });
  }
  ngOnDestroy() {
     if (this.subscription) {
      this.subscription.unsubscribe();
     }
     
  }
  setMetadata(routeFields: { [name: string]: Field }) {
    // set page title, if it exists
    if (routeFields && routeFields.pageTitle) {
      this.meta.setTitle(routeFields.pageTitle.value as string || 'Page');
    }
  }

  onPlaceholderLoaded(placeholderName: string) {
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
