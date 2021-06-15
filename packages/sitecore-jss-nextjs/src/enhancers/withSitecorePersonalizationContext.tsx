import React from 'react';
import { isServer, LayoutPersonalizationService } from '@sitecore-jss/sitecore-jss';
import { useRouter } from 'next/router';
import {
  SitecorePersonalizationContextProps,
  withSitecorePersonalizationContext as reactWithSitecorePersonalizationContext,
} from '@sitecore-jss/sitecore-jss-react';
import { areQueryParamsReady } from '../utils';

/**
 * @param Component
 * @param layoutPersonalizationService
 */
export function withSitecorePersonalizationContext<T extends SitecorePersonalizationContextProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  layoutPersonalizationService: LayoutPersonalizationService
) {
  const WrappedComponent = reactWithSitecorePersonalizationContext(
    Component,
    layoutPersonalizationService
  );
  return function WithSitecorePersonalizationContext(props: T) {
    const router = useRouter();
    const newProps = { ...props };

    if (!isServer() && !areQueryParamsReady(router)) {
      newProps.isPersonalizationSuppressed = true;
    }
    return <WrappedComponent {...props} />;
  };
}
