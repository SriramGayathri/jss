import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import {
  Placeholder,
  VisitorIdentification,
  useSitecoreContext,
} from '@sitecore-jss/sitecore-jss-nextjs';
import { StyleguideSitecoreContextValue } from 'lib/component-props';

const publicUrl = process.env.PUBLIC_URL || '';

type LayoutProps = {
  context: StyleguideSitecoreContextValue;
};

const Layout = ({ context }: LayoutProps): JSX.Element => {
  const { updateSitecoreContext } = useSitecoreContext({ updatable: true });

  // Update Sitecore Context if layoutData has changed (i.e. on client-side route change).
  // Note the context object type here matches the initial value in [[...path]].tsx.
  useEffect(() => {
    updateSitecoreContext && updateSitecoreContext(context);
  }, [context]);

  const { route } = context;

  return (
    <>
      <Head>
        <title>{route?.fields?.pageTitle?.value || 'Page'}</title>
        <link rel="icon" href={`${publicUrl}/favicon.ico`} />
      </Head>

      <VisitorIdentification />

      {/* root placeholder for the app, which we add components to using route data */}
      <div className="container">
        <Link href="/">
          <a className="text-dark">
            <img src={`${publicUrl}/sc_logo.svg`} alt="Sitecore" />
          </a>
        </Link>
        <Placeholder name="jssnextpersonalizedweb-main" rendering={route} />
      </div>
    </>
  );
};

export default Layout;
