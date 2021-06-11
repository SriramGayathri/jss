import { ComponentRendering, PersonalizableComponentRendering, RouteData } from '../layout/models';
import {
  PersonalizationDecisionData,
  PersonalizationDecisionsService,
} from './personalization-decisions-service';
import { LayoutFragmentService } from './layout-fragment-service';
import { LayoutPersonalizationUtils } from './layout-personalization-utils';

export interface PersonalizationResult {
  /**
   * A value that indicates whether a route is personalizable
   */
  isPersonalizable: boolean;
}

export interface PersonalizationContext {
  /**
   * The route path
   */
  routePath: string;
  /**
   * The language
   */
  language: string;
}

/**
 * The layout personalization service that provides the asynchronous API
 * to initiate the personalization and load personalized components
 */
export class LayoutPersonalizationService {
  private personalizationResult: {
    personalizationOperation?: Promise<{
      [key: string]: ComponentRendering | null;
    }>;
    components?: { [key: string]: ComponentRendering | null };
  } = {};
  private layoutPersonalizationUtils = new LayoutPersonalizationUtils();

  constructor(
    private personalizationDecisionsService: PersonalizationDecisionsService,
    private layoutFragmentService: LayoutFragmentService
  ) {}

  /**
   * Fetches the personalized data.
   * @param {PersonalizationContext} context The context.
   * @param {RouteData} route The route.
   * @returns {PersonalizationResult} The personalization result.
   */
  async fetchPersonalization(
    context: PersonalizationContext,
    route: RouteData
  ): Promise<PersonalizationResult> {
    // clear personalization before getting new one
    this.personalizationResult = {};

    const personalizedRenderings = this.layoutPersonalizationUtils.getPersonalizableComponents(
      route.placeholders
    );

    if (!personalizedRenderings.length) {
      return { isPersonalizable: false };
    }

    const currentResult = this.personalizationResult;
    currentResult.personalizationOperation = this.personalizeComponents(
      {
        routePath: context.routePath,
        language: context.language,
      },
      personalizedRenderings
    );

    try {
      const components = await currentResult.personalizationOperation;
      currentResult.components = components;
      return { isPersonalizable: true };
    } catch (error) {
      currentResult.personalizationOperation = undefined;
      throw error;
    }
  }

  /**
   * Gets the personalized component.
   * @param {string} componentUid The unique identifier of a component.
   * @returns {ComponentRendering} The personalized component.
   */
  getPersonalizedComponent(componentUid: string): ComponentRendering | null {
    if (!this.personalizationResult.components) {
      return null;
    }

    return this.personalizationResult.components[componentUid] ?? null;
  }

  /**
   * Provides a value that indicates whether the loading is in-progress.
   * @returns {boolean} The value that indicates whether the loading is in-progress.
   */
  isLoading(): boolean {
    return (
      !!this.personalizationResult.personalizationOperation &&
      !this.personalizationResult.components
    );
  }

  /**
   * Ensures the personalized component is loaded.
   * @param {string} componentUid The unique identifier of a component.
   * @returns {ComponentRendering} The personalized component.
   */
  async ensurePersonalizedComponentLoaded(
    componentUid: string
  ): Promise<ComponentRendering | null> {
    if (!this.personalizationResult.personalizationOperation) {
      throw new Error(
        `${this.fetchPersonalization.name} should be called before getting personalized component`
      );
    }

    const personalizedComponents = await this.personalizationResult.personalizationOperation;
    if (!personalizedComponents) {
      return null;
    }

    return personalizedComponents[componentUid] ?? null;
  }

  /**
   * Personalizes components.
   * @param {PersonalizationContext} context The context.
   * @param {PersonalizableComponentRendering[]} personalizableRenderings The personalizable components.
   * @returns {Object.<string, ComponentRendering | null>} The personalized components.
   */
  async personalizeComponents(
    context: PersonalizationContext,
    personalizableRenderings: PersonalizableComponentRendering[]
  ): Promise<{ [key: string]: ComponentRendering | null }> {
    if (personalizableRenderings.length === 0) {
      return {};
    }

    const personalizedRenderingIds = personalizableRenderings.map((r) => r.uid);
    let personalizedFragments: { [key: string]: ComponentRendering | null | undefined } = {};

    try {
      const personalizationDecisionsResult = await this.personalizationDecisionsService.getPersonalizationDecisions(
        {
          routePath: context.routePath,
          language: context.language,
          renderingIds: personalizedRenderingIds,
        }
      );
      personalizedFragments = await this.resolveFragments(personalizationDecisionsResult, context);
    } catch (error) {
      // catch all errors on getting a personalization decision
      console.error(error);
      // default will be used for unresolved fragments
      personalizedRenderingIds.forEach((id) => (personalizedFragments[id] = undefined));
    }

    const result: { [key: string]: ComponentRendering | null } = {};
    personalizableRenderings.forEach((pr) => {
      result[pr.uid] = this.layoutPersonalizationUtils.buildPersonalizedFragment(
        pr.uid,
        personalizedFragments,
        pr.personalization.defaultComponent
      );
    });

    return result;
  }

  /**
   * Resolves the fragments.
   * @param {PersonalizationDecisionData} personalizationDecisionsResult The personalization decisions.
   * @param {PersonalizationContext} context The context.
   * @returns {Object.<string, ComponentRendering | null | undefined>} The fragments.
   */
  private async resolveFragments(
    personalizationDecisionsResult: PersonalizationDecisionData,
    context: PersonalizationContext
  ): Promise<{ [key: string]: ComponentRendering | null | undefined }> {
    const personalizedFragments: { [key: string]: ComponentRendering | null | undefined } = {};
    const renderingsDecisions = personalizationDecisionsResult.renderings;
    const personalizedFragmentsRequests: Promise<void>[] = [];

    for (const [renderingId, decision] of Object.entries(renderingsDecisions)) {
      const variantKey = decision?.variantKey;
      if (variantKey) {
        // load fragments in parallel
        personalizedFragmentsRequests.push(
          this.layoutFragmentService
            .fetchLayoutFragmentData(context.routePath, context.language, renderingId, variantKey)
            .then((fr) => {
              personalizedFragments[renderingId] = fr.fragment;
            })
            .catch((error) => {
              console.error(error);

              // default will be used in case failed to resolve the fragment
              personalizedFragments[renderingId] = undefined;
            })
        );
      } else if (variantKey === null) {
        // hidden by personalization
        personalizedFragments[renderingId] = null;
      } else {
        // was not able to resolve decision for the rendering, default will be used
        personalizedFragments[renderingId] = undefined;
      }
    }

    await Promise.all(personalizedFragmentsRequests);

    return personalizedFragments;
  }
}
