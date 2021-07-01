import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the socialmedia component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function socialmedia(manifest: Manifest) {
  manifest.addComponent({
    name: 'Socialmedia',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'linkedIn', type: CommonFieldTypes.Image },
      { name: 'facebook', type: CommonFieldTypes.Image },
      { name: 'instagram', type: CommonFieldTypes.Image },
      { name: 'twitter', type: CommonFieldTypes.Image },
      { name: 'copyRight', type: CommonFieldTypes.SingleLineText },
    ],
  });
}
