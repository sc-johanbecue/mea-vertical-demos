// Below are built-in components that are available in the app, it's recommended to keep them as is

import { BYOCWrapper, NextjsContentSdkComponent, FEaaSWrapper } from '@sitecore-content-sdk/nextjs';
import { Form } from '@sitecore-content-sdk/nextjs';

// end of built-in components
import * as PartialDesignDynamicPlaceholder from 'src/components/partial-design-dynamic-placeholder/PartialDesignDynamicPlaceholder';
import * as Image from 'src/components/image/Image';
import * as WhyPremiumSection from 'src/components/banking/WhyPremiumSection';
import * as ValueStatItem from 'src/components/banking/ValueStatItem';
import * as SavingsGoalCard from 'src/components/banking/SavingsGoalCard';
import * as RelationshipTierGrid from 'src/components/banking/RelationshipTierGrid';
import * as RelationshipTierCard from 'src/components/banking/RelationshipTierCard';
import * as RecommendationCardGrid from 'src/components/banking/RecommendationCardGrid';
import * as RecommendationCard from 'src/components/banking/RecommendationCard';
import * as RecentActivitySection from 'src/components/banking/RecentActivitySection';
import * as QuickActionsGrid from 'src/components/banking/QuickActionsGrid';
import * as QuickActionItem from 'src/components/banking/QuickActionItem';
import * as ProofStrip from 'src/components/banking/ProofStrip';
import * as ProofItem from 'src/components/banking/ProofItem';
import * as ProductValueHighlight from 'src/components/banking/ProductValueHighlight';
import * as ProductSolutionPanel from 'src/components/banking/ProductSolutionPanel';
import * as ProductSolutionExplorer from 'src/components/banking/ProductSolutionExplorer';
import * as ProductCardHero from 'src/components/banking/ProductCardHero';
import * as PremiumValueSection from 'src/components/banking/PremiumValueSection';
import * as PremiumHeroBanner from 'src/components/banking/PremiumHeroBanner';
import * as NextBestActionItem from 'src/components/banking/NextBestActionItem';
import * as NextBestActionCard from 'src/components/banking/NextBestActionCard';
import * as NavItem from 'src/components/banking/NavItem';
import * as InsightTopicItem from 'src/components/banking/InsightTopicItem';
import * as InsightsGuidanceSection from 'src/components/banking/InsightsGuidanceSection';
import * as InsightArticleCard from 'src/components/banking/InsightArticleCard';
import * as HeroBenefitItem from 'src/components/banking/HeroBenefitItem';
import * as Header from 'src/components/banking/Header';
import * as GoalPlannerSection from 'src/components/banking/GoalPlannerSection';
import * as FooterLinkItem from 'src/components/banking/FooterLinkItem';
import * as Footer from 'src/components/banking/Footer';
import * as FeatureIconRow from 'src/components/banking/FeatureIconRow';
import * as FeatureIconItem from 'src/components/banking/FeatureIconItem';
import * as FaqItem from 'src/components/banking/FaqItem';
import * as DigitalFeatureItem from 'src/components/banking/DigitalFeatureItem';
import * as DigitalFeatureBlock from 'src/components/banking/DigitalFeatureBlock';
import * as ConfidenceCtaBar from 'src/components/banking/ConfidenceCtaBar';
import * as ChatAssistantButton from 'src/components/banking/ChatAssistantButton';
import * as BenefitStrip from 'src/components/banking/BenefitStrip';
import * as BankingOverviewHeader from 'src/components/banking/BankingOverviewHeader';
import * as ActivityItem from 'src/components/banking/ActivityItem';
import * as AccountSummaryCard from 'src/components/banking/AccountSummaryCard';

export const componentMap = new Map<string, NextjsContentSdkComponent>([
  ['BYOCWrapper', BYOCWrapper],
  ['FEaaSWrapper', FEaaSWrapper],
  ['Form', Form],
  ['PartialDesignDynamicPlaceholder', { ...PartialDesignDynamicPlaceholder }],
  ['Image', { ...Image }],
  ['WhyPremiumSection', { ...WhyPremiumSection, componentType: 'client' }],
  ['ValueStatItem', { ...ValueStatItem, componentType: 'client' }],
  ['SavingsGoalCard', { ...SavingsGoalCard, componentType: 'client' }],
  ['RelationshipTierGrid', { ...RelationshipTierGrid, componentType: 'client' }],
  ['RelationshipTierCard', { ...RelationshipTierCard, componentType: 'client' }],
  ['RecommendationCardGrid', { ...RecommendationCardGrid, componentType: 'client' }],
  ['RecommendationCard', { ...RecommendationCard, componentType: 'client' }],
  ['RecentActivitySection', { ...RecentActivitySection, componentType: 'client' }],
  ['QuickActionsGrid', { ...QuickActionsGrid, componentType: 'client' }],
  ['QuickActionItem', { ...QuickActionItem, componentType: 'client' }],
  ['ProofStrip', { ...ProofStrip, componentType: 'client' }],
  ['ProofItem', { ...ProofItem, componentType: 'client' }],
  ['ProductValueHighlight', { ...ProductValueHighlight, componentType: 'client' }],
  ['ProductSolutionPanel', { ...ProductSolutionPanel, componentType: 'client' }],
  ['ProductSolutionExplorer', { ...ProductSolutionExplorer, componentType: 'client' }],
  ['ProductCardHero', { ...ProductCardHero, componentType: 'client' }],
  ['PremiumValueSection', { ...PremiumValueSection, componentType: 'client' }],
  ['PremiumHeroBanner', { ...PremiumHeroBanner, componentType: 'client' }],
  ['NextBestActionItem', { ...NextBestActionItem, componentType: 'client' }],
  ['NextBestActionCard', { ...NextBestActionCard, componentType: 'client' }],
  ['NavItem', { ...NavItem, componentType: 'client' }],
  ['InsightTopicItem', { ...InsightTopicItem, componentType: 'client' }],
  ['InsightsGuidanceSection', { ...InsightsGuidanceSection, componentType: 'client' }],
  ['InsightArticleCard', { ...InsightArticleCard, componentType: 'client' }],
  ['HeroBenefitItem', { ...HeroBenefitItem, componentType: 'client' }],
  ['Header', { ...Header, componentType: 'client' }],
  ['GoalPlannerSection', { ...GoalPlannerSection, componentType: 'client' }],
  ['FooterLinkItem', { ...FooterLinkItem, componentType: 'client' }],
  ['Footer', { ...Footer, componentType: 'client' }],
  ['FeatureIconRow', { ...FeatureIconRow, componentType: 'client' }],
  ['FeatureIconItem', { ...FeatureIconItem, componentType: 'client' }],
  ['FaqItem', { ...FaqItem, componentType: 'client' }],
  ['DigitalFeatureItem', { ...DigitalFeatureItem, componentType: 'client' }],
  ['DigitalFeatureBlock', { ...DigitalFeatureBlock, componentType: 'client' }],
  ['ConfidenceCtaBar', { ...ConfidenceCtaBar, componentType: 'client' }],
  ['ChatAssistantButton', { ...ChatAssistantButton, componentType: 'client' }],
  ['BenefitStrip', { ...BenefitStrip, componentType: 'client' }],
  ['BankingOverviewHeader', { ...BankingOverviewHeader, componentType: 'client' }],
  ['ActivityItem', { ...ActivityItem, componentType: 'client' }],
  ['AccountSummaryCard', { ...AccountSummaryCard, componentType: 'client' }],
]);

export default componentMap;
