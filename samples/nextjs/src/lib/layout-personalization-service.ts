import config from 'temp/config';
import {
  LayoutPersonalizationService,
  PersonalizationDecisionsService,
  GraphQLLayoutFragmentService,
  LayoutPersonalizationUtils,
} from '@sitecore-jss/sitecore-jss-nextjs';

export const layoutPersonalizationService = new LayoutPersonalizationService(
  new PersonalizationDecisionsService({
    serviceUrl: config.personalizationDecisionsEndpoint,
    apiKey: config.sitecoreServicesApiKey,
    siteName: config.jssAppName,
    tracking: config.trackingEnabled.toLocaleLowerCase() === 'true',
    currentPageParamsToExtract: ['sc_camp', 'sc_trk'],
  }),
  new GraphQLLayoutFragmentService({
    endpoint: config.graphQLEndpoint,
    apiKey: config.sitecoreApiKey,
    siteName: config.jssAppName,
  }),
  new LayoutPersonalizationUtils()
);
