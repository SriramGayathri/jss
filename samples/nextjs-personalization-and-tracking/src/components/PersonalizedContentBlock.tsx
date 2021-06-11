import {
  Text,
  RichText,
  Field,
  ComponentParams,
  ComponentFactory,
  ComponentRendering,
} from '@sitecore-jss/sitecore-jss-nextjs';

type ContentBlockProps = {
  componentFactory: ComponentFactory;
  rendering: ComponentRendering;
  params: ComponentParams;
  fields: {
    heading: Field<string>;
    content: Field<string>;
  };
};

const PersonalizedContentBlock = ({ fields }: ContentBlockProps): JSX.Element => (
  <>
    <Text tag="h2" className="display-4" field={fields.heading} />
    <RichText className="contentDescription" field={fields.content} />
  </>
);

export default PersonalizedContentBlock;
