// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SocialFeed from 'src/components/social-feed/SocialFeed';
import * as SelectedProducts from 'src/components/selected-products/SelectedProducts';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Promo from 'src/components/promo/Promo';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as ProductDetails from 'src/components/product-details/ProductDetails';
import * as PepsiCoProductListSection from 'src/components/pepsico/PepsiCoProductListSection';
import * as PepsiCoProductListCard from 'src/components/pepsico/PepsiCoProductListCard';
import * as PepsiCoProductDetail from 'src/components/pepsico/PepsiCoProductDetail';
import * as PepsiCoLinkBoxSection from 'src/components/pepsico/PepsiCoLinkBoxSection';
import * as PepsiCoLinkBoxCard from 'src/components/pepsico/PepsiCoLinkBoxCard';
import * as PepsiCoImageLinkBoxSection from 'src/components/pepsico/PepsiCoImageLinkBoxSection';
import * as PepsiCoImageLinkBoxCard from 'src/components/pepsico/PepsiCoImageLinkBoxCard';
import * as PepsiCoImageContentBlock from 'src/components/pepsico/PepsiCoImageContentBlock';
import * as PepsiCoImageCarouselSlide from 'src/components/pepsico/PepsiCoImageCarouselSlide';
import * as PepsiCoImageCarousel from 'src/components/pepsico/PepsiCoImageCarousel';
import * as PepsiCoHeroSection from 'src/components/pepsico/PepsiCoHeroSection';
import * as PepsiCoHeroCard from 'src/components/pepsico/PepsiCoHeroCard';
import * as PepsiCoHeader from 'src/components/pepsico/PepsiCoHeader';
import * as PepsiCoFooter from 'src/components/pepsico/PepsiCoFooter';
import * as PepsiCoContentBlock from 'src/components/pepsico/PepsiCoContentBlock';
import * as PepsiCoBoxSection from 'src/components/pepsico/PepsiCoBoxSection';
import * as PepsiCoBoxCard from 'src/components/pepsico/PepsiCoBoxCard';
import * as PepsiCoBanner from 'src/components/pepsico/PepsiCoBanner';
import * as PepsiCoArticleBoxCard from 'src/components/pepsico/PepsiCoArticleBoxCard';
import * as PepsiCoArticle from 'src/components/pepsico/PepsiCoArticle';
import * as PepsiCoAlert from 'src/components/pepsico/PepsiCoAlert';
import * as pepsicoherodesktopbgcontext from 'src/components/pepsico/pepsico-hero-desktop-bg-context';
import * as SimpleExampleSection from 'src/components/pepsico/SEComponentExamples/SectionCard/SimpleExample Section';
import * as SimpleExampleCard from 'src/components/pepsico/SEComponentExamples/SectionCard/SimpleExample Card';
import * as ExampleTabsTab from 'src/components/pepsico/SEComponentExamples/Example Tabs/ExampleTabs - Tab';
import * as ExampleTabsSection from 'src/components/pepsico/SEComponentExamples/Example Tabs/ExampleTabs - Section';
import * as ExampleTabsCard from 'src/components/pepsico/SEComponentExamples/Example Tabs/ExampleTabs - Card';
import * as ExampleCarouselSection from 'src/components/pepsico/SEComponentExamples/CarouselCard/ExampleCarouselSection';
import * as ExampleCarouselCard from 'src/components/pepsico/SEComponentExamples/CarouselCard/ExampleCarouselCard';
import * as PepsiCoCorporateWordTile from 'src/components/pepsico/corporate/PepsiCoCorporateWordTile';
import * as PepsiCoCorporateWordGrid from 'src/components/pepsico/corporate/PepsiCoCorporateWordGrid';
import * as PepsiCoCorporateSustainability from 'src/components/pepsico/corporate/PepsiCoCorporateSustainability';
import * as PepsiCoCorporateStoryCard from 'src/components/pepsico/corporate/PepsiCoCorporateStoryCard';
import * as PepsiCoCorporateNewsSection from 'src/components/pepsico/corporate/PepsiCoCorporateNewsSection';
import * as PepsiCoCorporateNewsroomHero from 'src/components/pepsico/corporate/PepsiCoCorporateNewsroomHero';
import * as PepsiCoCorporateNewsroomCta from 'src/components/pepsico/corporate/PepsiCoCorporateNewsroomCta';
import * as PepsiCoCorporateNewsFeed from 'src/components/pepsico/corporate/PepsiCoCorporateNewsFeed';
import * as PepsiCoCorporateNewsArticleCard from 'src/components/pepsico/corporate/PepsiCoCorporateNewsArticleCard';
import * as PepsiCoCorporateMarquee from 'src/components/pepsico/corporate/PepsiCoCorporateMarquee';
import * as PepsiCoCorporateHero from 'src/components/pepsico/corporate/PepsiCoCorporateHero';
import * as PepsiCoCorporateHeader from 'src/components/pepsico/corporate/PepsiCoCorporateHeader';
import * as PepsiCoCorporateFooter from 'src/components/pepsico/corporate/PepsiCoCorporateFooter';
import * as PepsiCoCorporateFindYourFaves from 'src/components/pepsico/corporate/PepsiCoCorporateFindYourFaves';
import * as PepsiCoCorporateFeaturedNews from 'src/components/pepsico/corporate/PepsiCoCorporateFeaturedNews';
import * as PepsiCoCorporateBrandSlide from 'src/components/pepsico/corporate/PepsiCoCorporateBrandSlide';
import * as pepsicocorporatemarketingfallbacks from 'src/components/pepsico/corporate/pepsico-corporate-marketing-fallbacks';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageHeader from 'src/components/page-header/PageHeader';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Offers from 'src/components/offers/Offers';
import * as NavigationIcons from 'src/components/navigation-icons/NavigationIcons';
import * as Navigation from 'src/components/navigation/Navigation';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LanguageSwitcher from 'src/components/language-switcher/LanguageSwitcher';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['SocialFollow', { ...SocialFollow }],
  ['SocialFeed', { ...SocialFeed }],
  ['SelectedProducts', { ...SelectedProducts }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Promo', { ...Promo }],
  ['ProductListing', { ...ProductListing }],
  ['ProductDetails', { ...ProductDetails }],
  ['PepsiCoProductListSection', { ...PepsiCoProductListSection, componentType: 'client' }],
  ['PepsiCoProductListCard', { ...PepsiCoProductListCard, componentType: 'client' }],
  ['PepsiCoProductDetail', { ...PepsiCoProductDetail, componentType: 'client' }],
  ['PepsiCoLinkBoxSection', { ...PepsiCoLinkBoxSection, componentType: 'client' }],
  ['PepsiCoLinkBoxCard', { ...PepsiCoLinkBoxCard, componentType: 'client' }],
  ['PepsiCoImageLinkBoxSection', { ...PepsiCoImageLinkBoxSection, componentType: 'client' }],
  ['PepsiCoImageLinkBoxCard', { ...PepsiCoImageLinkBoxCard, componentType: 'client' }],
  ['PepsiCoImageContentBlock', { ...PepsiCoImageContentBlock, componentType: 'client' }],
  ['PepsiCoImageCarouselSlide', { ...PepsiCoImageCarouselSlide, componentType: 'client' }],
  ['PepsiCoImageCarousel', { ...PepsiCoImageCarousel, componentType: 'client' }],
  ['PepsiCoHeroSection', { ...PepsiCoHeroSection, componentType: 'client' }],
  ['PepsiCoHeroCard', { ...PepsiCoHeroCard, componentType: 'client' }],
  ['PepsiCoHeader', { ...PepsiCoHeader, componentType: 'client' }],
  ['PepsiCoFooter', { ...PepsiCoFooter, componentType: 'client' }],
  ['PepsiCoContentBlock', { ...PepsiCoContentBlock, componentType: 'client' }],
  ['PepsiCoBoxSection', { ...PepsiCoBoxSection, componentType: 'client' }],
  ['PepsiCoBoxCard', { ...PepsiCoBoxCard, componentType: 'client' }],
  ['PepsiCoBanner', { ...PepsiCoBanner, componentType: 'client' }],
  ['PepsiCoArticleBoxCard', { ...PepsiCoArticleBoxCard, componentType: 'client' }],
  ['PepsiCoArticle', { ...PepsiCoArticle, componentType: 'client' }],
  ['PepsiCoAlert', { ...PepsiCoAlert, componentType: 'client' }],
  ['pepsico-hero-desktop-bg-context', { ...pepsicoherodesktopbgcontext, componentType: 'client' }],
  ['SimpleExample Section', { ...SimpleExampleSection, componentType: 'client' }],
  ['SimpleExample Card', { ...SimpleExampleCard, componentType: 'client' }],
  ['ExampleTabs - Tab', { ...ExampleTabsTab, componentType: 'client' }],
  ['ExampleTabs - Section', { ...ExampleTabsSection, componentType: 'client' }],
  ['ExampleTabs - Card', { ...ExampleTabsCard, componentType: 'client' }],
  ['ExampleCarouselSection', { ...ExampleCarouselSection, componentType: 'client' }],
  ['ExampleCarouselCard', { ...ExampleCarouselCard, componentType: 'client' }],
  ['PepsiCoCorporateWordTile', { ...PepsiCoCorporateWordTile, componentType: 'client' }],
  ['PepsiCoCorporateWordGrid', { ...PepsiCoCorporateWordGrid, componentType: 'client' }],
  ['PepsiCoCorporateSustainability', { ...PepsiCoCorporateSustainability, componentType: 'client' }],
  ['PepsiCoCorporateStoryCard', { ...PepsiCoCorporateStoryCard, componentType: 'client' }],
  ['PepsiCoCorporateNewsSection', { ...PepsiCoCorporateNewsSection, componentType: 'client' }],
  ['PepsiCoCorporateNewsroomHero', { ...PepsiCoCorporateNewsroomHero, componentType: 'client' }],
  ['PepsiCoCorporateNewsroomCta', { ...PepsiCoCorporateNewsroomCta, componentType: 'client' }],
  ['PepsiCoCorporateNewsFeed', { ...PepsiCoCorporateNewsFeed, componentType: 'client' }],
  ['PepsiCoCorporateNewsArticleCard', { ...PepsiCoCorporateNewsArticleCard, componentType: 'client' }],
  ['PepsiCoCorporateMarquee', { ...PepsiCoCorporateMarquee, componentType: 'client' }],
  ['PepsiCoCorporateHero', { ...PepsiCoCorporateHero, componentType: 'client' }],
  ['PepsiCoCorporateHeader', { ...PepsiCoCorporateHeader, componentType: 'client' }],
  ['PepsiCoCorporateFooter', { ...PepsiCoCorporateFooter, componentType: 'client' }],
  ['PepsiCoCorporateFindYourFaves', { ...PepsiCoCorporateFindYourFaves, componentType: 'client' }],
  ['PepsiCoCorporateFeaturedNews', { ...PepsiCoCorporateFeaturedNews, componentType: 'client' }],
  ['PepsiCoCorporateBrandSlide', { ...PepsiCoCorporateBrandSlide, componentType: 'client' }],
  ['pepsico-corporate-marketing-fallbacks', { ...pepsicocorporatemarketingfallbacks }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageHeader', { ...PageHeader }],
  ['PageContent', { ...PageContent }],
  ['Offers', { ...Offers }],
  ['NavigationIcons', { ...NavigationIcons }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['LinkList', { ...LinkList, componentType: 'client' }],
  ['LanguageSwitcher', { ...LanguageSwitcher, componentType: 'client' }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header, componentType: 'client' }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ColumnSplitter', { ...ColumnSplitter }],
]);

export default componentMap;
