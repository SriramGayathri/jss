import { LayoutServiceContext, RouteData } from '@sitecore-jss/sitecore-jss-nextjs';

/**
 * Styleguide sitecore context value shape
 */
export type StyleguideSitecoreContextValue = LayoutServiceContext & {
  itemId?: string;
  route: RouteData;
};
