import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the submenunavigation component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function submenunavigation(manifest: Manifest) {
  manifest.addComponent({
    name: 'Submenunavigation',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      {
        name: 'submenu_list',
        type: CommonFieldTypes.ContentList,
        source: `dataSource=/sitecore/content/JssAngularWeb/content/SubNav`,
      },
    ],
  });
}
