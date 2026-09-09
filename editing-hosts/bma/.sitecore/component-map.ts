// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as VideoEmbedItem from 'src/components/bma/VideoEmbedItem';
import * as VideoEmbedGrid from 'src/components/bma/VideoEmbedGrid';
import * as TopBar from 'src/components/bma/TopBar';
import * as SocialLinkItem from 'src/components/bma/SocialLinkItem';
import * as RichTextSection from 'src/components/bma/RichTextSection';
import * as PageUtilityActions from 'src/components/bma/PageUtilityActions';
import * as PageTitleHeader from 'src/components/bma/PageTitleHeader';
import * as NavItem from 'src/components/bma/NavItem';
import * as Navigation from 'src/components/bma/Navigation';
import * as LinkListItem from 'src/components/bma/LinkListItem';
import * as LinkColumnGrid from 'src/components/bma/LinkColumnGrid';
import * as LinkColumn from 'src/components/bma/LinkColumn';
import * as HighlightLinkGrid from 'src/components/bma/HighlightLinkGrid';
import * as HighlightLinkCard from 'src/components/bma/HighlightLinkCard';
import * as HeroSlide from 'src/components/bma/HeroSlide';
import * as HeroCarousel from 'src/components/bma/HeroCarousel';
import * as Header from 'src/components/bma/Header';
import * as Footer from 'src/components/bma/Footer';
import * as DocumentResultCard from 'src/components/bma/DocumentResultCard';
import * as DocumentFilterOption from 'src/components/bma/DocumentFilterOption';
import * as DocumentFilterGroup from 'src/components/bma/DocumentFilterGroup';
import * as DocumentCentreLive from 'src/components/bma/DocumentCentreLive';
import * as DocumentCentreLayout from 'src/components/bma/DocumentCentreLayout';
import * as DatedLinkItem from 'src/components/bma/DatedLinkItem';
import * as CookieBanner from 'src/components/bma/CookieBanner';
import * as BreadcrumbItem from 'src/components/bma/BreadcrumbItem';
import * as Breadcrumb from 'src/components/bma/Breadcrumb';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['VideoEmbedItem', { ...VideoEmbedItem, componentType: 'client' }],
  ['VideoEmbedGrid', { ...VideoEmbedGrid, componentType: 'client' }],
  ['TopBar', { ...TopBar, componentType: 'client' }],
  ['SocialLinkItem', { ...SocialLinkItem, componentType: 'client' }],
  ['RichTextSection', { ...RichTextSection, componentType: 'client' }],
  ['PageUtilityActions', { ...PageUtilityActions, componentType: 'client' }],
  ['PageTitleHeader', { ...PageTitleHeader, componentType: 'client' }],
  ['NavItem', { ...NavItem, componentType: 'client' }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkListItem', { ...LinkListItem, componentType: 'client' }],
  ['LinkColumnGrid', { ...LinkColumnGrid, componentType: 'client' }],
  ['LinkColumn', { ...LinkColumn, componentType: 'client' }],
  ['HighlightLinkGrid', { ...HighlightLinkGrid, componentType: 'client' }],
  ['HighlightLinkCard', { ...HighlightLinkCard, componentType: 'client' }],
  ['HeroSlide', { ...HeroSlide, componentType: 'client' }],
  ['HeroCarousel', { ...HeroCarousel, componentType: 'client' }],
  ['Header', { ...Header, componentType: 'client' }],
  ['Footer', { ...Footer, componentType: 'client' }],
  ['DocumentResultCard', { ...DocumentResultCard, componentType: 'client' }],
  ['DocumentFilterOption', { ...DocumentFilterOption, componentType: 'client' }],
  ['DocumentFilterGroup', { ...DocumentFilterGroup, componentType: 'client' }],
  ['DocumentCentreLive', { ...DocumentCentreLive, componentType: 'client' }],
  ['DocumentCentreLayout', { ...DocumentCentreLayout, componentType: 'client' }],
  ['DatedLinkItem', { ...DatedLinkItem, componentType: 'client' }],
  ['CookieBanner', { ...CookieBanner, componentType: 'client' }],
  ['BreadcrumbItem', { ...BreadcrumbItem, componentType: 'client' }],
  ['Breadcrumb', { ...Breadcrumb, componentType: 'client' }],
]);

export default componentMap;
