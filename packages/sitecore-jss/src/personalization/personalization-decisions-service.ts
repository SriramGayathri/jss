import { AxiosDataFetcher } from './../axios-fetcher';
import { fetchData, HttpDataFetcher } from './../data-fetcher';
import debug from '../debug';
import { extractQueryStringParams } from '../utils/extract-querystring-params';

export interface RenderingPersonalizationDecision {
  /**
   * The variant key
   */
  variantKey?: string | null;
  /**
   * The error message
   */
  errorMessage?: string;
}

export interface DecisionsContext {
  /**
   * The route path
   */
  routePath: string;
  /**
   * The language
   */
  language: string;
  /**
   * The rendering identifiers
   */
  renderingIds: string[];
}

export interface PersonalizationDecisionData {
  /**
   * The renderings
   */
  renderings: {
    [renderingId: string]: RenderingPersonalizationDecision;
  };
}

export type DataFetcherResolver = <T>(config: {
  /**
   * The request timeout in milliseconds
   */
  timeout?: number;
}) => HttpDataFetcher<T>;

export type PersonalizationDecisionsServiceConfig = {
  /**
   * Hostname of decisions service; e.g. http://my.site.core; Default: '', same host as a page
   */
  host?: string;
  /**
   * Relative path from host to decisions service. Default: /sitecore/api/layout/personalization/decision
   */
  route?: string;
  /**
   * This value overrides the default service URL.
   * Note: `host` and `route` options are ignored if `serviceUrl` is set.
   */
  serviceUrl?: string;
  /**
   * The Sitecore SSC API key your app uses
   */
  apiKey: string;
  /**
   * The JSS application name
   */
  siteName: string;
  /**
   * Query string parameters of the current page to pass with request to decision service
   */
  currentPageParamsToExtract?: string[];
  /**
   * Enables/disables analytics tracking for the Layout Service invocation (default is true).
   * More than likely, this would be set to false for SSG/hybrid implementations, and the
   * JSS tracker would instead be used on the client-side: {@link https://jss.sitecore.com/docs/fundamentals/services/tracking}
   * @default true
   */
  tracking?: boolean;
  /**
   * The request timeout in milliseconds
   */
  timeout?: number;
  /**
   * Data fetcher resolver in order to provide custom data fetcher
   * @see DataFetcherResolver
   * @see HttpDataFetcher<T>
   * @see AxiosDataFetcher used by default
   */
  dataFetcherResolver?: DataFetcherResolver;
};

/**
 * Fetches personalization decisions using the Sitecore REST API.
 * Uses Axios as the default data fetcher (@see AxiosDataFetcher).
 */
export class PersonalizationDecisionsService {
  public isTrackingEnabled: boolean;
  private serviceConfig: PersonalizationDecisionsServiceConfig;

  constructor(serviceConfig: PersonalizationDecisionsServiceConfig) {
    this.serviceConfig = {
      host: '',
      route: '/sitecore/api/layout/personalization/decision',
      ...serviceConfig,
    };
    this.isTrackingEnabled = serviceConfig.tracking ?? true;
  }

  /**
   * Gets personalization decisions.
   * @param {DecisionsContext} context The decisions context
   * @returns {Promise<PersonalizationDecisionData>} The personalization decision data
   */
  getPersonalizationDecisions(context: DecisionsContext): Promise<PersonalizationDecisionData> {
    const fetcher = this.serviceConfig.dataFetcherResolver
      ? this.serviceConfig.dataFetcherResolver<PersonalizationDecisionData>({
          timeout: this.serviceConfig.timeout,
        })
      : this.getDefaultFetcher<PersonalizationDecisionData>();
    let queryParams = {
      sc_apikey: this.serviceConfig.apiKey,
      sc_site: this.serviceConfig.siteName,
      tracking: this.isTrackingEnabled,
    };
    if (this.serviceConfig.currentPageParamsToExtract) {
      queryParams = {
        ...extractQueryStringParams(
          window.location.search,
          this.serviceConfig.currentPageParamsToExtract
        ),
        ...queryParams,
      };
    }
    const requestBody = {
      routePath: context.routePath,
      language: context.language,
      renderingIds: context.renderingIds,
      referrer: window.document.referrer,
      url: window.location.pathname + window.location.search,
    };

    debug.personalizationDecisions(
      'fetching personalization decisions for %o %o',
      queryParams,
      requestBody
    );

    return fetchData<PersonalizationDecisionData>(
      this.serviceConfig.serviceUrl ?? `${this.serviceConfig.host}${this.serviceConfig.route}`,
      fetcher,
      queryParams,
      requestBody
    );
  }

  protected getDefaultFetcher = <T>() => {
    const axiosFetcher = new AxiosDataFetcher({
      timeout: this.serviceConfig.timeout,
      debugger: debug.personalizationDecisions,
    });

    const fetcher = (url: string, data?: unknown) => {
      return axiosFetcher.fetch<T>(url, data);
    };

    return fetcher;
  };
}
