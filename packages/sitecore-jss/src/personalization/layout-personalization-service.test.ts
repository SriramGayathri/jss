/* eslint-disable no-unused-expressions */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { expect, spy, use } from 'chai';
import spies from 'chai-spies';
import chaiAsPromised from 'chai-as-promised';
import { PersonalizationDecisionsService } from './personalization-decisions-service';
import { createStubInstance, stub, SinonStubbedInstance, SinonStub } from 'sinon';
import { LayoutFragmentService } from './layout-fragment-service';
import {
  LayoutPersonalizationService,
  PersonalizationContext,
} from './layout-personalization-service';
import { LayoutPersonalizationUtils } from './layout-personalization-utils';
import { ComponentRendering } from '../layout/models';

use(spies);
use(chaiAsPromised);

describe('LayoutPersonalizationService', () => {
  let layoutPersonalizationService: LayoutPersonalizationService;
  let fetchLayoutFragmentDataStub: SinonStub;
  let getPersonalizationDecisionsStub: SinonStub;
  let layoutPersonalizationUtils: SinonStubbedInstance<LayoutPersonalizationUtils>;
  const context: PersonalizationContext = {
    routePath: 'ip',
    language: 'lang',
  };

  beforeEach(() => {
    spy.on(console, 'error');
    const personalizationDecisionsService = <PersonalizationDecisionsService>{};
    getPersonalizationDecisionsStub = stub();
    personalizationDecisionsService.getPersonalizationDecisions = getPersonalizationDecisionsStub;

    const layoutFragmentService = <LayoutFragmentService>{};
    fetchLayoutFragmentDataStub = stub();
    layoutFragmentService.fetchLayoutFragmentData = fetchLayoutFragmentDataStub;
    layoutPersonalizationUtils = createStubInstance(LayoutPersonalizationUtils);
    layoutPersonalizationUtils.buildPersonalizedFragment.callsFake(
      (
        uid: string,
        personalizedFragments: { [key: string]: ComponentRendering | null | undefined }
      ) => {
        const fragment = personalizedFragments[uid];
        return fragment === undefined ? null : fragment;
      }
    );

    layoutPersonalizationService = new LayoutPersonalizationService(
      personalizationDecisionsService,
      layoutFragmentService
    );
    (<any>layoutPersonalizationService).layoutPersonalizationUtils = layoutPersonalizationUtils;
  });

  afterEach(() => {
    spy.restore(console);
  });

  describe('fetchPersonalization', () => {
    it('should clear state before loading', async () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns([]);
      (<any>(
        layoutPersonalizationService
      )).personalizationResult.personalizationOperation = Promise.resolve({});
      (<any>layoutPersonalizationService).personalizationResult.components = {};

      await layoutPersonalizationService.fetchPersonalization(context, routeData);

      expect((<any>layoutPersonalizationService).personalizationResult.personalizationOperation).to
        .be.undefined;
      expect((<any>layoutPersonalizationService).personalizationResult.components).to.be.undefined;
    });

    it('should return isPersonalizable false if no personalizable components', async () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns([]);

      const result = await layoutPersonalizationService.fetchPersonalization(context, routeData);

      expect(result.isPersonalizable).to.be.false;
    });

    it('should return error if personalize fails', () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      const personalizedRendering = [
        {
          componentName: 'cn1',
          uid: 'uid1',
          personalization: { hiddenByDefault: false, defaultComponent: null },
        },
      ];
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns(personalizedRendering);
      const personalizeStub = stub();
      personalizeStub
        .withArgs(context, personalizedRendering)
        .returns(Promise.reject('test error'));
      layoutPersonalizationService.personalizeComponents = personalizeStub;

      expect(
        layoutPersonalizationService.fetchPersonalization(context, routeData)
      ).to.be.rejectedWith('test error');
    });

    it('should set state and return result', async () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      const personalizedRendering = [
        {
          componentName: 'cn1',
          uid: 'uid1',
          personalization: { hiddenByDefault: false, defaultComponent: null },
        },
      ];
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns(personalizedRendering);
      const personalizeStub = stub();
      const personalizeComponents = { uid1: { componentName: 'cm1' } };
      const personalizeResult = Promise.resolve(personalizeComponents);
      personalizeStub.withArgs(context, personalizedRendering).returns(personalizeResult);
      layoutPersonalizationService.personalizeComponents = personalizeStub;

      const result = await layoutPersonalizationService.fetchPersonalization(context, routeData);

      expect(result.isPersonalizable).to.be.true;
      expect((<any>layoutPersonalizationService).personalizationResult.components).to.be.deep.equal(
        personalizeComponents
      );
    });
  });

  describe('ensurePersonalizedComponentLoaded', () => {
    it('should return error if personalizationResult is not defined', () => {
      expect(
        layoutPersonalizationService.ensurePersonalizedComponentLoaded('test')
      ).to.be.rejectedWith(
        'fetchPersonalization should be called before getting personalized component'
      );
    });

    it('should return error if personalizationResult is rejected', () => {
      (<any>(
        layoutPersonalizationService
      )).personalizationResult.personalizationOperation = Promise.reject('testError');
      expect(
        layoutPersonalizationService.ensurePersonalizedComponentLoaded('test')
      ).to.be.rejectedWith('testError');
    });

    it('should return component from personalizationResult', async () => {
      (<any>(
        layoutPersonalizationService
      )).personalizationResult.personalizationOperation = Promise.resolve({
        test1: { componentName: 'cn1' },
      });

      const result = await layoutPersonalizationService.ensurePersonalizedComponentLoaded('test1');

      expect(result).to.be.deep.equal({ componentName: 'cn1' });
    });

    it('should return null if component not found in personalizationResult', async () => {
      (<any>(
        layoutPersonalizationService
      )).personalizationResult.personalizationOperation = Promise.resolve({
        test1: { componentName: 'cn1' },
      });

      const result = await layoutPersonalizationService.ensurePersonalizedComponentLoaded('test2');

      expect(result).to.be.null;
    });
  });

  describe('isLoading', () => {
    it('should return true if personalizedComponents is not yet resolved', () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      const personalizedRendering = [
        {
          componentName: 'cn1',
          uid: 'uid1',
          personalization: { hiddenByDefault: false, defaultComponent: null },
        },
      ];
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns(personalizedRendering);
      const personalizeStub = stub();
      personalizeStub
        .withArgs(context, personalizedRendering)
        .returns(new Promise((resolve) => setTimeout(() => resolve({}), 1)));
      layoutPersonalizationService.personalizeComponents = personalizeStub;

      layoutPersonalizationService.fetchPersonalization(context, routeData);

      const result = layoutPersonalizationService.isLoading();

      expect(result).is.true;
    });

    it('should return true if personalizedComponents are defined', async () => {
      const routeData = { name: 'testroute', placeholders: { 'jss-main': [] } };
      const personalizedRendering = [
        {
          componentName: 'cn1',
          uid: 'uid1',
          personalization: { hiddenByDefault: false, defaultComponent: null },
        },
      ];
      layoutPersonalizationUtils.getPersonalizableComponents
        .withArgs(routeData.placeholders)
        .returns(personalizedRendering);
      const personalizeStub = stub();
      personalizeStub.withArgs(context, personalizedRendering).returns(Promise.resolve({}));
      layoutPersonalizationService.personalizeComponents = personalizeStub;

      await layoutPersonalizationService.fetchPersonalization(context, routeData);

      const result = layoutPersonalizationService.isLoading();

      expect(result).is.false;
    });

    it('should return false if personalization was not started', () => {
      const result = layoutPersonalizationService.isLoading();

      expect(result).is.false;
    });
  });

  describe('getPersonalizedComponent', () => {
    it('should return null if personalizedComponents is not defined', () => {
      const result = layoutPersonalizationService.getPersonalizedComponent('test');

      expect(result).is.null;
    });

    it('should return null if component for specified uid not defined', () => {
      (<any>layoutPersonalizationService).personalizedComponents = {
        test2: { componentName: 'cn2' },
      };
      const result = layoutPersonalizationService.getPersonalizedComponent('test');

      expect(result).is.null;
    });
  });

  describe('personalizeComponents', () => {
    it('should return empty object if personalizedRenderings is empty', async () => {
      const result = await layoutPersonalizationService.personalizeComponents(context, []);

      expect(result).deep.equals({});
    });

    it('should return null for hidden and error decision', async () => {
      const personalizedRendering1 = {
        componentName: 'cn1',
        uid: 'uid1',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      const personalizedRendering2 = {
        componentName: 'cn2',
        uid: 'uid2',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      getPersonalizationDecisionsStub.returns(
        Promise.resolve({
          renderings: {
            uid1: { variantKey: null },
            uid2: { errorMessage: 'aaaa' },
          },
        })
      );

      const result = await layoutPersonalizationService.personalizeComponents(context, [
        personalizedRendering1,
        personalizedRendering2,
      ]);

      expect(result).to.deep.equals({ uid1: null, uid2: null });
    });

    it('should set undefined for fragment if getting decisions failed', async () => {
      const personalizedRendering1 = {
        componentName: 'cn1',
        uid: 'uid1',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      const personalizedRendering2 = {
        componentName: 'cn2',
        uid: 'uid2',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      const error = new Error('I am Error!');
      getPersonalizationDecisionsStub.returns(Promise.reject(error));

      const result = await layoutPersonalizationService.personalizeComponents(context, [
        personalizedRendering1,
        personalizedRendering2,
      ]);

      expect(console.error).to.have.been.called.with(error);
      expect(result).to.deep.equals({ uid1: null, uid2: null });
      expect(
        layoutPersonalizationUtils.buildPersonalizedFragment.getCall(0).args[1]
      ).to.deep.equals({ uid1: undefined, uid2: undefined });
      expect(
        layoutPersonalizationUtils.buildPersonalizedFragment.getCall(1).args[1]
      ).to.deep.equals({ uid1: undefined, uid2: undefined });
    });

    it('should return variant based on fragment', async () => {
      const personalizedRendering1 = {
        componentName: 'cn1',
        uid: 'uid1',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      const personalizedRendering2 = {
        componentName: 'cn2',
        uid: 'uid2',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      getPersonalizationDecisionsStub.returns(
        Promise.resolve({
          renderings: {
            uid1: { variantKey: 'var1' },
            uid2: { variantKey: 'var2' },
          },
        })
      );

      fetchLayoutFragmentDataStub
        .withArgs(context.routePath, context.language, personalizedRendering1.uid, 'var1')
        .returns(
          Promise.resolve({ fragment: { componentName: 'comp1', uid: personalizedRendering1.uid } })
        );
      fetchLayoutFragmentDataStub
        .withArgs(context.routePath, context.language, personalizedRendering2.uid, 'var2')
        .returns(
          Promise.resolve({ fragment: { componentName: 'comp2', uid: personalizedRendering2.uid } })
        );

      const result = await layoutPersonalizationService.personalizeComponents(context, [
        personalizedRendering1,
        personalizedRendering2,
      ]);

      expect(result).to.deep.equals({
        uid1: { componentName: 'comp1', uid: personalizedRendering1.uid },
        uid2: { componentName: 'comp2', uid: personalizedRendering2.uid },
      });
    });

    it('should set undefined for fragment if getting fragment failed', async () => {
      const personalizedRendering1 = {
        componentName: 'cn1',
        uid: 'uid1',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      const personalizedRendering2 = {
        componentName: 'cn2',
        uid: 'uid2',
        personalization: { hiddenByDefault: false, defaultComponent: null },
      };
      getPersonalizationDecisionsStub.returns(
        Promise.resolve({
          renderings: {
            uid1: { variantKey: 'var1' },
            uid2: { variantKey: 'var2' },
          },
        })
      );

      fetchLayoutFragmentDataStub
        .withArgs(context.routePath, context.language, personalizedRendering1.uid, 'var1')
        .returns(
          Promise.resolve({ fragment: { componentName: 'comp1', uid: personalizedRendering1.uid } })
        );
      const error = new Error('I am Error!');
      fetchLayoutFragmentDataStub
        .withArgs(context.routePath, context.language, personalizedRendering2.uid, 'var2')
        .returns(Promise.reject(error));

      const result = await layoutPersonalizationService.personalizeComponents(context, [
        personalizedRendering1,
        personalizedRendering2,
      ]);

      expect(result).to.deep.equals({
        uid1: { componentName: 'comp1', uid: personalizedRendering1.uid },
        uid2: null,
      });
      expect(
        layoutPersonalizationUtils.buildPersonalizedFragment.getCall(1).args[1]
      ).to.deep.equals({
        uid1: { componentName: 'comp1', uid: personalizedRendering1.uid },
        uid2: undefined,
      });
      expect(console.error).to.have.been.called.with(error);
    });
  });
});
