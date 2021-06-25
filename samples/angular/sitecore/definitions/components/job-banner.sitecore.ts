import { CommonFieldTypes, SitecoreIcon, Manifest } from '@sitecore-jss/sitecore-jss-manifest';

/**
 * Adds the jobBanner component to the disconnected manifest.
 * This function is invoked by convention (*.sitecore.ts) when `jss manifest` is run.
 */
export default function jobBanner(manifest: Manifest) {
  manifest.addComponent({
    name: 'JobBanner',
    icon: SitecoreIcon.DocumentTag,
    fields: [
      { name: 'jobTitle', type: CommonFieldTypes.SingleLineText },
      { name: 'postedTime', type: CommonFieldTypes.SingleLineText },
      { name: 'employer', type: CommonFieldTypes.SingleLineText },
      { name: 'country', type: CommonFieldTypes.SingleLineText },
      { name: 'ViewJobBtn', type: CommonFieldTypes.GeneralLink },
      { name: 'applyPartnerBtn', type: CommonFieldTypes.GeneralLink },
      { name: 'savetoFavorites', type: CommonFieldTypes.SingleLineText },
      { name: 'jobReferenceLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'jobReferenceValue', type: CommonFieldTypes.SingleLineText },
      { name: 'locatonLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'locationeValue', type: CommonFieldTypes.SingleLineText },
      { name: 'jobTypeLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'jobTypeValue', type: CommonFieldTypes.SingleLineText },
      { name: 'addressLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'addressValue', type: CommonFieldTypes.MultiLineText },
      { name: 'jobDescriptionLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'jobDescriptionValue', type: CommonFieldTypes.RichText },
      { name: 'minimumRequirementsLabel', type: CommonFieldTypes.SingleLineText },
      { name: 'minimumRequirementsValue', type: CommonFieldTypes.RichText },
      { name: 'reportJobBtn', type: CommonFieldTypes.GeneralLink },
    ],
  });
}
