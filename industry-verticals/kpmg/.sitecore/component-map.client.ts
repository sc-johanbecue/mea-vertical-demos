// Client-safe component map for App Router

import { BYOCClientWrapper, NextjsContentSdkComponent, FEaaSClientWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

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
import * as kpmgbeyondtoppickscontext from 'src/components/kpmg/kpmg-beyond-top-picks-context';
import * as kpmgbeyondsolutionroutefields from 'src/components/kpmg/kpmg-beyond-solution-route-fields';
import * as kpmgbeyondprofilenav from 'src/components/kpmg/kpmg-beyond-profile-nav';
import * as kpmgbeyondeventsubscription from 'src/components/kpmg/kpmg-beyond-event-subscription';
import * as kpmgbeyondeventroutefields from 'src/components/kpmg/kpmg-beyond-event-route-fields';
import * as kpmgbeyondcommunityroutefields from 'src/components/kpmg/kpmg-beyond-community-route-fields';
import * as kpmgbeyondcommunitymembership from 'src/components/kpmg/kpmg-beyond-community-membership';
import * as kpmgbeyondarticleroutefields from 'src/components/kpmg/kpmg-beyond-article-route-fields';
import * as CdpSubscribeButton from 'src/components/cdp-profile-panel/CdpSubscribeButton';
import * as CdpProfileShellLoader from 'src/components/cdp-profile-panel/CdpProfileShellLoader';
import * as CdpProfileShell from 'src/components/cdp-profile-panel/CdpProfileShell';
import * as CdpProfilePanel from 'src/components/cdp-profile-panel/CdpProfilePanel';
import * as CdpPageViewTracker from 'src/components/cdp-profile-panel/CdpPageViewTracker';
import * as CdpAuth0IdentityTracker from 'src/components/cdp-profile-panel/CdpAuth0IdentityTracker';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCClientWrapper],
  ['FEaaSWrapper', FEaaSClientWrapper],
  ['Form', Form],
  ['KpmgBeyondYourCommunitiesSection', { ...KpmgBeyondYourCommunitiesSection }],
  ['KpmgBeyondUpcomingEventsSection', { ...KpmgBeyondUpcomingEventsSection }],
  ['KpmgBeyondUpcomingAndOnDemandSection', { ...KpmgBeyondUpcomingAndOnDemandSection }],
  ['KpmgBeyondTopPicksSection', { ...KpmgBeyondTopPicksSection }],
  ['KpmgBeyondSolutionTitle', { ...KpmgBeyondSolutionTitle }],
  ['KpmgBeyondSolutionsSection', { ...KpmgBeyondSolutionsSection }],
  ['KpmgBeyondSolutionRichText', { ...KpmgBeyondSolutionRichText }],
  ['KpmgBeyondSolutionCta', { ...KpmgBeyondSolutionCta }],
  ['KpmgBeyondSolutionCardTile', { ...KpmgBeyondSolutionCardTile }],
  ['KpmgBeyondSolutionBreadcrumb', { ...KpmgBeyondSolutionBreadcrumb }],
  ['KpmgBeyondSolutionBookCallSection', { ...KpmgBeyondSolutionBookCallSection }],
  ['KpmgBeyondSolutionBanner', { ...KpmgBeyondSolutionBanner }],
  ['KpmgBeyondRegister', { ...KpmgBeyondRegister }],
  ['KpmgBeyondProfileUi', { ...KpmgBeyondProfileUi }],
  ['KpmgBeyondProfileSection', { ...KpmgBeyondProfileSection }],
  ['KpmgBeyondProfileMenu', { ...KpmgBeyondProfileMenu }],
  ['KpmgBeyondNavLink', { ...KpmgBeyondNavLink }],
  ['KpmgBeyondMyEventsSection', { ...KpmgBeyondMyEventsSection }],
  ['KpmgBeyondMainWrapper', { ...KpmgBeyondMainWrapper }],
  ['KpmgBeyondHeroBanner', { ...KpmgBeyondHeroBanner }],
  ['KpmgBeyondGenericTestimonials', { ...KpmgBeyondGenericTestimonials }],
  ['KpmgBeyondGenericHero', { ...KpmgBeyondGenericHero }],
  ['KpmgBeyondGenericHeader', { ...KpmgBeyondGenericHeader }],
  ['KpmgBeyondGenericFooterCta', { ...KpmgBeyondGenericFooterCta }],
  ['KpmgBeyondGenericFooter', { ...KpmgBeyondGenericFooter }],
  ['KpmgBeyondGenericFeatureSection', { ...KpmgBeyondGenericFeatureSection }],
  ['KpmgBeyondGenericCta', { ...KpmgBeyondGenericCta }],
  ['KpmgBeyondEventTitle', { ...KpmgBeyondEventTitle }],
  ['KpmgBeyondEventSpeakersSection', { ...KpmgBeyondEventSpeakersSection }],
  ['KpmgBeyondEventRichText', { ...KpmgBeyondEventRichText }],
  ['KpmgBeyondEventRelatedSection', { ...KpmgBeyondEventRelatedSection }],
  ['KpmgBeyondEventListingCardTile', { ...KpmgBeyondEventListingCardTile }],
  ['KpmgBeyondEventHero', { ...KpmgBeyondEventHero }],
  ['KpmgBeyondEventCard', { ...KpmgBeyondEventCard }],
  ['KpmgBeyondEventBreadcrumb', { ...KpmgBeyondEventBreadcrumb }],
  ['KpmgBeyondDiscussionDetailSection', { ...KpmgBeyondDiscussionDetailSection }],
  ['KpmgBeyondCuratedCollectionCard', { ...KpmgBeyondCuratedCollectionCard }],
  ['KpmgBeyondCommunityTile', { ...KpmgBeyondCommunityTile }],
  ['KpmgBeyondCommunityListingCardTile', { ...KpmgBeyondCommunityListingCardTile }],
  ['KpmgBeyondCommunityHostsSection', { ...KpmgBeyondCommunityHostsSection }],
  ['KpmgBeyondCommunityHeroSupport', { ...KpmgBeyondCommunityHeroSupport }],
  ['KpmgBeyondCommunityHeroAbout', { ...KpmgBeyondCommunityHeroAbout }],
  ['KpmgBeyondCommunityHero', { ...KpmgBeyondCommunityHero }],
  ['KpmgBeyondCommunityDiscussionsSection', { ...KpmgBeyondCommunityDiscussionsSection }],
  ['KpmgBeyondCommunityApplicationsAdmin', { ...KpmgBeyondCommunityApplicationsAdmin }],
  ['KpmgBeyondCommunitiesSection', { ...KpmgBeyondCommunitiesSection }],
  ['KpmgBeyondCommunitiesExploreSection', { ...KpmgBeyondCommunitiesExploreSection }],
  ['KpmgBeyondChrome', { ...KpmgBeyondChrome }],
  ['KpmgBeyondArticleTitle', { ...KpmgBeyondArticleTitle }],
  ['KpmgBeyondArticlesSection', { ...KpmgBeyondArticlesSection }],
  ['KpmgBeyondArticleRichText', { ...KpmgBeyondArticleRichText }],
  ['KpmgBeyondArticleRelatedContent', { ...KpmgBeyondArticleRelatedContent }],
  ['KpmgBeyondArticleListingCardTile', { ...KpmgBeyondArticleListingCardTile }],
  ['KpmgBeyondArticleLike', { ...KpmgBeyondArticleLike }],
  ['KpmgBeyondArticleCta', { ...KpmgBeyondArticleCta }],
  ['KpmgBeyondArticleCategory', { ...KpmgBeyondArticleCategory }],
  ['KpmgBeyondArticleCardTile', { ...KpmgBeyondArticleCardTile }],
  ['KpmgBeyondArticleCard', { ...KpmgBeyondArticleCard }],
  ['KpmgBeyondArticleBreadcrumb', { ...KpmgBeyondArticleBreadcrumb }],
  ['KpmgBeyondArticleBanner', { ...KpmgBeyondArticleBanner }],
  ['KpmgBeyondArticleAuthor', { ...KpmgBeyondArticleAuthor }],
  ['kpmg-editing-hydration', { ...kpmgeditinghydration }],
  ['kpmg-beyond-top-picks-context', { ...kpmgbeyondtoppickscontext }],
  ['kpmg-beyond-solution-route-fields', { ...kpmgbeyondsolutionroutefields }],
  ['kpmg-beyond-profile-nav', { ...kpmgbeyondprofilenav }],
  ['kpmg-beyond-event-subscription', { ...kpmgbeyondeventsubscription }],
  ['kpmg-beyond-event-route-fields', { ...kpmgbeyondeventroutefields }],
  ['kpmg-beyond-community-route-fields', { ...kpmgbeyondcommunityroutefields }],
  ['kpmg-beyond-community-membership', { ...kpmgbeyondcommunitymembership }],
  ['kpmg-beyond-article-route-fields', { ...kpmgbeyondarticleroutefields }],
  ['CdpSubscribeButton', { ...CdpSubscribeButton }],
  ['CdpProfileShellLoader', { ...CdpProfileShellLoader }],
  ['CdpProfileShell', { ...CdpProfileShell }],
  ['CdpProfilePanel', { ...CdpProfilePanel }],
  ['CdpPageViewTracker', { ...CdpPageViewTracker }],
  ['CdpAuth0IdentityTracker', { ...CdpAuth0IdentityTracker }],
]);

export default componentMap;
