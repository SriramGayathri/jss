import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the latestnews component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function latestnews(manifest: Manifest) {
  manifest.addComponent({
    name: 'Latestnews',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'newsTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'newsDescription', type: CommonFieldTypes.SingleLineText },
      { name: 'signUpBtnLink', type: CommonFieldTypes.GeneralLink },
      { name: 'signUpBtnText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
