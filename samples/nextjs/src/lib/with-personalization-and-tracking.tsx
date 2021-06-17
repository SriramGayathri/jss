import {
  isServer,
  LayoutPersonalizationService,
  withSitecorePersonalizationContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { TrackingService } from '../../../../packages/sitecore-jss-tracking/types';
import { SitecorePageProps } from 'lib/page-props';
import { areQueryParamsReady } from '@sitecore-jss/sitecore-jss-nextjs';
import { useRouter } from 'next/router';

export function withCurrentPageTracking<T extends SitecorePageProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  trackingService: TrackingService
): (props: T) => JSX.Element {
  return function WithCurrentPageTrackingHoc(props: T) {
    const route = props.layoutData?.sitecore.route;
    if (
      areQueryParamsReady(useRouter()) &&
      route &&
      !props.isPreview &&
      !isServer() &&
      route.layoutId !== 'available-in-connected-mode' &&
      !props.tracked
    ) {
      trackingService.trackCurrentPage(props.layoutData?.sitecore.context, route);
    }
    return <Component {...props} />;
  };
}

export function withPersonalizationAndTracking<T extends SitecorePageProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  layoutPersonalizationService: LayoutPersonalizationService,
  trackingService: TrackingService
): (props: T) => JSX.Element {
  return withSitecorePersonalizationContext(
    withCurrentPageTracking(Component, trackingService),
    layoutPersonalizationService
  );
}
