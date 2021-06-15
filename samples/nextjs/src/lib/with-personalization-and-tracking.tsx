import { isServer, LayoutPersonalizationService } from '@sitecore-jss/sitecore-jss-nextjs';
import { withSitecorePersonalizationContext } from '@sitecore-jss/sitecore-jss-nextjs';
import { TrackingService } from '../../../../packages/sitecore-jss-tracking/types';
import { SitecorePageProps } from 'lib/page-props';

export function withCurrentPageTracking<T extends SitecorePageProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  trackingService: TrackingService
) {
  return function WithCurrentPageTrackingHoc(props: T) {
    const route = props.layoutData?.sitecore.route;
    if (
      route &&
      !props.isPreview &&
      !isServer() &&
      route.layoutId !== 'available-in-connected-mode' &&
      !props.tracked
    ) {
      trackingService.trackCurrentPage(props.layoutData?.sitecore.context);
    }
    return <Component {...props} />;
  };
}

export function withPersonalizationAndTracking<T extends SitecorePageProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  layoutPersonalizationService: LayoutPersonalizationService,
  trackingService: TrackingService
) {
  return withSitecorePersonalizationContext(
    withCurrentPageTracking(Component, trackingService),
    layoutPersonalizationService
  );
}
