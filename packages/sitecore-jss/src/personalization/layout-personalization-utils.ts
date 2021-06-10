import {
  PersonalizableComponentRendering,
  isComponentRendering,
  isPersonalizableComponentRendering,
  ComponentRendering,
  PlaceholdersData,
} from '../layout/models';

export class LayoutPersonalizationUtils {
  buildPersonalizedFragment(
    uid: string,
    personalizedFragments: { [key: string]: ComponentRendering | null | undefined },
    defaultComponent: ComponentRendering | null
  ): ComponentRendering | null {
    const personalizedFragment = personalizedFragments[uid];

    if (personalizedFragment === null) {
      return null;
    }

    if (personalizedFragment === undefined) {
      return defaultComponent;
    }

    try {
      this.replaceNestedPersonalizedRenderings(personalizedFragment, personalizedFragments);
      return personalizedFragment;
    } catch (error) {
      console.error(error);
      return defaultComponent;
    }
  }

  getPersonalizableComponents(placeholders: PlaceholdersData): PersonalizableComponentRendering[] {
    const result: PersonalizableComponentRendering[] = [];

    for (const placeholder of Object.values(placeholders)) {
      for (const component of placeholder) {
        if (isPersonalizableComponentRendering(component)) {
          result.push(component);
        } else if (isComponentRendering(component) && component.placeholders) {
          const components = this.getPersonalizableComponents(component.placeholders);
          result.push(...components);
        }
      }
    }

    return result;
  }

  replacePersonalizableComponentsWithLoaderComponents(
    placeholders: PlaceholdersData,
    loaderComponentName: string
  ) {
    if (!placeholders) {
      return;
    }

    for (const placeholder of Object.values(placeholders)) {
      placeholder.forEach((component, index) => {
        if (isPersonalizableComponentRendering(component)) {
          const personalizableComponentRendering: PersonalizableComponentRendering = {
            componentName: loaderComponentName,
            uid: component.uid,
            personalization: {
              hiddenByDefault: component.personalization.hiddenByDefault,
              defaultComponent: component.personalization.hiddenByDefault ? null : component,
            },
          };
          placeholder[index] = personalizableComponentRendering;
        } else if (isComponentRendering(component) && component.placeholders) {
          this.replacePersonalizableComponentsWithLoaderComponents(
            component.placeholders,
            loaderComponentName
          );
        }
      });
    }
  }

  /**
   * @param {ComponentRendering} context
   * @param {object} personalizedFragments
   */
  private replaceNestedPersonalizedRenderings(
    context: ComponentRendering,
    personalizedFragments: { [key: string]: ComponentRendering | null | undefined }
  ) {
    if (!context.placeholders) {
      return;
    }

    for (const [key, placeholder] of Object.entries(context.placeholders)) {
      const hiddenComponents: string[] = [];

      placeholder.forEach((component, index) => {
        // if a component has no other keys but 'uid', it is personalized
        // such component needs to be replaced with the corresponding fragment
        if ('uid' in component && component.uid && Object.keys(component).length === 1) {
          const personalizedFragment = personalizedFragments[component.uid];

          if (personalizedFragment === null) {
            hiddenComponents.push(component.uid);
          } else if (personalizedFragment) {
            this.replaceNestedPersonalizedRenderings(personalizedFragment, personalizedFragments);

            placeholder[index] = personalizedFragment;
          } else {
            throw new Error('Fragment is missing');
          }
        } else if (isComponentRendering(component)) {
          this.replaceNestedPersonalizedRenderings(component, personalizedFragments);
        }
      });

      if (hiddenComponents.length) {
        context.placeholders[key] = placeholder.filter(
          (component) =>
            'uid' in component && component.uid && hiddenComponents.indexOf(component.uid) === -1
        );
      }
    }
  }
}
