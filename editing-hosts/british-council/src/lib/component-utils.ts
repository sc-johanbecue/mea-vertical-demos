import { ComponentProps } from '@/lib/component-props';

/** Stable React key for Sitecore placeholder siblings. */
export function componentKey(props: ComponentProps): string {
  return props.params?.RenderingIdentifier ?? props.rendering?.uid ?? 'component';
}
