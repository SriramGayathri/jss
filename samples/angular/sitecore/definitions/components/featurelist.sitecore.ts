import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the featurelist component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function featurelist(manifest: Manifest) {
  manifest.addComponent({
    name: 'Featurelist',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'aboutAirsideLink', type: CommonFieldTypes.GeneralLink },
      { name: 'aboutAirsideText', type: CommonFieldTypes.SingleLineText },
      { name: 'contactUsLink', type: CommonFieldTypes.GeneralLink },
      { name: 'contactUsText', type: CommonFieldTypes.SingleLineText },
      { name: 'tersmOfUseLink', type: CommonFieldTypes.GeneralLink },
      { name: 'termsOfUseText', type: CommonFieldTypes.SingleLineText },
      { name: 'privacyPolicyLink', type: CommonFieldTypes.GeneralLink },
      { name: 'privacyPolicyText', type: CommonFieldTypes.SingleLineText },
      { name: 'cookiePolicyLink', type: CommonFieldTypes.GeneralLink },
      { name: 'cookiePolicyText', type: CommonFieldTypes.SingleLineText },
      { name: 'cookieSettingLink', type: CommonFieldTypes.GeneralLink },
      { name: 'cookieSettingText', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
