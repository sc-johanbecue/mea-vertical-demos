// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as Title from 'src/components/title/Title';
import * as ThemeEditor from 'src/components/theme-editor/ThemeEditor';
import * as Subscribe from 'src/components/subscribe/Subscribe';
import * as SocialFollow from 'src/components/social-follow/SocialFollow';
import * as SocialFeed from 'src/components/social-feed/SocialFeed';
import * as SelectedProducts from 'src/components/selected-products/SelectedProducts';
import * as SelectedArticles from 'src/components/selected-articles/SelectedArticles';
import * as SectionWrapper from 'src/components/section-wrapper/SectionWrapper';
import * as SearchResults from 'src/components/search-results/SearchResults';
import * as RowSplitter from 'src/components/row-splitter/RowSplitter';
import * as RichText from 'src/components/rich-text/RichText';
import * as Reviews from 'src/components/reviews/Reviews';
import * as Promo from 'src/components/promo/Promo';
import * as ProductListing from 'src/components/product-listing/ProductListing';
import * as ProductDetails from 'src/components/product-details/ProductDetails';
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as PageContent from 'src/components/page-content/PageContent';
import * as Offers from 'src/components/offers/Offers';
import * as SuggestionBlock from 'src/components/non-sitecore/search/SuggestionBlock';
import * as Spinner from 'src/components/non-sitecore/search/Spinner';
import * as SortOrder from 'src/components/non-sitecore/search/SortOrder';
import * as SearchResultsComponent from 'src/components/non-sitecore/search/SearchResultsComponent';
import * as SearchPagination from 'src/components/non-sitecore/search/SearchPagination';
import * as SearchFacets from 'src/components/non-sitecore/search/SearchFacets';
import * as ResultsPerPage from 'src/components/non-sitecore/search/ResultsPerPage';
import * as QuestionsAnswers from 'src/components/non-sitecore/search/QuestionsAnswers';
import * as QueryResultsSummary from 'src/components/non-sitecore/search/QueryResultsSummary';
import * as PreviewSearch from 'src/components/non-sitecore/search/PreviewSearch';
import * as HomeHighlighted from 'src/components/non-sitecore/search/HomeHighlighted';
import * as CardViewSwitcher from 'src/components/non-sitecore/search/CardViewSwitcher';
import * as ArticleHorizontalCard from 'src/components/non-sitecore/search/ArticleHorizontalCard';
import * as ArticleCard from 'src/components/non-sitecore/search/ArticleCard';
import * as NavigationIcons from 'src/components/navigation-icons/NavigationIcons';
import * as Navigation from 'src/components/navigation/Navigation';
import * as VirtualTourBannerSection from 'src/components/millerhomes/VirtualTourBannerSection';
import * as TestimonialsSection from 'src/components/millerhomes/TestimonialsSection';
import * as StatsSection from 'src/components/millerhomes/StatsSection';
import * as StatCard from 'src/components/millerhomes/StatCard';
import * as SpecificationSection from 'src/components/millerhomes/SpecificationSection';
import * as SiteplanSection from 'src/components/millerhomes/SiteplanSection';
import * as SearchSection from 'src/components/millerhomes/SearchSection';
import * as SearchAgainSection from 'src/components/millerhomes/SearchAgainSection';
import * as PopupSection from 'src/components/millerhomes/PopupSection';
import * as PlotCard from 'src/components/millerhomes/PlotCard';
import * as PlotAvailabilitySection from 'src/components/millerhomes/PlotAvailabilitySection';
import * as PersonaliseSection from 'src/components/millerhomes/PersonaliseSection';
import * as PageTitleSection from 'src/components/millerhomes/PageTitleSection';
import * as NearbyDevelopmentsSection from 'src/components/millerhomes/NearbyDevelopmentsSection';
import * as NearbyDevelopmentCard from 'src/components/millerhomes/NearbyDevelopmentCard';
import * as MyMillerHomeSection from 'src/components/millerhomes/MyMillerHomeSection';
import * as MortgageCalculatorSection from 'src/components/millerhomes/MortgageCalculatorSection';
import * as LocalAmenitiesSection from 'src/components/millerhomes/LocalAmenitiesSection';
import * as InspirationSection from 'src/components/millerhomes/InspirationSection';
import * as ImageCarouselSection from 'src/components/millerhomes/ImageCarouselSection';
import * as HouseTypesSection from 'src/components/millerhomes/HouseTypesSection';
import * as HouseTypeInfoSection from 'src/components/millerhomes/HouseTypeInfoSection';
import * as HouseTypeHeroSection from 'src/components/millerhomes/HouseTypeHeroSection';
import * as HouseTypeCard from 'src/components/millerhomes/HouseTypeCard';
import * as HeroCarouselSection from 'src/components/millerhomes/HeroCarouselSection';
import * as HeaderSection from 'src/components/millerhomes/HeaderSection';
import * as FooterSection from 'src/components/millerhomes/FooterSection';
import * as FloorplanSection from 'src/components/millerhomes/FloorplanSection';
import * as FilterSection from 'src/components/millerhomes/FilterSection';
import * as FeatureSection from 'src/components/millerhomes/FeatureSection';
import * as EmailSignupCard from 'src/components/millerhomes/EmailSignupCard';
import * as DevelopmentInfoSection from 'src/components/millerhomes/DevelopmentInfoSection';
import * as DevelopmentHeroSection from 'src/components/millerhomes/DevelopmentHeroSection';
import * as DevelopmentGridSection from 'src/components/millerhomes/DevelopmentGridSection';
import * as DevelopmentCard from 'src/components/millerhomes/DevelopmentCard';
import * as ContentCarouselSection from 'src/components/millerhomes/ContentCarouselSection';
import * as ContentCard from 'src/components/millerhomes/ContentCard';
import * as ContactSection from 'src/components/millerhomes/ContactSection';
import * as ChoiceCard from 'src/components/millerhomes/ChoiceCard';
import * as AvailableHomesSection from 'src/components/millerhomes/AvailableHomesSection';
import * as AnnouncementBannerSection from 'src/components/millerhomes/AnnouncementBannerSection';
import * as LinkList from 'src/components/link-list/LinkList';
import * as LanguageSwitcher from 'src/components/language-switcher/LanguageSwitcher';
import * as Image from 'src/components/image/Image';
import * as HeroBanner from 'src/components/hero-banner/HeroBanner';
import * as Header from 'src/components/header/Header';
import * as Footer from 'src/components/footer/Footer';
import * as Features from 'src/components/features/Features';
import * as ContentBlock from 'src/components/content-block/ContentBlock';
import * as Container from 'src/components/container/Container';
import * as ContactForm from 'src/components/contact-form/ContactForm';
import * as ColumnSplitter from 'src/components/column-splitter/ColumnSplitter';
import * as Breadcrumb from 'src/components/breadcrumb/Breadcrumb';
import * as ArticleListing from 'src/components/article-listing/ArticleListing';
import * as ArticleDetails from 'src/components/article-details/ArticleDetails';
import * as AllProductsCarousel from 'src/components/all-products-carousel/AllProductsCarousel';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['Title', { ...Title }],
  ['ThemeEditor', { ...ThemeEditor }],
  ['Subscribe', { ...Subscribe }],
  ['SocialFollow', { ...SocialFollow }],
  ['SocialFeed', { ...SocialFeed }],
  ['SelectedProducts', { ...SelectedProducts }],
  ['SelectedArticles', { ...SelectedArticles, componentType: 'client' }],
  ['SectionWrapper', { ...SectionWrapper }],
  ['SearchResults', { ...SearchResults }],
  ['RowSplitter', { ...RowSplitter }],
  ['RichText', { ...RichText }],
  ['Reviews', { ...Reviews }],
  ['Promo', { ...Promo }],
  ['ProductListing', { ...ProductListing }],
  ['ProductDetails', { ...ProductDetails }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['PageContent', { ...PageContent }],
  ['Offers', { ...Offers }],
  ['SuggestionBlock', { ...SuggestionBlock }],
  ['Spinner', { ...Spinner }],
  ['SortOrder', { ...SortOrder }],
  ['SearchResultsComponent', { ...SearchResultsComponent }],
  ['SearchPagination', { ...SearchPagination }],
  ['SearchFacets', { ...SearchFacets }],
  ['ResultsPerPage', { ...ResultsPerPage }],
  ['QuestionsAnswers', { ...QuestionsAnswers }],
  ['QueryResultsSummary', { ...QueryResultsSummary }],
  ['PreviewSearch', { ...PreviewSearch }],
  ['HomeHighlighted', { ...HomeHighlighted }],
  ['CardViewSwitcher', { ...CardViewSwitcher }],
  ['ArticleHorizontalCard', { ...ArticleHorizontalCard }],
  ['ArticleCard', { ...ArticleCard }],
  ['NavigationIcons', { ...NavigationIcons }],
  ['Navigation', { ...Navigation, componentType: 'client' }],
  ['VirtualTourBannerSection', { ...VirtualTourBannerSection, componentType: 'client' }],
  ['TestimonialsSection', { ...TestimonialsSection, componentType: 'client' }],
  ['StatsSection', { ...StatsSection }],
  ['StatCard', { ...StatCard }],
  ['SpecificationSection', { ...SpecificationSection, componentType: 'client' }],
  ['SiteplanSection', { ...SiteplanSection, componentType: 'client' }],
  ['SearchSection', { ...SearchSection, componentType: 'client' }],
  ['SearchAgainSection', { ...SearchAgainSection, componentType: 'client' }],
  ['PopupSection', { ...PopupSection, componentType: 'client' }],
  ['PlotCard', { ...PlotCard, componentType: 'client' }],
  ['PlotAvailabilitySection', { ...PlotAvailabilitySection, componentType: 'client' }],
  ['PersonaliseSection', { ...PersonaliseSection, componentType: 'client' }],
  ['PageTitleSection', { ...PageTitleSection, componentType: 'client' }],
  ['NearbyDevelopmentsSection', { ...NearbyDevelopmentsSection, componentType: 'client' }],
  ['NearbyDevelopmentCard', { ...NearbyDevelopmentCard, componentType: 'client' }],
  ['MyMillerHomeSection', { ...MyMillerHomeSection, componentType: 'client' }],
  ['MortgageCalculatorSection', { ...MortgageCalculatorSection, componentType: 'client' }],
  ['LocalAmenitiesSection', { ...LocalAmenitiesSection, componentType: 'client' }],
  ['InspirationSection', { ...InspirationSection }],
  ['ImageCarouselSection', { ...ImageCarouselSection, componentType: 'client' }],
  ['HouseTypesSection', { ...HouseTypesSection, componentType: 'client' }],
  ['HouseTypeInfoSection', { ...HouseTypeInfoSection, componentType: 'client' }],
  ['HouseTypeHeroSection', { ...HouseTypeHeroSection, componentType: 'client' }],
  ['HouseTypeCard', { ...HouseTypeCard, componentType: 'client' }],
  ['HeroCarouselSection', { ...HeroCarouselSection, componentType: 'client' }],
  ['HeaderSection', { ...HeaderSection, componentType: 'client' }],
  ['FooterSection', { ...FooterSection }],
  ['FloorplanSection', { ...FloorplanSection, componentType: 'client' }],
  ['FilterSection', { ...FilterSection, componentType: 'client' }],
  ['FeatureSection', { ...FeatureSection }],
  ['EmailSignupCard', { ...EmailSignupCard, componentType: 'client' }],
  ['DevelopmentInfoSection', { ...DevelopmentInfoSection, componentType: 'client' }],
  ['DevelopmentHeroSection', { ...DevelopmentHeroSection, componentType: 'client' }],
  ['DevelopmentGridSection', { ...DevelopmentGridSection, componentType: 'client' }],
  ['DevelopmentCard', { ...DevelopmentCard, componentType: 'client' }],
  ['ContentCarouselSection', { ...ContentCarouselSection, componentType: 'client' }],
  ['ContentCard', { ...ContentCard }],
  ['ContactSection', { ...ContactSection, componentType: 'client' }],
  ['ChoiceCard', { ...ChoiceCard }],
  ['AvailableHomesSection', { ...AvailableHomesSection, componentType: 'client' }],
  ['AnnouncementBannerSection', { ...AnnouncementBannerSection, componentType: 'client' }],
  ['LinkList', { ...LinkList }],
  ['LanguageSwitcher', { ...LanguageSwitcher, componentType: 'client' }],
  ['Image', { ...Image }],
  ['HeroBanner', { ...HeroBanner }],
  ['Header', { ...Header }],
  ['Footer', { ...Footer }],
  ['Features', { ...Features }],
  ['ContentBlock', { ...ContentBlock }],
  ['Container', { ...Container }],
  ['ContactForm', { ...ContactForm, componentType: 'client' }],
  ['ColumnSplitter', { ...ColumnSplitter }],
  ['Breadcrumb', { ...Breadcrumb }],
  ['ArticleListing', { ...ArticleListing }],
  ['ArticleDetails', { ...ArticleDetails }],
  ['AllProductsCarousel', { ...AllProductsCarousel }],
]);

export default componentMap;
