import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';
//import packageJson from '../../../package.json';
/**
 * Adds the ContentBlock component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function Jobs(manifest: Manifest) {
  manifest.addComponent({
    name: 'jobs',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      {
        name: 'job_list',
        type: CommonFieldTypes.ContentList,
        source: `dataSource=/sitecore/content/JssAngularWeb/content/Jobs/ContentListField`,
      },
    ],
  });
}
