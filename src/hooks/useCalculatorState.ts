import { useState } from 'react';
import { CalculatorState, CalculationResults, ChartData, RecommendationItem } from '../types';
import useFormValidation from './useFormValidation';

/**
 * Initial calculator state with default values
 */
const initialState: CalculatorState = {
  // Basic calculator inputs
  currentTraffic: 1000,
  targetTraffic: 2000,
  conversionRate: 2,
  averageOrderValue: 100,
  monthlySEOCost: 1000,
  
  // Advanced calculator inputs
  keywordDifficulty: 40,
  competitionLevel: 'medium',
  industryType: 'ecommerce',
  contentInvestment: 30,
  linkBuildingInvestment: 40,
  technicalSEOInvestment: 30,
  
  // Other state
  timeframe: 12,
};

/**
 * Custom hook for managing calculator state and calculations
 * 
 * @returns {Object} Calculator state and methods
 * @returns {CalculatorState} state - Current calculator state values
 * @returns {ValidationErrors} errors - Validation errors keyed by field name
 * @returns {Function} updateState - Function to update state values
 * @returns {Function} resetState - Function to reset state to initial values
 * @returns {Function} calculateResults - Function to calculate results based on current state
 * @returns {Function} getFieldError - Function to get error for a specific field
 */
export const useCalculatorState = () => {
  const [state, setState] = useState<CalculatorState>(initialState);
  const { errors, validateCalculatorInputs, clearErrors, getFieldError } = useFormValidation();

  /**
   * Updates the calculator state with new values
   * 
   * @param {Partial<CalculatorState>} updates - Object containing the fields to update
   */
  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates,
    }));
  };

  /**
   * Resets calculator state to initial values and clears validation errors
   */
  const resetState = () => {
    setState(initialState);
    clearErrors();
  };

  /**
   * Calculates ROI and related metrics based on current state
   * Validates inputs before calculation
   * 
   * @returns {CalculationResults | null} Calculation results or null if validation fails
   */
  const calculateResults = (): CalculationResults | null => {
    // Validate inputs before calculating
    if (!validateCalculatorInputs(state)) {
      return null;
    }
    
    // Basic calculations
    const monthlyConversions = (state.currentTraffic * state.conversionRate) / 100;
    const initialRevenue = monthlyConversions * state.averageOrderValue;
    
    const projectedMonthlyConversions = (state.targetTraffic * state.conversionRate) / 100;
    // This represents the final month's revenue at the end of the timeframe
    const projectedRevenue = projectedMonthlyConversions * state.averageOrderValue;
    
    // Calculate difference between final and initial revenue
    const revenueIncrease = projectedRevenue - initialRevenue;
    const totalSEOCost = state.monthlySEOCost * state.timeframe;
    
    // ROI calculation
    const roi = ((revenueIncrease * state.timeframe) - totalSEOCost) / totalSEOCost * 100;
    
    // Generate chart data to get monthly traffic projections
    const trafficGrowthChart = generateTrafficGrowthChart();
    
    // Calculate break-even month properly based on cumulative additional revenue vs. cumulative cost
    let breakEvenMonth = state.timeframe; // Default to last month if never breaks even
    let cumulativeAdditionalRevenue = 0;
    let cumulativeCost = 0;
    
    // Calculate average monthly increase using the traffic growth chart data
    let totalMonthlyIncreases = 0;
    let monthsWithIncrease = 0;
    
    // Start from month 1 (index 1) since month 0 is baseline
    for (let i = 1; i <= state.timeframe; i++) {
      // Get projected traffic for this month from the chart data
      const monthlyProjectedTraffic = trafficGrowthChart.datasets[1].data[i];
      const additionalTraffic = monthlyProjectedTraffic - state.currentTraffic;
      
      // Calculate additional revenue for this month
      const additionalMonthlyRevenue = (additionalTraffic * state.conversionRate / 100) * state.averageOrderValue;
      
      // Add to monthly increases sum (for average calculation)
      totalMonthlyIncreases += additionalMonthlyRevenue;
      monthsWithIncrease++;
      
      // Add to cumulative totals
      cumulativeAdditionalRevenue += additionalMonthlyRevenue;
      cumulativeCost += state.monthlySEOCost;
      
      // Check if we've reached break-even
      if (cumulativeAdditionalRevenue >= cumulativeCost && breakEvenMonth === state.timeframe) {
        breakEvenMonth = i;
        break;
      }
    }
    
    // Calculate average monthly increase across the timeframe
    const averageMonthlyIncrease = monthsWithIncrease > 0 ? totalMonthlyIncreases / monthsWithIncrease : 0;
    
    // Generate remaining chart data
    const revenueGrowthChart = generateRevenueGrowthChart();
    const roiComparisonChart = generateROIComparisonChart();
    
    // Generate recommendations
    const recommendations = generateRecommendations(roi);
    
    return {
      initialRevenue,
      projectedRevenue,
      revenueIncrease,
      averageMonthlyIncrease,
      totalSEOCost,
      roi,
      breakEvenMonth,
      trafficGrowthChart,
      revenueGrowthChart,
      roiComparisonChart,
      recommendations,
    };
  };

  /**
   * Generates traffic growth chart data based on current state
   * Using S-curve growth and adjusting growth rate based on current traffic levels
   * Ensures target traffic is reached by the end of the timeframe
   * 
   * @returns {ChartData} Chart data for traffic growth visualization
   */
  const generateTrafficGrowthChart = (): ChartData => {
    const labels: string[] = [];
    const currentTrafficData: number[] = [];
    const projectedTrafficData: number[] = [];
    
    // Determine domain authority factor based on current traffic
    // Lower traffic sites grow slower, higher traffic sites grow faster
    let domainAuthorityFactor = 0;
    if (state.currentTraffic < 500) {
      // New sites with very low traffic (extremely slow growth)
      domainAuthorityFactor = 0.08; 
    } else if (state.currentTraffic < 5000) {
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
    
    // Longer ramp-up for newer sites - creating a realistic 4-6 month flat period
    let rampUpPeriod;
    if (state.currentTraffic < 500) {
      rampUpPeriod = 6; // Much longer ramp-up for brand new sites (4-6 months flat)
    } else if (state.currentTraffic < 5000) {
      rampUpPeriod = 4; // Longer ramp-up for growing sites
    } else {
      rampUpPeriod = 3; // Standard ramp-up for established sites
    }
    
    // Generate initial data points using S-curve growth
    const tempProjectedData: number[] = [];
    
    // Generate data points for each month using S-curve growth
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentTrafficData.push(state.currentTraffic);
      
      // For low-traffic sites, introduce an initial flat period with negligible growth
      let trafficIncrease = 0;
      const trafficDifference = state.targetTraffic - state.currentTraffic;
      
      if (state.currentTraffic < 500 && i <= 3) {
        // Almost no growth in first 3 months for brand new sites
        trafficIncrease = trafficDifference * 0.01 * (i / 3);
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
          projectedTrafficData.push(Math.round(state.currentTraffic + adjustedIncrease));
        }
      }
    } else {
      // If we're already reaching target or target is below current, use the original data
      projectedTrafficData.push(...tempProjectedData);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Current Traffic',
          data: currentTrafficData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          type: 'line',
        },
        {
          label: 'Projected Traffic',
          data: projectedTrafficData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          type: 'line',
        },
      ],
    };
  };

  /**
   * Generates revenue growth chart data based on current state
   * Using the same growth pattern as traffic for consistency
   * 
   * @returns {ChartData} Chart data for revenue growth visualization
   */
  const generateRevenueGrowthChart = (): ChartData => {
    const labels: string[] = [];
    const currentRevenueData: number[] = [];
    const projectedRevenueData: number[] = [];
    
    const monthlyCurrentRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
    
    // Get traffic growth data to use the same pattern for revenue
    const trafficData = generateTrafficGrowthChart();
    
    // Generate data points for each month
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentRevenueData.push(monthlyCurrentRevenue);
      
      // Use traffic projection to calculate revenue
      const projectedTraffic = trafficData.datasets[1].data[i];
      const projectedMonthlyRevenue = (projectedTraffic * state.conversionRate / 100) * state.averageOrderValue;
      projectedRevenueData.push(projectedMonthlyRevenue);
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Current Revenue',
          data: currentRevenueData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
          type: 'bar',
        },
        {
          label: 'Projected Revenue',
          data: projectedRevenueData,
          backgroundColor: 'rgba(153, 102, 255, 0.2)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1,
          type: 'bar',
        },
      ],
    };
  };

  /**
   * Generates ROI comparison chart data based on current state
   * Uses the same realistic growth model as the traffic projections
   * 
   * @returns {ChartData} Chart data for ROI comparison visualization
   */
  const generateROIComparisonChart = (): ChartData => {
    // ROI comparison by month using realistic growth
    const labels: string[] = [];
    const cumulativeCostData: number[] = [];
    const cumulativeRevenueIncreaseData: number[] = [];
    const roiData: number[] = [];
    
    const monthlyCost = state.monthlySEOCost;
    const baselineMonthlyRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
    
    // Get traffic growth data to use the same pattern
    const trafficData = generateTrafficGrowthChart();
    let cumulativeRevenueIncrease = 0;
    
    for (let i = 1; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      
      // Calculate cumulative cost
      const cumulativeCost = monthlyCost * i;
      cumulativeCostData.push(cumulativeCost);
      
      // Calculate revenue using the traffic projections
      const projectedTraffic = trafficData.datasets[1].data[i];
      const projectedMonthlyRevenue = (projectedTraffic * state.conversionRate / 100) * state.averageOrderValue;
      const additionalMonthlyRevenue = projectedMonthlyRevenue - baselineMonthlyRevenue;
      
      // Add to cumulative revenue increase
      cumulativeRevenueIncrease += additionalMonthlyRevenue;
      cumulativeRevenueIncreaseData.push(cumulativeRevenueIncrease);
      
      // ROI calculation: (Revenue - Cost) / Cost * 100
      const roiForMonth = (cumulativeRevenueIncrease - cumulativeCost) / cumulativeCost * 100;
      roiData.push(Math.max(-100, roiForMonth)); // Cap at -100% for visualization
    }
    
    return {
      labels,
      datasets: [
        {
          label: 'Cumulative Cost ($)',
          data: cumulativeCostData,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
        },
        {
          label: 'Cumulative Revenue Increase ($)',
          data: cumulativeRevenueIncreaseData,
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          type: 'bar',
          yAxisID: 'y',
        },
        {
          label: 'ROI (%)',
          data: roiData,
          backgroundColor: 'transparent',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          type: 'line',
          yAxisID: 'y1',
        },
      ],
    };
  };

  /**
   * Generates tailored recommendations based on calculation results
   * 
   * @param {number} roi - Calculated ROI percentage
   * @returns {RecommendationItem[]} Array of recommendation objects
   */
  const generateRecommendations = (roi: number): RecommendationItem[] => {
    const recommendations: RecommendationItem[] = [];
    
    // Calculate break-even month for recommendation
    // This is needed because the calculateResults function's breakEvenMonth isn't accessible here
    let breakEvenText = "";
    
    // Generate traffic data to calculate break-even
    const trafficData = generateTrafficGrowthChart();
    let cumulativeAdditionalRevenue = 0;
    let cumulativeCost = 0;
    let calculatedBreakEvenMonth = state.timeframe;
    
    // Start from month 1 (index 1) since month 0 is baseline
    for (let i = 1; i <= state.timeframe; i++) {
      // Get projected traffic for this month
      const monthlyProjectedTraffic = trafficData.datasets[1].data[i];
      const additionalTraffic = monthlyProjectedTraffic - state.currentTraffic;
      
      // Calculate additional revenue for this month
      const additionalMonthlyRevenue = (additionalTraffic * state.conversionRate / 100) * state.averageOrderValue;
      
      // Add to cumulative totals
      cumulativeAdditionalRevenue += additionalMonthlyRevenue;
      cumulativeCost += state.monthlySEOCost;
      
      // Check if we've reached break-even
      if (cumulativeAdditionalRevenue >= cumulativeCost && calculatedBreakEvenMonth === state.timeframe) {
        calculatedBreakEvenMonth = i;
        break;
      }
    }
    
    if (calculatedBreakEvenMonth < state.timeframe) {
      breakEvenText = `Based on gradual traffic growth, you should reach break-even around month ${calculatedBreakEvenMonth}.`;
    } else {
      breakEvenText = `Your investment may take longer than ${state.timeframe} months to break even based on these projections.`;
    }
    
    // General recommendation
    recommendations.push({
      title: 'SEO Strategy Overview',
      description: `Based on your input, your projected ROI over ${state.timeframe} months is ${roi.toFixed(2)}%.`,
      items: [
        `Your initial traffic of ${state.currentTraffic} visitors should grow to ${state.targetTraffic} visitors.`,
        `Monthly SEO investment of $${state.monthlySEOCost} is expected to generate significant returns.`,
        breakEvenText,
      ],
    });
    
    // Add site-specific recommendations based on current traffic levels
    if (state.currentTraffic < 500) {
      recommendations.push({
        title: 'New Site Growth Strategy',
        description: 'Your site appears to be new or has limited organic traffic. Consider these strategies:',
        items: [
          'Focus on building a strong foundation with quality content and proper technical SEO',
          'Target long-tail, lower competition keywords initially to gain traction',
          'Expect slower growth in the first 3-6 months as you build domain authority',
          'Prioritize building high-quality backlinks from relevant sources to improve domain authority',
          'Use a content calendar to consistently publish valuable content',
          'Consider supplementing organic efforts with paid advertising for immediate visibility'
        ],
      });
    } else if (state.currentTraffic < 5000) {
      recommendations.push({
        title: 'Growing Site Strategy',
        description: 'Your site has some established presence. To accelerate growth:',
        items: [
          'Audit existing content and optimize underperforming pages',
          'Begin targeting more competitive keywords as your authority grows',
          'Implement a systematic link building strategy',
          'Consider content clusters to establish topical authority',
          'Leverage existing traffic for internal linking opportunities',
          'Begin expanding into related keyword areas'
        ],
      });
    } else if (state.currentTraffic >= 5000) {
      recommendations.push({
        title: 'Established Site Strategy',
        description: 'Your site has significant organic traffic. Advanced strategies to consider:',
        items: [
          'Implement advanced technical SEO optimizations',
          'Focus on conversion rate optimization to maximize value from existing traffic',
          'Target featured snippets and other SERP features',
          'Create authoritative content hubs around high-value topics',
          'Analyze competitors for content gaps and ranking opportunities',
          'Leverage data analysis to identify seasonality and timing opportunities'
        ],
      });
    }
    
    // Conversion-focused recommendations
    if (state.conversionRate < 3) {
      recommendations.push({
        title: 'Conversion Rate Optimization',
        description: 'Your conversion rate could be improved to increase ROI:',
        items: [
          'Optimize product pages with stronger calls-to-action',
          'Improve site navigation and search functionality',
          'Implement A/B testing to identify highest-converting page elements',
          'Optimize checkout process to reduce abandonment',
        ],
      });
    }
    
    // Industry-specific recommendations
    switch (state.industryType) {
      case 'ecommerce':
        recommendations.push({
          title: 'E-commerce SEO Opportunities',
          description: 'Specialized strategies for e-commerce sites:',
          items: [
            'Optimize product schema markup for enhanced product listings',
            'Create detailed buying guides and comparison content',
            'Implement faceted navigation optimizations',
            'Focus on seasonal keyword opportunities',
          ],
        });
        break;
      case 'saas':
        recommendations.push({
          title: 'SaaS SEO Strategy',
          description: 'Tailored approaches for SaaS companies:',
          items: [
            'Develop educational content targeting each stage of the buyer journey',
            'Create detailed product comparison pages',
            'Focus on problem-solution content',
            'Build authority through technical thought leadership',
          ],
        });
        break;
      case 'local':
        recommendations.push({
          title: 'Local SEO Focus',
          description: 'Strategies to improve local search visibility:',
          items: [
            'Optimize Google Business Profile with complete information',
            'Build local citations across relevant directories',
            'Implement local schema markup',
            'Develop content around local events and news',
          ],
        });
        break;
      default:
        recommendations.push({
          title: 'General SEO Recommendations',
          description: 'Core SEO strategies to implement:',
          items: [
            'Focus on creating high-quality, authoritative content',
            'Build relevant and authoritative backlinks',
            'Ensure technical SEO fundamentals are optimized',
            'Regularly audit and update existing content',
          ],
        });
    }
    
    return recommendations;
  };

  return {
    state,
    errors,
    updateState,
    resetState,
    calculateResults,
    getFieldError,
  };
}; 