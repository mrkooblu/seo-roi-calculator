export interface CalculatorInputs {
  keywords: number;
  avgMonthlySV: number;
  clickThroughRate: number;
  conversionRate: number;
  avgOrderValue: number;
  seoInvestment: number;
  lifetimeValueMultiplier: number;
  profitMargin: number;
  timePeriod: number;
  advancedOptionsVisible: boolean;
}

export type SEOCampaignGoal = 'leads' | 'sales' | 'traffic' | 'brand';
export type CurrentRankings = 'new' | 'low' | 'medium' | 'high';
export type CompetitionLevel = 'low' | 'medium' | 'high';

export interface AdvancedCalculatorInputs {
  seoGoal: SEOCampaignGoal;
  currentRankings: CurrentRankings;
  competitionLevel: CompetitionLevel;
  contentInvestment: number;
  linkBuildingInvestment: number;
  technicalSEOInvestment: number;
  localSEOInvestment: number;
  toolsInvestment: number;
}

export type CalculatorTab = 'basic' | 'advanced';

export interface CalculatorState extends CalculatorInputs, AdvancedCalculatorInputs {
  activeTab: CalculatorTab;
  hasCalculated: boolean;
} 