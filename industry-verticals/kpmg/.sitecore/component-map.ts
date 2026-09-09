// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCServerWrapper, NextjsContentSdkComponent, FEaaSServerWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as KpmgBeyondYourCommunitiesSection from 'src/components/kpmg/KpmgBeyondYourCommunitiesSection';
import * as KpmgBeyondUpcomingEventsSection from 'src/components/kpmg/KpmgBeyondUpcomingEventsSection';
import * as KpmgBeyondUpcomingAndOnDemandSection from 'src/components/kpmg/KpmgBeyondUpcomingAndOnDemandSection';
import * as KpmgBeyondTopPicksSection from 'src/components/kpmg/KpmgBeyondTopPicksSection';
import * as KpmgBeyondSolutionTitle from 'src/components/kpmg/KpmgBeyondSolutionTitle';
import * as KpmgBeyondSolutionsSection from 'src/components/kpmg/KpmgBeyondSolutionsSection';
import * as KpmgBeyondSolutionRichText from 'src/components/kpmg/KpmgBeyondSolutionRichText';
import * as KpmgBeyondSolutionCta from 'src/components/kpmg/KpmgBeyondSolutionCta';
import * as KpmgBeyondSolutionCardTile from 'src/components/kpmg/KpmgBeyondSolutionCardTile';
import * as KpmgBeyondSolutionBreadcrumb from 'src/components/kpmg/KpmgBeyondSolutionBreadcrumb';
import * as KpmgBeyondSolutionBookCallSection from 'src/components/kpmg/KpmgBeyondSolutionBookCallSection';
import * as KpmgBeyondSolutionBanner from 'src/components/kpmg/KpmgBeyondSolutionBanner';
import * as KpmgBeyondRegister from 'src/components/kpmg/KpmgBeyondRegister';
import * as KpmgBeyondProfileUi from 'src/components/kpmg/KpmgBeyondProfileUi';
import * as KpmgBeyondProfileSection from 'src/components/kpmg/KpmgBeyondProfileSection';
import * as KpmgBeyondProfileMenu from 'src/components/kpmg/KpmgBeyondProfileMenu';
import * as KpmgBeyondNavLink from 'src/components/kpmg/KpmgBeyondNavLink';
import * as KpmgBeyondMyEventsSection from 'src/components/kpmg/KpmgBeyondMyEventsSection';
import * as KpmgBeyondMainWrapper from 'src/components/kpmg/KpmgBeyondMainWrapper';
import * as KpmgBeyondHeroBanner from 'src/components/kpmg/KpmgBeyondHeroBanner';
import * as KpmgBeyondGenericTestimonials from 'src/components/kpmg/KpmgBeyondGenericTestimonials';
import * as KpmgBeyondGenericHero from 'src/components/kpmg/KpmgBeyondGenericHero';
import * as KpmgBeyondGenericHeader from 'src/components/kpmg/KpmgBeyondGenericHeader';
import * as KpmgBeyondGenericFooterCta from 'src/components/kpmg/KpmgBeyondGenericFooterCta';
import * as KpmgBeyondGenericFooter from 'src/components/kpmg/KpmgBeyondGenericFooter';
import * as KpmgBeyondGenericFeatureSection from 'src/components/kpmg/KpmgBeyondGenericFeatureSection';
import * as KpmgBeyondGenericCta from 'src/components/kpmg/KpmgBeyondGenericCta';
import * as KpmgBeyondEventTitle from 'src/components/kpmg/KpmgBeyondEventTitle';
import * as KpmgBeyondEventSpeakersSection from 'src/components/kpmg/KpmgBeyondEventSpeakersSection';
import * as KpmgBeyondEventRichText from 'src/components/kpmg/KpmgBeyondEventRichText';
import * as KpmgBeyondEventRelatedSection from 'src/components/kpmg/KpmgBeyondEventRelatedSection';
import * as KpmgBeyondEventListingCardTile from 'src/components/kpmg/KpmgBeyondEventListingCardTile';
import * as KpmgBeyondEventHero from 'src/components/kpmg/KpmgBeyondEventHero';
import * as KpmgBeyondEventCard from 'src/components/kpmg/KpmgBeyondEventCard';
import * as KpmgBeyondEventBreadcrumb from 'src/components/kpmg/KpmgBeyondEventBreadcrumb';
import * as KpmgBeyondDiscussionDetailSection from 'src/components/kpmg/KpmgBeyondDiscussionDetailSection';
import * as KpmgBeyondCuratedCollectionsSection from 'src/components/kpmg/KpmgBeyondCuratedCollectionsSection';
import * as KpmgBeyondCuratedCollectionCard from 'src/components/kpmg/KpmgBeyondCuratedCollectionCard';
import * as KpmgBeyondCommunityTile from 'src/components/kpmg/KpmgBeyondCommunityTile';
import * as KpmgBeyondCommunityListingCardTile from 'src/components/kpmg/KpmgBeyondCommunityListingCardTile';
import * as KpmgBeyondCommunityHostsSection from 'src/components/kpmg/KpmgBeyondCommunityHostsSection';
import * as KpmgBeyondCommunityHeroSupport from 'src/components/kpmg/KpmgBeyondCommunityHeroSupport';
import * as KpmgBeyondCommunityHeroAbout from 'src/components/kpmg/KpmgBeyondCommunityHeroAbout';
import * as KpmgBeyondCommunityHero from 'src/components/kpmg/KpmgBeyondCommunityHero';
import * as KpmgBeyondCommunityDiscussionsSection from 'src/components/kpmg/KpmgBeyondCommunityDiscussionsSection';
import * as KpmgBeyondCommunityApplicationsAdmin from 'src/components/kpmg/KpmgBeyondCommunityApplicationsAdmin';
import * as KpmgBeyondCommunitiesSection from 'src/components/kpmg/KpmgBeyondCommunitiesSection';
import * as KpmgBeyondCommunitiesExploreSection from 'src/components/kpmg/KpmgBeyondCommunitiesExploreSection';
import * as KpmgBeyondChrome from 'src/components/kpmg/KpmgBeyondChrome';
import * as KpmgBeyondArticleTitle from 'src/components/kpmg/KpmgBeyondArticleTitle';
import * as KpmgBeyondArticlesSection from 'src/components/kpmg/KpmgBeyondArticlesSection';
import * as KpmgBeyondArticleRichText from 'src/components/kpmg/KpmgBeyondArticleRichText';
import * as KpmgBeyondArticleRelatedContent from 'src/components/kpmg/KpmgBeyondArticleRelatedContent';
import * as KpmgBeyondArticleListingCardTile from 'src/components/kpmg/KpmgBeyondArticleListingCardTile';
import * as KpmgBeyondArticleLike from 'src/components/kpmg/KpmgBeyondArticleLike';
import * as KpmgBeyondArticleCta from 'src/components/kpmg/KpmgBeyondArticleCta';
import * as KpmgBeyondArticleCategory from 'src/components/kpmg/KpmgBeyondArticleCategory';
import * as KpmgBeyondArticleCardTile from 'src/components/kpmg/KpmgBeyondArticleCardTile';
import * as KpmgBeyondArticleCard from 'src/components/kpmg/KpmgBeyondArticleCard';
import * as KpmgBeyondArticleBreadcrumb from 'src/components/kpmg/KpmgBeyondArticleBreadcrumb';
import * as KpmgBeyondArticleBanner from 'src/components/kpmg/KpmgBeyondArticleBanner';
import * as KpmgBeyondArticleAuthor from 'src/components/kpmg/KpmgBeyondArticleAuthor';
import * as kpmgeditinghydration from 'src/components/kpmg/kpmg-editing-hydration';
import * as kpmgbeyondtoppickssectionshared from 'src/components/kpmg/kpmg-beyond-top-picks-section-shared';
import * as kpmgbeyondtoppickscontext from 'src/components/kpmg/kpmg-beyond-top-picks-context';
import * as kpmgbeyondtokens from 'src/components/kpmg/kpmg-beyond-tokens';
import * as kpmgbeyondsolutionssectionshared from 'src/components/kpmg/kpmg-beyond-solutions-section-shared';
import * as kpmgbeyondsolutionroutefields from 'src/components/kpmg/kpmg-beyond-solution-route-fields';
import * as kpmgbeyondregisterfields from 'src/components/kpmg/kpmg-beyond-register-fields';
import * as kpmgbeyondprofileoptions from 'src/components/kpmg/kpmg-beyond-profile-options';
import * as kpmgbeyondprofilenav from 'src/components/kpmg/kpmg-beyond-profile-nav';
import * as kpmgbeyondprofilefields from 'src/components/kpmg/kpmg-beyond-profile-fields';
import * as kpmgbeyondicons from 'src/components/kpmg/kpmg-beyond-icons';
import * as kpmgbeyondgenericshared from 'src/components/kpmg/kpmg-beyond-generic-shared';
import * as kpmgbeyondeventssectionshared from 'src/components/kpmg/kpmg-beyond-events-section-shared';
import * as kpmgbeyondeventsubscription from 'src/components/kpmg/kpmg-beyond-event-subscription';
import * as kpmgbeyondeventroutefields from 'src/components/kpmg/kpmg-beyond-event-route-fields';
import * as kpmgbeyondcommunityroutefields from 'src/components/kpmg/kpmg-beyond-community-route-fields';
import * as kpmgbeyondcommunitymembership from 'src/components/kpmg/kpmg-beyond-community-membership';
import * as kpmgbeyondcommunitiesexploresectionshared from 'src/components/kpmg/kpmg-beyond-communities-explore-section-shared';
import * as kpmgbeyondarticlessectionshared from 'src/components/kpmg/kpmg-beyond-articles-section-shared';
import * as kpmgbeyondarticleroutefields from 'src/components/kpmg/kpmg-beyond-article-route-fields';
import * as CdpSubscribeButton from 'src/components/cdp-profile-panel/CdpSubscribeButton';
import * as CdpProfileShellLoader from 'src/components/cdp-profile-panel/CdpProfileShellLoader';
import * as CdpProfileShell from 'src/components/cdp-profile-panel/CdpProfileShell';
import * as CdpProfilePanel from 'src/components/cdp-profile-panel/CdpProfilePanel';
import * as CdpPageViewTracker from 'src/components/cdp-profile-panel/CdpPageViewTracker';
import * as CdpAuth0IdentityTracker from 'src/components/cdp-profile-panel/CdpAuth0IdentityTracker';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCServerWrapper],
  ['FEaaSWrapper', FEaaSServerWrapper],
  ['Form', { ...Form, componentType: 'client' }],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['KpmgBeyondYourCommunitiesSection', { ...KpmgBeyondYourCommunitiesSection, componentType: 'client' }],
  ['KpmgBeyondUpcomingEventsSection', { ...KpmgBeyondUpcomingEventsSection, componentType: 'client' }],
  ['KpmgBeyondUpcomingAndOnDemandSection', { ...KpmgBeyondUpcomingAndOnDemandSection, componentType: 'client' }],
  ['KpmgBeyondTopPicksSection', { ...KpmgBeyondTopPicksSection, componentType: 'client' }],
  ['KpmgBeyondSolutionTitle', { ...KpmgBeyondSolutionTitle, componentType: 'client' }],
  ['KpmgBeyondSolutionsSection', { ...KpmgBeyondSolutionsSection, componentType: 'client' }],
  ['KpmgBeyondSolutionRichText', { ...KpmgBeyondSolutionRichText, componentType: 'client' }],
  ['KpmgBeyondSolutionCta', { ...KpmgBeyondSolutionCta, componentType: 'client' }],
  ['KpmgBeyondSolutionCardTile', { ...KpmgBeyondSolutionCardTile, componentType: 'client' }],
  ['KpmgBeyondSolutionBreadcrumb', { ...KpmgBeyondSolutionBreadcrumb, componentType: 'client' }],
  ['KpmgBeyondSolutionBookCallSection', { ...KpmgBeyondSolutionBookCallSection, componentType: 'client' }],
  ['KpmgBeyondSolutionBanner', { ...KpmgBeyondSolutionBanner, componentType: 'client' }],
  ['KpmgBeyondRegister', { ...KpmgBeyondRegister, componentType: 'client' }],
  ['KpmgBeyondProfileUi', { ...KpmgBeyondProfileUi, componentType: 'client' }],
  ['KpmgBeyondProfileSection', { ...KpmgBeyondProfileSection, componentType: 'client' }],
  ['KpmgBeyondProfileMenu', { ...KpmgBeyondProfileMenu, componentType: 'client' }],
  ['KpmgBeyondNavLink', { ...KpmgBeyondNavLink, componentType: 'client' }],
  ['KpmgBeyondMyEventsSection', { ...KpmgBeyondMyEventsSection, componentType: 'client' }],
  ['KpmgBeyondMainWrapper', { ...KpmgBeyondMainWrapper, componentType: 'client' }],
  ['KpmgBeyondHeroBanner', { ...KpmgBeyondHeroBanner, componentType: 'client' }],
  ['KpmgBeyondGenericTestimonials', { ...KpmgBeyondGenericTestimonials, componentType: 'client' }],
  ['KpmgBeyondGenericHero', { ...KpmgBeyondGenericHero, componentType: 'client' }],
  ['KpmgBeyondGenericHeader', { ...KpmgBeyondGenericHeader, componentType: 'client' }],
  ['KpmgBeyondGenericFooterCta', { ...KpmgBeyondGenericFooterCta, componentType: 'client' }],
  ['KpmgBeyondGenericFooter', { ...KpmgBeyondGenericFooter, componentType: 'client' }],
  ['KpmgBeyondGenericFeatureSection', { ...KpmgBeyondGenericFeatureSection, componentType: 'client' }],
  ['KpmgBeyondGenericCta', { ...KpmgBeyondGenericCta, componentType: 'client' }],
  ['KpmgBeyondEventTitle', { ...KpmgBeyondEventTitle, componentType: 'client' }],
  ['KpmgBeyondEventSpeakersSection', { ...KpmgBeyondEventSpeakersSection, componentType: 'client' }],
  ['KpmgBeyondEventRichText', { ...KpmgBeyondEventRichText, componentType: 'client' }],
  ['KpmgBeyondEventRelatedSection', { ...KpmgBeyondEventRelatedSection, componentType: 'client' }],
  ['KpmgBeyondEventListingCardTile', { ...KpmgBeyondEventListingCardTile, componentType: 'client' }],
  ['KpmgBeyondEventHero', { ...KpmgBeyondEventHero, componentType: 'client' }],
  ['KpmgBeyondEventCard', { ...KpmgBeyondEventCard, componentType: 'client' }],
  ['KpmgBeyondEventBreadcrumb', { ...KpmgBeyondEventBreadcrumb, componentType: 'client' }],
  ['KpmgBeyondDiscussionDetailSection', { ...KpmgBeyondDiscussionDetailSection, componentType: 'client' }],
  ['KpmgBeyondCuratedCollectionsSection', { ...KpmgBeyondCuratedCollectionsSection }],
  ['KpmgBeyondCuratedCollectionCard', { ...KpmgBeyondCuratedCollectionCard, componentType: 'client' }],
  ['KpmgBeyondCommunityTile', { ...KpmgBeyondCommunityTile, componentType: 'client' }],
  ['KpmgBeyondCommunityListingCardTile', { ...KpmgBeyondCommunityListingCardTile, componentType: 'client' }],
  ['KpmgBeyondCommunityHostsSection', { ...KpmgBeyondCommunityHostsSection, componentType: 'client' }],
  ['KpmgBeyondCommunityHeroSupport', { ...KpmgBeyondCommunityHeroSupport, componentType: 'client' }],
  ['KpmgBeyondCommunityHeroAbout', { ...KpmgBeyondCommunityHeroAbout, componentType: 'client' }],
  ['KpmgBeyondCommunityHero', { ...KpmgBeyondCommunityHero, componentType: 'client' }],
  ['KpmgBeyondCommunityDiscussionsSection', { ...KpmgBeyondCommunityDiscussionsSection, componentType: 'client' }],
  ['KpmgBeyondCommunityApplicationsAdmin', { ...KpmgBeyondCommunityApplicationsAdmin, componentType: 'client' }],
  ['KpmgBeyondCommunitiesSection', { ...KpmgBeyondCommunitiesSection, componentType: 'client' }],
  ['KpmgBeyondCommunitiesExploreSection', { ...KpmgBeyondCommunitiesExploreSection, componentType: 'client' }],
  ['KpmgBeyondChrome', { ...KpmgBeyondChrome, componentType: 'client' }],
  ['KpmgBeyondArticleTitle', { ...KpmgBeyondArticleTitle, componentType: 'client' }],
  ['KpmgBeyondArticlesSection', { ...KpmgBeyondArticlesSection, componentType: 'client' }],
  ['KpmgBeyondArticleRichText', { ...KpmgBeyondArticleRichText, componentType: 'client' }],
  ['KpmgBeyondArticleRelatedContent', { ...KpmgBeyondArticleRelatedContent, componentType: 'client' }],
  ['KpmgBeyondArticleListingCardTile', { ...KpmgBeyondArticleListingCardTile, componentType: 'client' }],
  ['KpmgBeyondArticleLike', { ...KpmgBeyondArticleLike, componentType: 'client' }],
  ['KpmgBeyondArticleCta', { ...KpmgBeyondArticleCta, componentType: 'client' }],
  ['KpmgBeyondArticleCategory', { ...KpmgBeyondArticleCategory, componentType: 'client' }],
  ['KpmgBeyondArticleCardTile', { ...KpmgBeyondArticleCardTile, componentType: 'client' }],
  ['KpmgBeyondArticleCard', { ...KpmgBeyondArticleCard, componentType: 'client' }],
  ['KpmgBeyondArticleBreadcrumb', { ...KpmgBeyondArticleBreadcrumb, componentType: 'client' }],
  ['KpmgBeyondArticleBanner', { ...KpmgBeyondArticleBanner, componentType: 'client' }],
  ['KpmgBeyondArticleAuthor', { ...KpmgBeyondArticleAuthor, componentType: 'client' }],
  ['kpmg-editing-hydration', { ...kpmgeditinghydration, componentType: 'client' }],
  ['kpmg-beyond-top-picks-section-shared', { ...kpmgbeyondtoppickssectionshared }],
  ['kpmg-beyond-top-picks-context', { ...kpmgbeyondtoppickscontext, componentType: 'client' }],
  ['kpmg-beyond-tokens', { ...kpmgbeyondtokens }],
  ['kpmg-beyond-solutions-section-shared', { ...kpmgbeyondsolutionssectionshared }],
  ['kpmg-beyond-solution-route-fields', { ...kpmgbeyondsolutionroutefields, componentType: 'client' }],
  ['kpmg-beyond-register-fields', { ...kpmgbeyondregisterfields }],
  ['kpmg-beyond-profile-options', { ...kpmgbeyondprofileoptions }],
  ['kpmg-beyond-profile-nav', { ...kpmgbeyondprofilenav, componentType: 'client' }],
  ['kpmg-beyond-profile-fields', { ...kpmgbeyondprofilefields }],
  ['kpmg-beyond-icons', { ...kpmgbeyondicons }],
  ['kpmg-beyond-generic-shared', { ...kpmgbeyondgenericshared }],
  ['kpmg-beyond-events-section-shared', { ...kpmgbeyondeventssectionshared }],
  ['kpmg-beyond-event-subscription', { ...kpmgbeyondeventsubscription, componentType: 'client' }],
  ['kpmg-beyond-event-route-fields', { ...kpmgbeyondeventroutefields, componentType: 'client' }],
  ['kpmg-beyond-community-route-fields', { ...kpmgbeyondcommunityroutefields, componentType: 'client' }],
  ['kpmg-beyond-community-membership', { ...kpmgbeyondcommunitymembership, componentType: 'client' }],
  ['kpmg-beyond-communities-explore-section-shared', { ...kpmgbeyondcommunitiesexploresectionshared }],
  ['kpmg-beyond-articles-section-shared', { ...kpmgbeyondarticlessectionshared }],
  ['kpmg-beyond-article-route-fields', { ...kpmgbeyondarticleroutefields, componentType: 'client' }],
  ['CdpSubscribeButton', { ...CdpSubscribeButton, componentType: 'client' }],
  ['CdpProfileShellLoader', { ...CdpProfileShellLoader, componentType: 'client' }],
  ['CdpProfileShell', { ...CdpProfileShell, componentType: 'client' }],
  ['CdpProfilePanel', { ...CdpProfilePanel, componentType: 'client' }],
  ['CdpPageViewTracker', { ...CdpPageViewTracker, componentType: 'client' }],
  ['CdpAuth0IdentityTracker', { ...CdpAuth0IdentityTracker, componentType: 'client' }],
]);

export default componentMap;
