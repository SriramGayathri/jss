import 'jsdom-global/register';
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { render, shallow } from 'enzyme';
import sinon from 'sinon';
import { SitecorePageProps } from 'lib/page-props';
import SitecorePage from './[[...path]]';
import { layoutPersonalizationService } from 'lib/layout-personalization-service';
import { NextRouter } from 'next/router';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

use(sinonChai);

describe('SitecorePage', () => {
  describe('render', () => {
    beforeEach(function () {
      sinon.spy(layoutPersonalizationService, 'fetchPersonalization');
    });

    afterEach(function () {
      sinon.restore();
    });

    it('should call fetchPersonalization once with passed props', () => {
      const router = {
        query: {},
        asPath: '',
      } as NextRouter;

      try {
        render(
          <RouterContext.Provider value={router}>
            <SitecorePage {...sitecorePageProps} />
          </RouterContext.Provider>
        );
      } catch {}
      expect(layoutPersonalizationService.fetchPersonalization).to.have.been.callCount(1);
      expect(layoutPersonalizationService.fetchPersonalization).to.have.been.calledWith(
        {
          routePath: sitecorePageProps?.layoutData?.sitecore?.context?.itemPath as string,
          language: sitecorePageProps?.layoutData?.sitecore?.context?.language,
        },
        sitecorePageProps?.layoutData?.sitecore?.route
      );
    });

    it('should not call fetchPersonalization if query params are not ready', () => {
      const router = {
        query: {},
        asPath: 'some?thing',
      } as NextRouter;

      try {
        render(
          <RouterContext.Provider value={router}>
            <SitecorePage {...sitecorePageProps} />
          </RouterContext.Provider>
        );
      } catch {}
      expect(layoutPersonalizationService.fetchPersonalization).to.not.have.been.called;
    });

    it('should not call fetchPersonalization if application is running in disconnected mode', () => {
      const props: SitecorePageProps = {
        ...sitecorePageProps,
        layoutData: {
          sitecore: {
            context: {},
            route: {
              name: 'name',
              layoutId: 'available-in-connected-mode',
              placeholders: { 'jss-main': [] },
            },
          },
        },
      };
      shallow(<SitecorePage {...props} />);
      expect(layoutPersonalizationService.fetchPersonalization).to.not.have.been.called;
    });

    it('should not call fetchPersonalization if application is running on server', () => {
      global.window = undefined;
      shallow(<SitecorePage {...sitecorePageProps} />);
      expect(layoutPersonalizationService.fetchPersonalization).to.not.have.been.called;
    });

    it('should not call fetchPersonalization if application is running in preview mode', () => {
      const props: SitecorePageProps = {
        ...sitecorePageProps,
        isPreview: true,
      };
      shallow(<SitecorePage {...props} />);
      expect(layoutPersonalizationService.fetchPersonalization).to.not.have.been.called;
    });
  });
});

const sitecorePageProps: SitecorePageProps = {
  locale: '',
  layoutData: {
    sitecore: {
      context: {},
      route: {
        name: 'name',
        placeholders: { 'jss-main': [] },
      },
    },
  },
  dictionary: {},
  componentProps: {},
  notFound: false,
  tracked: false,
  isPreview: false,
};
interface Global {
  window: undefined;
}
declare const global: Global;
