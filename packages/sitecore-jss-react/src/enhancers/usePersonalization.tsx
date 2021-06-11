import { ComponentRendering, LayoutPersonalizationService } from '@sitecore-jss/sitecore-jss';
import { useEffect, createElement, useReducer, ComponentType } from 'react';
import { MissingComponent } from '../components/MissingComponent';
import { ComponentFactory } from '../components/sharedTypes';

export interface UsePersonalizationOptions {
  /**
   * The unique identifier of the component
   */
  uid: string;
  /**
   * The component factory
   */
  componentFactory: ComponentFactory;
  /**
   * The layout personalization service
   */
  layoutPersonalizationService: LayoutPersonalizationService;
  /**
   * The component type for a missing component
   */
  missingComponentComponent?: ComponentType;
}

export interface UsePersonalizationResult {
  /**
   * A value that indicates whether loading is in-progress
   */
  isLoading: boolean;
  /**
   * The personalized component
   */
  personalizedComponent: React.ReactElement | null;
}

/**
 * This hook encapsulates awaiting for personalized component and its creation.
 * @param {UsePersonalizationOptions} options
 * @returns {UsePersonalizationResult} result
 */
export function usePersonalization(options: UsePersonalizationOptions): UsePersonalizationResult {
  // forceUpdate emulating, we need to re-render the component after personalization loading
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  const personalizedComponentLayout = options.layoutPersonalizationService.getPersonalizedComponent(
    options.uid
  );
  const isLoading = options.layoutPersonalizationService.isLoading();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    let isUnMounted = false;
    options.layoutPersonalizationService.ensurePersonalizedComponentLoaded(options.uid).then(() => {
      // emulate forceUpdate, do not set state if component already unmounted
      if (!isUnMounted) {
        forceUpdate();
      }
    });

    return () => {
      isUnMounted = true;
    };
  });

  return {
    personalizedComponent: personalizedComponentLayout
      ? createPersonalizedComponent(personalizedComponentLayout, options)
      : null,
    isLoading: isLoading,
  };
}

/**
 * @param {ComponentRendering} personalizedComponentLayout
 * @param {UsePersonalizationOptions} options
 * @returns {React.ReactElement | null} component
 */
function createPersonalizedComponent(
  personalizedComponentLayout: ComponentRendering,
  options: UsePersonalizationOptions
): React.ReactElement | null {
  let personalizedComponent: React.ReactElement | null = null;

  if (options.componentFactory) {
    let component = options.componentFactory(personalizedComponentLayout.componentName);
    if (!component) {
      component = options.missingComponentComponent ?? MissingComponent;
      console.error(
        `Unknown component ${personalizedComponentLayout.componentName}. Ensure that a React component exists for it, and that it is registered in your componentFactory.js.`
      );
    }

    personalizedComponent = createElement<{ [attr: string]: unknown }>(
      component as React.ComponentType,
      {
        fields: personalizedComponentLayout.fields,
        params: personalizedComponentLayout.params,
        rendering: personalizedComponentLayout,
      }
    );
  } else {
    console.error('Unable to resolve componentFactory.');
  }
  return personalizedComponent;
}
