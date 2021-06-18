/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { expect, use } from 'chai';
import sinonChai from 'sinon-chai';
import { stub } from 'sinon';
import { TrackingService } from './tracking-service';
import { StubbedInstance, stubConstructor } from 'ts-sinon';
import { withCurrentPageTracking } from './with-personalization-and-tracking';
import { SitecorePageProps } from './page-props';
import { mount } from 'enzyme';
import { RouteData } from '@sitecore-jss/sitecore-jss-nextjs';
import { RouterContext } from 'next/dist/next-server/lib/router-context';

use(sinonChai);

describe('withCurrentPageTracking', () => {
  const router = {
    pathname: '/',
    route: '/',
    query: {},
    asPath: '/',
    components: {},
    isFallback: false,
    basePath: '',
    events: { emit: stub(), off: stub(), on: stub() },
    push: stub().callsFake(() => Promise.resolve(true)),
    replace: stub().callsFake(() => Promise.resolve(true)),
    reload: stub(),
    back: stub(),
    prefetch: stub().callsFake(() => Promise.resolve()),
    beforePopState: stub(),
  };
  let trackingService: StubbedInstance<TrackingService>;
  let TestComponentWithContext: React.FC<SitecorePageProps>;
  let testComponentProps: SitecorePageProps;

  beforeEach(() => {
    trackingService = stubConstructor(TrackingService);

    testComponentProps = {
      locale: 'en',
      dictionary: {},
      componentProps: {},
      layoutData: {
        sitecore: {
          route: {} as RouteData,
          context: {},
        },
      },
      isPreview: false,
      tracked: false,
      notFound: false,
    };

    TestComponentWithContext = withCurrentPageTracking(() => <div />, trackingService);
  });

  it('should track current page', () => {
    mount(
      <RouterContext.Provider value={router}>
        <TestComponentWithContext {...testComponentProps} />
      </RouterContext.Provider>
    );

    expect(trackingService.trackCurrentPage).to.have.been.calledWith(
      testComponentProps.layoutData?.sitecore.context,
      testComponentProps.layoutData?.sitecore.route
    );
  });
});
