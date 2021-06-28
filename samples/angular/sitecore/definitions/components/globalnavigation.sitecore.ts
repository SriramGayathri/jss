import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the globalnavigation component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function globalnavigation(manifest: Manifest) {
  manifest.addComponent({
    name: 'Globalnavigation',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      {
        name: 'nav_list',
        type: CommonFieldTypes.ContentList,
        source: `dataSource=/sitecore/content/JssAngularWeb/content/Nav`,
      },
    ],
  });
}
