import { CalculatorInputs, AdvancedCalculatorInputs } from '../types/calculator';
import { CalculationResults, ChartDataPoint, RecommendationItem } from '../types/results';

export const calculateROI = (inputs: CalculatorInputs): CalculationResults => {
  const {
    keywords,
    avgMonthlySV,
    clickThroughRate,
    conversionRate,
    avgOrderValue,
    seoInvestment,
    lifetimeValueMultiplier,
    profitMargin,
    timePeriod
  } = inputs;

  // Calculate results
  const monthlyTraffic = keywords * avgMonthlySV * (clickThroughRate / 100);
  const monthlyConversions = monthlyTraffic * (conversionRate / 100);
  const monthlyRevenue = monthlyConversions * avgOrderValue * lifetimeValueMultiplier;
  const monthlyProfit = monthlyRevenue * (profitMargin / 100);
  const monthlyROI = seoInvestment > 0 ? ((monthlyProfit - seoInvestment) / seoInvestment) * 100 : 0;
  const annualROI = seoInvestment > 0 ? ((monthlyProfit * timePeriod - seoInvestment * timePeriod) / (seoInvestment * timePeriod)) * 100 : 0;
  const dollarReturn = seoInvestment > 0 ? monthlyProfit / seoInvestment : 0;

  const annualRevenue = monthlyRevenue * timePeriod;
  const annualProfit = monthlyProfit * timePeriod;
  const annualInvestment = seoInvestment * timePeriod;
  const netProfit = annualProfit - annualInvestment;

  // Calculate break-even point (in months)
  const breakEvenPoint = monthlyProfit > 0 ? seoInvestment / monthlyProfit : Infinity;

  return {
    monthlyTraffic,
    monthlyConversions,
    monthlyRevenue,
    monthlyCost: seoInvestment,
    monthlyProfit,
    monthlyROI,
    annualROI,
    dollarReturn,
    breakEvenPoint,
    annualRevenue,
    annualProfit,
    annualInvestment,
    netProfit
  };
};

export const calculateAdvancedROI = (
  basicInputs: CalculatorInputs,
  advancedInputs: AdvancedCalculatorInputs
): CalculatorInputs => {
  const {
    seoGoal,
    currentRankings,
    competitionLevel,
    contentInvestment,
    linkBuildingInvestment,
    technicalSEOInvestment,
    localSEOInvestment,
    toolsInvestment
  } = advancedInputs;

  // Calculate total investment from the breakdown
  const totalInvestment = contentInvestment + linkBuildingInvestment + technicalSEOInvestment + localSEOInvestment + toolsInvestment;

  // Set default values based on selections
  let defaultKeywords = 10;
  const defaultSearchVolume = 500;
  let defaultCTR = 3.5;
  let defaultConversionRate = 2.5;

  // Adjust based on competition level
  if (competitionLevel === 'high') {
    defaultCTR -= 1;
    defaultKeywords -= 3;
  } else if (competitionLevel === 'low') {
    defaultCTR += 1;
    defaultKeywords += 5;
  }

  // Adjust based on current rankings
  if (currentRankings === 'new') {
    defaultKeywords = Math.max(5, defaultKeywords - 5);
  } else if (currentRankings === 'high') {
    defaultKeywords += 10;
    defaultCTR += 1;
  }

  // Adjust based on goal
  if (seoGoal === 'leads') {
    defaultConversionRate = 3.5;
  } else if (seoGoal === 'brand') {
    defaultConversionRate = 1.0;
  } else if (seoGoal === 'traffic') {
    defaultCTR += 2;
    defaultConversionRate = 1.5;
  }

  // Create a new inputs object with updated values
  return {
    ...basicInputs,
    keywords: basicInputs.keywords || defaultKeywords,
    avgMonthlySV: basicInputs.avgMonthlySV || defaultSearchVolume,
    clickThroughRate: defaultCTR,
    conversionRate: defaultConversionRate,
    seoInvestment: totalInvestment
  };
};

export const generateChartData = (
  timePeriod: number,
  monthlyCost: number,
  monthlyProfit: number
): ChartDataPoint[] => {
  const chartData: ChartDataPoint[] = [];

  let cumulativeInvestment = 0;
  let cumulativeProfit = 0;

  for (let i = 1; i <= timePeriod; i++) {
    cumulativeInvestment += monthlyCost;
    cumulativeProfit += monthlyProfit;

    const monthlyROI = cumulativeInvestment > 0 
      ? (cumulativeProfit - cumulativeInvestment) / cumulativeInvestment * 100 
      : 0;

    chartData.push({
      month: `Month ${i}`,
      cumulativeInvestment,
      cumulativeProfit,
      cumulativeROI: monthlyROI
    });
  }

  return chartData;
};

export const generateRecommendations = (
  monthlyROI: number,
  breakEvenPoint: number,
  conversionRate: number,
  ctr: number,
  keywords: number
): RecommendationItem[] => {
  const recommendations: RecommendationItem[] = [];

  // ROI-based recommendations
  if (monthlyROI < 0) {
    recommendations.push({
      title: 'Your current SEO ROI is negative.',
      description: 'Here are some ways to improve:',
      items: [
        'Focus on higher-converting keywords that align with your business goals',
        'Improve your website\'s conversion rate with better landing pages and user experience',
        'Reduce SEO costs by focusing on the most effective strategies',
        'Consider increasing your average order value through upselling or cross-selling'
      ]
    });
  } else if (monthlyROI < 50) {
    recommendations.push({
      title: 'Your SEO ROI is positive but could be improved.',
      description: 'Consider these strategies:',
      items: [
        'Target more high-intent keywords to attract users closer to making a purchase',
        'Optimize your highest-traffic pages for better conversion rates',
        'Implement A/B testing to identify what drives better results'
      ]
    });
  } else {
    recommendations.push({
      title: 'Your SEO ROI is strong!',
      description: 'To maintain and improve:',
      items: [
        'Continue expanding your keyword targeting to capture more market share',
        'Reinvest some of your profits into scaling successful SEO strategies',
        'Consider diversifying your traffic sources while maintaining your SEO advantage'
      ]
    });
  }

  // Break-even point recommendations
  if (isFinite(breakEvenPoint)) {
    if (breakEvenPoint > 12) {
      recommendations.push({
        title: 'Your break-even point is longer than 12 months.',
        description: 'To speed up your ROI:',
        items: [
          'Focus on quick-win keywords that can rank faster',
          'Optimize existing content that\'s already getting some traffic',
          'Consider adjusting your SEO budget allocation for better efficiency'
        ]
      });
    } else if (breakEvenPoint > 6) {
      recommendations.push({
        title: 'Your break-even point is between 6-12 months,',
        description: 'which is typical for SEO campaigns. Keep optimizing to improve this timeline.',
        items: []
      });
    } else {
      recommendations.push({
        title: 'Your break-even point is less than 6 months,',
        description: 'which is excellent for an SEO campaign!',
        items: []
      });
    }
  }

  // Conversion rate recommendations
  if (conversionRate < 1) {
    recommendations.push({
      title: 'Your conversion rate is below average.',
      description: 'Focus on conversion rate optimization (CRO):',
      items: [
        'Improve your call-to-action buttons and placement',
        'Streamline your checkout or lead capture process',
        'Add social proof and testimonials to build trust',
        'Ensure your site is mobile-friendly and loads quickly'
      ]
    });
  }

  // CTR recommendations
  if (ctr < 2) {
    recommendations.push({
      title: 'Your click-through rate is low.',
      description: 'To improve:',
      items: [
        'Optimize your meta titles and descriptions to be more compelling',
        'Use schema markup to enhance your search results appearance',
        'Target featured snippets to increase visibility',
        'Improve your brand recognition to encourage more clicks'
      ]
    });
  }

  // Keyword recommendations
  if (keywords < 5) {
    recommendations.push({
      title: 'You\'re targeting relatively few keywords.',
      description: 'Consider:',
      items: [
        'Expanding your content strategy to cover more relevant topics',
        'Creating topic clusters around your main keywords',
        'Targeting long-tail variations of your primary keywords'
      ]
    });
  }

  return recommendations;
}; 