import React, { JSX } from 'react';
import { Placeholder, type ComponentRendering } from '@sitecore-content-sdk/nextjs';
import { ComponentProps } from 'lib/component-props';

const SXA_SIG_PREFIX = 'sxa-';

/**
 * SXA often sends params.sig with an "sxa-" prefix while layout service keys
 * placeholders using the Partial Design Signature only (see authoring
 * "Signature" field, e.g. pepsico-corporate-header).
 */
function resolvePartialDesignPlaceholderName(rendering: ComponentRendering | undefined): string {
  const sig = rendering?.params?.sig?.trim() ?? '';
  if (!sig) return '';

  const placeholders = rendering?.placeholders;
  if (!placeholders || typeof placeholders !== 'object') return sig;

  const has = (key: string) => Object.prototype.hasOwnProperty.call(placeholders, key);

  if (has(sig)) return sig;

  if (sig.startsWith(SXA_SIG_PREFIX)) {
    const withoutPrefix = sig.slice(SXA_SIG_PREFIX.length);
    if (has(withoutPrefix)) return withoutPrefix;
  } else {
    const withPrefix = `${SXA_SIG_PREFIX}${sig}`;
    if (has(withPrefix)) return withPrefix;
  }

  return sig;
}

const PartialDesignDynamicPlaceholder = (props: ComponentProps): JSX.Element => {
  const name = resolvePartialDesignPlaceholderName(props.rendering);
  return <Placeholder name={name} rendering={props.rendering} />;
};

export default PartialDesignDynamicPlaceholder;
