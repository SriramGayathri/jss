/* eslint-disable no-unused-expressions */
import React from 'react';
import { LayoutPersonalizationService, RouteData } from '@sitecore-jss/sitecore-jss';
import {
  createStubInstance,
  SinonStubbedInstance,
  StubbableType,
  SinonStubbedMember,
  stub,
  SinonSpy,
  createSandbox,
  SinonStub,
} from 'sinon';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { withSitecorePersonalizationContext } from './withSitecorePersonalizationContext';
import { SitecorePersonalizationContextProps } from '@sitecore-jss/sitecore-jss-react';
import { RouterContext } from 'next/dist/next-server/lib/router-context';
import * as SitecoreJssReact from '@sitecore-jss/sitecore-jss-react';
import * as SitecoreJss from '@sitecore-jss/sitecore-jss';
import * as SitecoreUtils from '../utils';

describe('withSitecorePersonalizationContext', () => {
  const sandbox = createSandbox();
  let layoutPersonalizationServiceStub: StubbedClass<LayoutPersonalizationService>;
  let testComponentProps: SitecorePersonalizationContextProps;
  let withSitecorePersonalizationContextFake: SinonSpy;
  let areQueryParamsReadyStub: SinonStub;
  let isServerStub: SinonStub;
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
  let TestComponentWithContext: React.FC<SitecorePersonalizationContextProps>;

  beforeEach(() => {
    layoutPersonalizationServiceStub = createSinonStubInstance(LayoutPersonalizationService);
    testComponentProps = {
      layoutData: {
        sitecore: {
          route: {} as RouteData,
          context: {},
        },
      },
      isPreview: false,
      isPersonalizationSuppressed: false,
      tracked: false,
    };
    withSitecorePersonalizationContextFake = sandbox.fake(() => <div />);
    sandbox
      .stub(SitecoreJssReact, 'withSitecorePersonalizationContext')
      .returns(withSitecorePersonalizationContextFake);
    areQueryParamsReadyStub = sandbox.stub(SitecoreUtils, 'areQueryParamsReady');
    isServerStub = sandbox.stub(SitecoreJss, 'isServer').returns(false);

    TestComponentWithContext = withSitecorePersonalizationContext(
      () => <div />,
      layoutPersonalizationServiceStub
    );
  });

  afterEach(function() {
    sandbox.restore();
  });

  it('should set suppress personalization when query params are not ready and not server rendering', () => {
    areQueryParamsReadyStub.returns(false);
    isServerStub.returns(false);

    mount(
      <RouterContext.Provider value={router}>
        <TestComponentWithContext {...testComponentProps} />
      </RouterContext.Provider>
    );

    const call = withSitecorePersonalizationContextFake.getCall(0);
    expect(call).not.null;
    const props = call.args[0] as SitecorePersonalizationContextProps;
    expect(props.isPersonalizationSuppressed).to.be.true;
    expect(props).deep.equals({ ...testComponentProps, isPersonalizationSuppressed: true });
    const areQueryParamsReadyCall = areQueryParamsReadyStub.getCall(0);
    expect(areQueryParamsReadyCall).not.null;
    expect(areQueryParamsReadyCall.args[0]).equal(router);
  });

  it('should not suppress personalization when query params are ready and not server rendering', () => {
    areQueryParamsReadyStub.returns(true);
    isServerStub.returns(false);

    mount(
      <RouterContext.Provider value={router}>
        <TestComponentWithContext {...testComponentProps} />
      </RouterContext.Provider>
    );

    const call = withSitecorePersonalizationContextFake.getCall(0);
    expect(call).not.null;
    const props = call.args[0] as SitecorePersonalizationContextProps;
    expect(props.isPersonalizationSuppressed).to.be.false;
    expect(props).deep.equals({ ...testComponentProps });
  });

  it('should not suppress personalization when query params are not ready and server rendering', () => {
    areQueryParamsReadyStub.returns(false);
    isServerStub.returns(true);

    mount(
      <RouterContext.Provider value={router}>
        <TestComponentWithContext {...testComponentProps} />
      </RouterContext.Provider>
    );

    const call = withSitecorePersonalizationContextFake.getCall(0);
    expect(call).not.null;
    const props = call.args[0] as SitecorePersonalizationContextProps;
    expect(props.isPersonalizationSuppressed).to.be.false;
    expect(props).deep.equals({ ...testComponentProps });
  });
});

export type StubbedClass<T> = SinonStubbedInstance<T> & T;

// Cannot createStubInstance on class with private members https://github.com/sinonjs/sinon/issues/1963
export const createSinonStubInstance = function<T>(
  constructor: StubbableType<T>,
  overrides?: { [K in keyof T]?: SinonStubbedMember<T[K]> }
): StubbedClass<T> {
  const stub = createStubInstance<T>(constructor, overrides);
  return (stub as unknown) as StubbedClass<T>;
};
