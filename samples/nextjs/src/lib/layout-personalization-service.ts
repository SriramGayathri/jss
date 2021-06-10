import config from 'temp/config';
import {
  LayoutPersonalizationService,
  RestPersonalizationDecisionsService,
  GraphQLLayoutFragmentService,
  LayoutServiceData,
  isServer,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { trackingService } from 'lib/tracking-service';
import { NextRouter } from 'next/router';
import { areQueryParamsReady } from './util';

export const layoutPersonalizationService = new LayoutPersonalizationService(
  new RestPersonalizationDecisionsService({
    serviceUrl: config.personalizationDecisionsEndpoint,
    apiKey: config.sitecoreServicesApiKey,
    siteName: config.jssAppName,
    tracking: config.trackingEnabled.toLocaleLowerCase() === 'true',
  }),
  new GraphQLLayoutFragmentService({
    endpoint: config.graphQLEndpoint,
    apiKey: config.sitecoreApiKey,
    siteName: config.jssAppName,
  })
);

export const loadPersonalization = async (
  pageProps: { layoutData: LayoutServiceData; isPreview: boolean; tracked?: boolean },
  router: NextRouter
): Promise<void> => {
  const disconnectedMode =
    pageProps.layoutData.sitecore.route &&
    pageProps.layoutData.sitecore.route.layoutId === 'available-in-connected-mode';
  if (disconnectedMode) {
    return;
  }

  // Load personalization client side only
  if (isServer()) {
    return;
  }

  // Do not trigger client tracking when pages are requested by Sitecore XP instance:
  // - no need to track in Edit and Preview modes
  // - in Explore mode all requests will be tracked by Sitecore XP out of the box
  if (pageProps.isPreview) {
    return;
  }

  const route = pageProps.layoutData.sitecore.route;
  if (!route) {
    return;
  }

  /*
   * Pages that are statically optimized will be hydrated without their route parameters provided.
   * After hydration, Next.js will trigger an update to your application to provide the route parameters in the query object.
   * Details could be found on Caveats section for dynamic routes in Next.js doc
   */
  if (!areQueryParamsReady(router)) {
    return;
  }

  const context = pageProps.layoutData.sitecore.context;
  const personalizationResult = await layoutPersonalizationService.fetchPersonalization(
    {
      routePath: context.itemPath as string,
      language: context.language as string,
    },
    route
  );

  // page is already tracked either by Personalization decision service or by Layout service
  if (personalizationResult.isPersonalizable || pageProps.tracked) {
    return;
  }

  try {
    await trackingService.trackCurrentPage(context, route);
  } catch (error) {
    console.error('Tracking failed: ' + error);
  }
};
