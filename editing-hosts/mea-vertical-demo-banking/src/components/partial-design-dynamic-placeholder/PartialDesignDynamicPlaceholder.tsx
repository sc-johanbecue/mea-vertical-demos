import type { JSX } from 'react';
import { Placeholder } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from '@/lib/component-props';

/** Renders the dynamic placeholder for a Partial Design signature. */
const PartialDesignDynamicPlaceholder = (props: ComponentProps): JSX.Element => (
  <Placeholder name={props.rendering?.params?.sig || ''} rendering={props.rendering} />
);

export default PartialDesignDynamicPlaceholder;
