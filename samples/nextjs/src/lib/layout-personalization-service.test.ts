import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import sinon from 'sinon';
import {
  layoutPersonalizationService,
  loadPersonalization,
} from 'lib/layout-personalization-service';
import { NextRouter } from 'next/router';
import { LayoutServiceData } from '../../../../packages/sitecore-jss/types';
import { trackingService } from './tracking-service';

use(sinonChai);

describe('LayoutPersonalizationService', () => {
  describe('loadPersonalization', () => {
    let layoutServiceData: LayoutServiceData;
    let router: NextRouter;

    beforeEach(function () {
      sinon.spy(layoutPersonalizationService, 'fetchPersonalization');
      sinon.spy(trackingService, 'trackCurrentPage');
      layoutServiceData = {
        sitecore: {
          context: {},
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
      global.window = {
        document: {},
      } as Window;
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

    it('should call fetchPersonalization and trackCurrentPage if query params are valid', async () => {
      await loadPersonalization({ layoutData: layoutServiceData, isPreview: false }, router);
      expect(layoutPersonalizationService.fetchPersonalization).have.callCount(1);
      expect(trackingService.trackCurrentPage).have.callCount(1);
    });
  });
});

interface Global {
  window: Window | undefined;
}
declare const global: Global;
