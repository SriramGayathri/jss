import React from 'react';
import {
  isServer,
  LayoutPersonalizationService,
  LayoutServiceData,
  SitecorePersonalizationContext,
  SitecorePersonalizationContextState,
} from '@sitecore-jss/sitecore-jss';

export const SitecorePersonalizationReactContext = React.createContext<
  SitecorePersonalizationContextState | undefined
>(undefined);

export interface SitecorePersonalizationContextProps {
  layoutData: LayoutServiceData | null;
  isPreview: boolean;
  isPersonalizationSuppressed?: boolean;
  tracked: boolean;
}

/**
 * @param {React.ComponentClass<T> | React.SFC<T>} Component
 * @param {LayoutPersonalizationService} layoutPersonalizationService
 */
export function withSitecorePersonalizationContext<T extends SitecorePersonalizationContextProps>(
  Component: React.ComponentClass<T> | React.SFC<T>,
  layoutPersonalizationService: LayoutPersonalizationService
) {
  return function WithSitecorePersonalizationContext(props: T) {
    const route = props.layoutData?.sitecore.route;

    let personalizationContext: SitecorePersonalizationContext | undefined = undefined;
    const newProps = { ...props };
    if (
      !props.isPersonalizationSuppressed &&
      route &&
      !props.isPreview &&
      !isServer() &&
      route.layoutId !== 'available-in-connected-mode'
    ) {
      personalizationContext = layoutPersonalizationService.startPersonalization(
        {
          language: props.layoutData?.sitecore.context.language as string,
          routePath: props.layoutData?.sitecore.context.itemPath as string,
        },
        route
      );
      newProps.tracked = personalizationContext.isTracked;
    }

    return (
      <SitecorePersonalizationReactContext.Provider value={personalizationContext}>
        <Component {...newProps} />
      </SitecorePersonalizationReactContext.Provider>
    );
  };
}
