import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the findjob component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function findjob(manifest: Manifest) {
  manifest.addComponent({
    name: 'Findjob',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'heading', type: CommonFieldTypes.SingleLineText },
      {
        name: 'allJob_list',
        type: CommonFieldTypes.ContentList,
        source: `dataSource=/sitecore/content/JssAngularWeb/content/Jobs/ContentListField`,
      },
      { name: 'loadMoreJobsBtn', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
