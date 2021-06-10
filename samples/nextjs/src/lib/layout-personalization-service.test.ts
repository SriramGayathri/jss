/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {
  layoutPersonalizationService,
  loadPersonalization,
} from 'lib/layout-personalization-service';
import { NextRouter } from 'next/router';
import { LayoutServiceData, PersonalizationResult } from '../../../../packages/sitecore-jss/types';
import { trackingService } from './tracking-service';

use(sinonChai);

describe('LayoutPersonalizationService', () => {
  describe('loadPersonalization', () => {
    let layoutServiceData: LayoutServiceData;
    let router: NextRouter;

    beforeEach(function () {
      sinon.spy(layoutPersonalizationService, 'fetchPersonalization');
      sinon.spy(trackingService, 'trackCurrentPage');
      global.window = {
        document: {},
      } as Window;
      layoutServiceData = {
        sitecore: {
          context: {
            itemPath: '/localPath',
            language: 'en',
          },
          route: {
            name: 'name',
            placeholders: { 'jss-main': [] },
          },
        },
      };
      router = {
        query: {},
        asPath: '',
      } as NextRouter;
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should not call fetchPersonalization if application is running in disconnected mode', async () => {
      layoutServiceData.sitecore.route!.layoutId = 'available-in-connected-mode';
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(layoutPersonalizationService.fetchPersonalization).not.have.been.called;
    });

    it('should not call fetchPersonalization if application is running on server', async () => {
      global.window = undefined;
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(layoutPersonalizationService.fetchPersonalization).not.have.been.called;
    });

    it('should not call fetchPersonalization if application is running in preview mode', async () => {
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: true }, router);
      expect(layoutPersonalizationService.fetchPersonalization).not.have.been.called;
    });

    it('should not call fetchPersonalization if route in pageProps is null', async () => {
      layoutServiceData.sitecore.route = null;
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(layoutPersonalizationService.fetchPersonalization).not.have.been.called;
    });

    it('should not call fetchPersonalization if query params are not ready', async () => {
      router.asPath = 'some?thing';
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(layoutPersonalizationService.fetchPersonalization).not.have.been.called;
    });

    it('should call fetchPersonalization without trackCurrentPage if tracked is true', async () => {
      await loadPersonalization(
        { layoutData: layoutServiceData, isPreview: false, tracked: true },
        router
      );
      expect(layoutPersonalizationService.fetchPersonalization).have.callCount(1);
      expect(trackingService.trackCurrentPage).not.have.been.called;
    });

    it('should not call trackCurrentPage if personalizationResult is personalizable', async () => {
      layoutPersonalizationService.fetchPersonalization = async () => {
        return {
          isPersonalizable: true,
        } as PersonalizationResult;
      };
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(trackingService.trackCurrentPage).not.have.been.called;
    });

    it('should call fetchPersonalization and trackCurrentPage if query params are valid', async () => {
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      setImmediate(() => {
        expect(layoutPersonalizationService.fetchPersonalization).have.callCount(1);
        expect(layoutPersonalizationService.fetchPersonalization).have.been.calledWith(
          {
            routePath: layoutServiceData.sitecore.context.itemPath as string,
            language: layoutServiceData.sitecore.context.language as string,
          },
          layoutServiceData.sitecore.route!
        );
        expect(trackingService.trackCurrentPage).have.callCount(1);
        expect(trackingService.trackCurrentPage).have.been.calledWith(
          layoutServiceData.sitecore.context,
          layoutServiceData.sitecore.route
        );
      });
    });
  });
});

interface Global {
  window: Window | undefined;
}
declare const global: Global;
