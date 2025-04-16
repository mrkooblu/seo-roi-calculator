import { CalculatorInputs, AdvancedCalculatorInputs, CompetitionLevel } from '../types/calculator';
import { CalculationResults, ChartDataPoint, RecommendationItem } from '../types/results';
import { CalculatorState } from '../types';

// Define a type for extended inputs that might be cast from basic inputs
type ExtendedInputsProps = {
  competitionLevel?: CompetitionLevel;
  seoGoal?: 'leads' | 'brand' | 'traffic' | 'sales';
  contentInvestment?: number;
  linkBuildingInvestment?: number;
};

/**
 * Calculate Return on Investment (ROI) for SEO efforts using enhanced calculation models
 * Updated with S-curve growth modeling, discounted cash flow, and conversion rate maturation
 */
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
    timePeriod,
    advancedOptionsVisible
  } = inputs;

  // S-curve traffic growth modeling instead of linear growth
  // Calculate base traffic with ranking position factor
  const baseMonthlyTraffic = keywords * avgMonthlySV * (clickThroughRate / 100);
  
  // Calculate traffic with diminishing returns on investment
  // Uses logarithmic growth: TrafficGain = a * ln(investment + 1) * keywordFactor
  const investmentFactor = Math.log(seoInvestment + 1) * 0.1;
  const keywordFactor = Math.min(keywords / 10, 5); // Cap influence at 5x
  const trafficMultiplier = 1 + (investmentFactor * keywordFactor);
  const monthlyTraffic = baseMonthlyTraffic * trafficMultiplier;

  // Time-based conversion rate maturation
  // CR(t) = BaselineCR * (1 + maturationFactor * (1 - e^-t/τ))
  const maturationFactor = 0.2; // 20% increase at full maturity
  const timeConstant = 3; // Time constant in months
  const maturedConversionRate = conversionRate * (1 + maturationFactor * (1 - Math.exp(-timePeriod / timeConstant)));
  
  // Adjust for keyword difficulty based on formula
  // Use a default medium competition level if not specified
  const extendedInputs = inputs as CalculatorInputs & ExtendedInputsProps;
  const competitionLevel: CompetitionLevel = extendedInputs.competitionLevel || 'medium';
  const assumedKeywordDifficulty = competitionLevel === 'high' ? 70 : 
                                   competitionLevel === 'medium' ? 50 : 30;
  const keywordDifficultyAdjustment = 1 - (Math.pow(assumedKeywordDifficulty, 2) / 10000);
  
  // Calculate monthly metrics with enhanced models
  const adjustedTraffic = monthlyTraffic * keywordDifficultyAdjustment;
  const monthlyConversions = adjustedTraffic * (maturedConversionRate / 100);
  
  // Implement industry-specific calculations based on inputs
  let industryValueMultiplier = 1;
  
  // Access optional advanced properties safely
  if (extendedInputs.seoGoal === 'leads') {
    // B2B sales cycle adjustment - delay factor
    const leadTime = 3; // Average months to convert lead
    industryValueMultiplier = timePeriod > leadTime ? (timePeriod - leadTime) / timePeriod : 0.5;
  } else if (advancedOptionsVisible && 
            extendedInputs.contentInvestment && 
            extendedInputs.linkBuildingInvestment &&
            extendedInputs.contentInvestment > extendedInputs.linkBuildingInvestment) {
    // Content-heavy strategy typically increases LTV
    industryValueMultiplier = 1.15;
  }
  
  // Calculate revenue incorporating lifetime value
  const monthlyRevenue = monthlyConversions * avgOrderValue * lifetimeValueMultiplier * industryValueMultiplier;
  const monthlyProfit = monthlyRevenue * (profitMargin / 100);
  
  // Implement discounted cash flow for more accurate ROI
  // NPV = Σ[(Revenue - Cost)t / (1 + r)^t]
  const discountRate = 0.06 / 12; // Monthly discount rate (6% annual)
  let discountedProfit = 0;
  let discountedCost = 0;
  
  for (let t = 1; t <= timePeriod; t++) {
    // Apply ramp-up period logic for more realistic growth
    // EffectiveValue(t) = ProjectedValue * (1 - e^(-t/rampUpPeriod))
    const rampUpPeriod = 3; // Months to reach significant results
    const rampUpFactor = 1 - Math.exp(-t / rampUpPeriod);
    
    // Apply S-curve growth model
    // Traffic(t) = MaxTraffic / (1 + e^-k(t-t0))
    const growthRate = 0.3; // Growth rate parameter
    const midpoint = timePeriod / 2; // Midpoint of growth curve
    const sCurveFactor = 1 / (1 + Math.exp(-growthRate * (t - midpoint)));
    
    // Monthly profit applying growth factors
    const monthProfitAtTimeT = monthlyProfit * rampUpFactor * sCurveFactor;
    
    // Apply discounting
    discountedProfit += monthProfitAtTimeT / Math.pow(1 + discountRate, t);
    discountedCost += seoInvestment / Math.pow(1 + discountRate, t);
  }
  
  // Calculate ROI metrics using discounted values
  const discountedNetProfit = discountedProfit - discountedCost;
  const monthlyROI = discountedCost > 0 ? (discountedNetProfit / discountedCost) * 100 : 0;
  
  // Apply opportunity cost factor
  const assumedAlternativeReturn = 5; // 5% annual return on alternative investment
  const adjustedROI = monthlyROI - (assumedAlternativeReturn / 12);
  
  // Calculate annual metrics considering compounding effects
  const retentionFactor = 0.9; // 90% retention of results month-to-month
  const compoundedAnnualProfit = monthlyProfit * 
    (Math.pow(1 + 0.02, timePeriod) - 1) / 0.02 * retentionFactor;
  
  const annualROI = discountedCost > 0 ? 
    ((compoundedAnnualProfit - discountedCost) / discountedCost) * 100 : 0;
  
  const dollarReturn = discountedCost > 0 ? compoundedAnnualProfit / discountedCost : 0;
  
  // Time-to-value model with breakeven probability function
  // BreakevenProbability(t) = 1 - e^(-λt)
  const lambda = 0.1; // Rate parameter
  let breakEvenPoint = Infinity;
  
  // Find the month where cumulative profit exceeds investment
  let cumulativeProfit = 0;
  for (let t = 1; t <= 36; t++) { // Check up to 36 months
    // Apply ramp-up factor
    const rampUpFactor = 1 - Math.exp(-t / 3);
    cumulativeProfit += monthlyProfit * rampUpFactor;
    
    if (cumulativeProfit >= seoInvestment && breakEvenPoint === Infinity) {
      breakEvenPoint = t;
      break;
    }
  }
  
  // Calculate expected breakeven with probability adjustment
  const breakEvenProbability = 1 - Math.exp(-lambda * breakEvenPoint);
  const adjustedBreakEven = breakEvenPoint / breakEvenProbability;
  
  // Final calculations
  const annualRevenue = monthlyRevenue * timePeriod;
  const annualProfit = compoundedAnnualProfit;
  const annualInvestment = seoInvestment * timePeriod;
  const netProfit = annualProfit - annualInvestment;

  return {
    monthlyTraffic: adjustedTraffic,
    monthlyConversions,
    monthlyRevenue,
    monthlyCost: seoInvestment,
    monthlyProfit,
    monthlyROI: adjustedROI, // Adjusted ROI with opportunity cost
    annualROI,
    dollarReturn,
    breakEvenPoint: Math.round(adjustedBreakEven * 10) / 10, // Round to 1 decimal
    annualRevenue,
    annualProfit,
    annualInvestment,
    netProfit
  };
};

/**
 * Calculates advanced ROI based on industry-specific factors and competition levels
 * Enhanced with more sophisticated adjustments for various industry types
 */
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
  let defaultSearchVolume = 500;
  let defaultCTR = 27.6; // Updated to reflect position #1 CTR
  let defaultConversionRate = 2.5;

  // Enhanced competition level adjustments
  if (competitionLevel === 'high') {
    defaultCTR = Math.max(defaultCTR * 0.7, 15); // Position #2 CTR for high competition
    defaultKeywords = Math.max(defaultKeywords - 3, 3);
  } else if (competitionLevel === 'low') {
    defaultCTR = Math.min(defaultCTR * 1.1, 30); // Slightly better than position #1 for low competition
    defaultKeywords = defaultKeywords * 1.5; // 50% more keywords in low competition
  }

  // More sophisticated ranking adjustments
  if (currentRankings === 'new') {
    defaultKeywords = Math.max(5, defaultKeywords - 5);
    defaultCTR = 2.5; // Position #10 CTR for new sites
  } else if (currentRankings === 'high') {
    defaultKeywords = defaultKeywords * 2; // Double keywords for high-ranking sites
    defaultCTR = 27.6; // Position #1 CTR for high-ranking sites
  }

  // Enhanced goal-based adjustments
  let ltv = basicInputs.lifetimeValueMultiplier || 1;
  if (seoGoal === 'leads') {
    defaultConversionRate = 3.5;
    ltv = 1.5; // Higher LTV for lead generation
  } else if (seoGoal === 'brand') {
    defaultConversionRate = 1.0;
    ltv = 2.0; // Brand awareness leads to higher LTV
  } else if (seoGoal === 'traffic') {
    defaultCTR = Math.min(defaultCTR + 5, 33); // Boost CTR for traffic-focused goals
    defaultConversionRate = 1.5;
  }

  // Apply industry-specific adjustments
  let profitMargin = basicInputs.profitMargin || 50;
  const averageOrderValue = basicInputs.avgOrderValue || 0;
  
  // B2B sales cycle adjustments
  if (seoGoal === 'leads' && averageOrderValue > 500) {
    // Higher AOV indicates B2B, which typically has higher margins
    profitMargin = Math.min(profitMargin * 1.2, 80);
  }
  
  // E-commerce formula refinements
  if (seoGoal === 'sales' && contentInvestment > linkBuildingInvestment) {
    // Content-focused e-commerce tends to have better retention
    const assumedRepeatPurchaseRate = 0.3;
    const assumedRetentionRate = 0.7;
    ltv = 1 + (assumedRepeatPurchaseRate / (1 - assumedRetentionRate));
  }
  
  // Local business radius calculation for local SEO
  if (localSEOInvestment > 0) {
    // Adjust keywords based on local focus
    const localSearchMultiplier = 0.8; // Local searches are typically less volume but higher intent
    defaultSearchVolume = defaultSearchVolume * localSearchMultiplier;
    defaultConversionRate = defaultConversionRate * 1.3; // Local intent typically converts better
  }

  // Create a new inputs object with updated values and advanced improvements
  const result: CalculatorInputs = {
    ...basicInputs,
    keywords: basicInputs.keywords || defaultKeywords,
    avgMonthlySV: basicInputs.avgMonthlySV || defaultSearchVolume,
    clickThroughRate: defaultCTR,
    conversionRate: defaultConversionRate,
    lifetimeValueMultiplier: ltv,
    profitMargin: profitMargin,
    seoInvestment: totalInvestment
  };
  
  // Add competition level safely with proper type assertion
  return {
    ...result,
    competitionLevel
  } as CalculatorInputs;
};

/**
 * Generate chart data points for visualization based on calculator inputs
 */
export interface VisualizationChartDataPoint {
  month: number;
  monthlyTraffic: number;
  monthlyAdditionalTraffic: number;
  monthlyCost: number;
  monthlyAdditionalRevenue: number;
  cumulativeCost: number;
  cumulativeAdditionalRevenue: number;
  cumulativeROI: number;
}

/**
 * Generates chart data for visualization based on calculator inputs
 */
export function generateChartData(state: {
  currentTraffic: number;
  targetTraffic: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlyCost: number;
  projectLength: number;
  domainAuthority: number;
  competitionLevel: CompetitionLevel;
  industryType: string;
}): VisualizationChartDataPoint[] {
  const {
    currentTraffic,
    targetTraffic,
    conversionRate,
    averageOrderValue,
    monthlyCost,
    projectLength,
    domainAuthority,
    competitionLevel,
    industryType
  } = state;
  
  // Calculate growth rate factors based on competition and domain metrics
  let growthFactor = 0.2; // Default growth rate
  
  // Adjust growth factor based on domain authority
  if (domainAuthority < 20) {
    growthFactor *= 0.8;
  } else if (domainAuthority > 50) {
    growthFactor *= 1.3;
  }
  
  // Adjust growth factor based on competition level
  if (competitionLevel === 'low') {
    growthFactor *= 1.3;
  } else if (competitionLevel === 'high') {
    growthFactor *= 0.7;
  }
  
  // Adjust growth factor based on industry type
  if (industryType === 'e-commerce' || industryType === 'saas') {
    growthFactor *= 1.1;
  } else if (industryType === 'local') {
    growthFactor *= 1.2;
  }
  
  // Calculate traffic projections
  const trafficDifference = targetTraffic - currentTraffic;
  const data: VisualizationChartDataPoint[] = [];
  
  let cumulativeCost = 0;
  let cumulativeAdditionalRevenue = 0;
  
  // Add month 0 (starting point)
  data.push({
    month: 0,
    monthlyTraffic: currentTraffic,
    monthlyAdditionalTraffic: 0,
    monthlyCost: 0,
    monthlyAdditionalRevenue: 0,
    cumulativeCost: 0,
    cumulativeAdditionalRevenue: 0,
    cumulativeROI: 0,
  });
  
  // Generate data for each month
  for (let month = 1; month <= projectLength; month++) {
    // S-curve growth model for traffic
    const progressRatio = month / projectLength;
    const growthRatio = 1 / (1 + Math.exp(-10 * (progressRatio - 0.5)));
    const monthlyTraffic = currentTraffic + trafficDifference * growthRatio;
    const monthlyAdditionalTraffic = monthlyTraffic - currentTraffic;
    
    // Calculate monthly cost (could be fixed or variable depending on requirements)
    const monthlyTotalCost = monthlyCost;
    cumulativeCost += monthlyTotalCost;
    
    // Calculate monthly additional revenue from additional traffic
    const baselineMonthlyRevenue = (currentTraffic * conversionRate / 100) * averageOrderValue;
    const projectedMonthlyRevenue = (monthlyTraffic * conversionRate / 100) * averageOrderValue;
    const monthlyAdditionalRevenue = projectedMonthlyRevenue - baselineMonthlyRevenue;
    
    cumulativeAdditionalRevenue += monthlyAdditionalRevenue;
    
    // Calculate ROI as percentage
    const cumulativeROI = cumulativeCost > 0 
      ? ((cumulativeAdditionalRevenue / cumulativeCost) - 1) * 100 
      : 0;
    
    data.push({
      month,
      monthlyTraffic,
      monthlyAdditionalTraffic,
      monthlyCost: monthlyTotalCost,
      monthlyAdditionalRevenue,
      cumulativeCost,
      cumulativeAdditionalRevenue,
      cumulativeROI,
    });
  }
  
  return data;
}

/**
 * Calculate the exact break-even month based on chart data
 */
export function calculateBreakEvenMonth(chartData: VisualizationChartDataPoint[]): number {
  for (let i = 1; i < chartData.length; i++) {
    const prevMonth = chartData[i-1];
    const currentMonth = chartData[i];
    
    if (prevMonth.cumulativeAdditionalRevenue < prevMonth.cumulativeCost && 
        currentMonth.cumulativeAdditionalRevenue >= currentMonth.cumulativeCost) {
      
      // Linear interpolation to find exact break-even point
      const costDiff = currentMonth.cumulativeCost - prevMonth.cumulativeCost;
      const revDiff = currentMonth.cumulativeAdditionalRevenue - prevMonth.cumulativeAdditionalRevenue;
      const surplus = prevMonth.cumulativeCost - prevMonth.cumulativeAdditionalRevenue;
      const fraction = surplus / revDiff;
      
      return (i - 1) + fraction;
    }
  }
  
  // If break-even point isn't reached within the timeframe
  return -1;
}

/**
 * Generates tailored recommendations based on calculated ROI and metrics
 * Enhanced with more sophisticated industry-specific recommendations
 */
export const generateRecommendations = (
  monthlyROI: number,
  breakEvenPoint: number,
  conversionRate: number,
  ctr: number,
  keywords: number
): RecommendationItem[] => {
  const recommendations: RecommendationItem[] = [];

  // Enhanced ROI-based recommendations
  if (monthlyROI < 0) {
    recommendations.push({
      title: 'Your current SEO ROI is negative.',
      description: 'Here are some ways to improve:',
      items: [
        'Focus on higher-converting keywords that align with your business goals',
        'Improve your website\'s conversion rate with better landing pages and user experience',
        'Reduce SEO costs by focusing on the most effective strategies',
        'Consider increasing your average order value through upselling or cross-selling',
        'Target keywords with lower difficulty to see faster results'
      ]
    });
  } else if (monthlyROI < 50) {
    recommendations.push({
      title: 'Your SEO ROI is positive but could be improved.',
      description: 'Consider these strategies:',
      items: [
        'Target more high-intent keywords to attract users closer to making a purchase',
        'Optimize your highest-traffic pages for better conversion rates',
        'Implement A/B testing to identify what drives better results',
        'Focus on content that addresses the full customer journey',
        'Improve your internal linking structure to boost overall site authority'
      ]
    });
  } else {
    recommendations.push({
      title: 'Your SEO ROI is strong!',
      description: 'To maintain and improve:',
      items: [
        'Continue expanding your keyword targeting to capture more market share',
        'Reinvest some of your profits into scaling successful SEO strategies',
        'Consider diversifying your traffic sources while maintaining your SEO advantage',
        'Create content clusters around your most profitable topics',
        'Implement advanced structured data to enhance SERP visibility'
      ]
    });
  }

  // Enhanced breakeven recommendations using probability model
  if (isFinite(breakEvenPoint)) {
    if (breakEvenPoint > 12) {
      recommendations.push({
        title: 'Your break-even point is longer than 12 months.',
        description: 'To speed up your ROI:',
        items: [
          'Focus on quick-win keywords that can rank faster',
          'Optimize existing content that\'s already getting some traffic',
          'Consider adjusting your SEO budget allocation for better efficiency',
          'Target higher-converting, lower-volume keywords initially',
          'Implement conversion rate optimization tactics alongside SEO'
        ]
      });
    } else if (breakEvenPoint > 6) {
      recommendations.push({
        title: 'Your break-even point is between 6-12 months,',
        description: 'which is typical for SEO campaigns. Keep optimizing to improve this timeline.',
        items: [
          'Continue your current strategy while monitoring performance',
          'Look for opportunities to accelerate results through featured snippets',
          'Consider adding complementary marketing channels to boost overall ROI'
        ]
      });
    } else {
      recommendations.push({
        title: 'Your break-even point is less than 6 months,',
        description: 'which is excellent for an SEO campaign!',
        items: [
          'Document your successful strategies for future campaigns',
          'Consider increasing investment to scale these results',
          'Look for ways to expand to related keyword areas'
        ]
      });
    }
  }

  // Enhanced conversion rate recommendations with segmentation
  if (conversionRate < 1) {
    recommendations.push({
      title: 'Your conversion rate is below average.',
      description: 'Focus on conversion rate optimization (CRO):',
      items: [
        'Improve your call-to-action buttons and placement',
        'Streamline your checkout or lead capture process',
        'Add social proof and testimonials to build trust',
        'Ensure your site is mobile-friendly and loads quickly',
        'Segment your traffic and create targeted landing pages for different user intents',
        'Implement personalization based on user behavior and traffic source'
      ]
    });
  }

  // Enhanced CTR recommendations with ranking analysis
  if (ctr < 10) {
    recommendations.push({
      title: 'Your click-through rate is below typical first-page results.',
      description: 'To improve your position and CTR:',
      items: [
        'Optimize your meta titles and descriptions to be more compelling',
        'Target higher ranking positions (top 3) as they get 11-27.6% CTR',
        'Use schema markup to enhance your search results appearance',
        'Target featured snippets to increase visibility',
        'Improve your brand recognition to encourage more clicks',
        'Research high-performing titles in your niche and adapt their patterns',
        'Use emotional triggers and power words in your meta descriptions'
      ]
    });
  }

  // Enhanced keyword strategy recommendations
  if (keywords < 5) {
    recommendations.push({
      title: 'You\'re targeting relatively few keywords.',
      description: 'Consider:',
      items: [
        'Expanding your content strategy to cover more relevant topics',
        'Creating topic clusters around your main keywords',
        'Targeting long-tail variations of your primary keywords',
        'Analyzing competitor keyword gaps to find new opportunities',
        'Using question-based keywords to capture featured snippets',
        'Implementing a content calendar to gradually expand your keyword coverage'
      ]
    });
  }

  return recommendations;
};

/**
 * Shared traffic projection model that ensures consistent calculations
 * across all components of the calculator
 * 
 * @param {CalculatorState} state - Current calculator state
 * @returns {number[]} Projected traffic values for each month
 */
export const generateTrafficProjection = (state: CalculatorState): number[] => {
  const projectedTrafficData: number[] = [];
  
  // Determine domain authority factor based on current traffic
  // Lower traffic sites grow slower, higher traffic sites grow faster
  let domainAuthorityFactor = 0;
  
  // IMPROVED: Refined growth curve for sites with 500-1000 visitors
  if (state.currentTraffic < 300) {
    // Very new sites with minimal traffic (extremely slow growth)
    domainAuthorityFactor = 0.07; 
  } else if (state.currentTraffic >= 300 && state.currentTraffic < 500) {
    // New sites with very low traffic
    domainAuthorityFactor = 0.09;
  } else if (state.currentTraffic >= 500 && state.currentTraffic < 1000) {
    // IMPROVED: More granular factor for sites with 500-1000 visitors
    domainAuthorityFactor = 0.12; 
  } else if (state.currentTraffic >= 1000 && state.currentTraffic < 5000) {
    // Growing sites with some established presence
    domainAuthorityFactor = 0.20;
  } else if (state.currentTraffic < 50000) {
    // Established sites with decent authority
    domainAuthorityFactor = 0.35;
  } else if (state.currentTraffic < 200000) {
    // Well-established sites with strong authority
    domainAuthorityFactor = 0.45;
  } else {
    // Highly authoritative sites
    domainAuthorityFactor = 0.55;
  }

  // Competition level adjustment
  const extendedState = state as any; // Type assertion for optional competition level property
  if (extendedState.competitionLevel) {
    // IMPROVED: Adjust growth factor based on competition level
    if (extendedState.competitionLevel === 'high') {
      domainAuthorityFactor *= 0.8; // Slow down growth for high competition
    } else if (extendedState.competitionLevel === 'low') {
      domainAuthorityFactor *= 1.2; // Speed up growth for low competition
    }
  }
  
  // Growth curve parameters for different site maturity levels
  const growthRate = domainAuthorityFactor; // Growth rate based on domain authority
  
  // Determine midpoint - shifts further out for less authoritative sites
  let midpoint;
  if (state.currentTraffic < 500) {
    // New sites see most growth in latter half of the period
    midpoint = Math.round(state.timeframe * 0.7);
  } else if (state.currentTraffic < 5000) {
    midpoint = Math.round(state.timeframe * 0.65);
  } else {
    midpoint = Math.round(state.timeframe * 0.6);
  }
  
  // IMPROVED: Adjust flat period based on traffic and competition
  let rampUpPeriod;
  
  // Determine base ramp-up period based on traffic level
  if (state.currentTraffic < 300) {
    rampUpPeriod = 7; // Longest ramp-up for very new sites
  } else if (state.currentTraffic < 500) {
    rampUpPeriod = 5; // Long ramp-up for new sites
  } else if (state.currentTraffic < 1000) {
    // IMPROVED: More realistic ramp-up for sites with 500-1000 visitors
    rampUpPeriod = 4; 
  } else if (state.currentTraffic < 5000) {
    rampUpPeriod = 3; // Moderate ramp-up for growing sites
  } else {
    rampUpPeriod = 2; // Shorter ramp-up for established sites
  }
  
  // Adjust ramp-up period based on competition level if available
  if (extendedState.competitionLevel) {
    if (extendedState.competitionLevel === 'high') {
      rampUpPeriod += 1; // Add a month for high competition
    } else if (extendedState.competitionLevel === 'low') {
      rampUpPeriod = Math.max(1, rampUpPeriod - 1); // Reduce by a month for low competition, but minimum 1
    }
  }
  
  // Generate initial data points using S-curve growth
  const tempProjectedData: number[] = [];
  
  // Generate data points for each month using S-curve growth
  for (let i = 0; i <= state.timeframe; i++) {
    // For low-traffic sites, introduce an initial flat period with negligible growth
    let trafficIncrease = 0;
    const trafficDifference = state.targetTraffic - state.currentTraffic;
    
    // IMPROVED: More nuanced initial growth for different traffic segments
    if (state.currentTraffic < 300 && i <= 3) {
      // Almost no growth in first 3 months for brand new sites
      trafficIncrease = trafficDifference * 0.005 * i;
    } else if (state.currentTraffic < 500 && i <= 2) {
      // Very slow initial growth for new sites
      trafficIncrease = trafficDifference * 0.015 * i;
    } else if (state.currentTraffic < 1000 && i <= 1) {
      // Slightly faster initial growth for sites with 500-1000 visitors
      trafficIncrease = trafficDifference * 0.025 * i;
    } else {
      // S-curve growth model
      // First apply ramp-up period logic
      // No significant results until a few months in for SEO
      const rampUpFactor = 1 - Math.exp(-i / rampUpPeriod);
      
      // Then apply S-curve growth model
      const sCurveFactor = 1 / (1 + Math.exp(-growthRate * (i - midpoint)));
      
      // Combine factors to get actual traffic increase
      trafficIncrease = trafficDifference * sCurveFactor * rampUpFactor;
    }
    
    // CONSISTENT ROUNDING: Always round to integers for traffic values
    tempProjectedData.push(Math.round(state.currentTraffic + trafficIncrease));
  }
  
  // Now normalize the data to ensure we reach the target traffic by the end of the timeframe
  // This preserves the growth curve shape but ensures we hit the target
  const finalGeneratedTraffic = tempProjectedData[state.timeframe];
  const targetTraffic = state.targetTraffic;
  
  // Only apply normalization if we're not already reaching the target 
  // and the target is greater than current traffic
  if (finalGeneratedTraffic !== targetTraffic && targetTraffic > state.currentTraffic) {
    const correctionFactor = (targetTraffic - state.currentTraffic) / (finalGeneratedTraffic - state.currentTraffic);
    
    for (let i = 0; i <= state.timeframe; i++) {
      // Apply the correction while preserving the S-curve shape
      if (i === 0) {
        // Month 0 is always current traffic
        projectedTrafficData.push(state.currentTraffic);
      } else if (i === state.timeframe) {
        // Last month is always exactly the target traffic
        projectedTrafficData.push(targetTraffic);
      } else {
        // Adjust intermediate months proportionally
        const originalIncrease = tempProjectedData[i] - state.currentTraffic;
        const adjustedIncrease = originalIncrease * correctionFactor;
        // CONSISTENT ROUNDING: Always round to integers for traffic values
        projectedTrafficData.push(Math.round(state.currentTraffic + adjustedIncrease));
      }
    }
  } else {
    // If we're already reaching target or target is below current, use the original data
    projectedTrafficData.push(...tempProjectedData);
  }
  
  return projectedTrafficData;
}; 