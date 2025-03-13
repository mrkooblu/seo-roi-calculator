import { useState } from 'react';
import { CalculatorState, CalculationResults, ChartData, RecommendationItem, ValidationErrors } from '../types';
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
  organicCTR: 3.5,
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
    const projectedRevenue = projectedMonthlyConversions * state.averageOrderValue;
    
    const revenueIncrease = projectedRevenue - initialRevenue;
    const totalSEOCost = state.monthlySEOCost * state.timeframe;
    
    // ROI calculation
    const roi = ((revenueIncrease * state.timeframe) - totalSEOCost) / totalSEOCost * 100;
    
    // Break-even calculation
    const breakEvenMonth = Math.ceil(totalSEOCost / revenueIncrease);
    
    // Generate chart data
    const trafficGrowthChart = generateTrafficGrowthChart();
    const revenueGrowthChart = generateRevenueGrowthChart();
    const roiComparisonChart = generateROIComparisonChart();
    
    // Generate recommendations
    const recommendations = generateRecommendations(roi);
    
    return {
      initialRevenue,
      projectedRevenue,
      revenueIncrease,
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
   * 
   * @returns {ChartData} Chart data for traffic growth visualization
   */
  const generateTrafficGrowthChart = (): ChartData => {
    const labels: string[] = [];
    const currentTrafficData: number[] = [];
    const projectedTrafficData: number[] = [];
    
    // Generate data points for each month
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentTrafficData.push(state.currentTraffic);
      
      // Simple linear growth model (can be replaced with more complex models)
      const growthFactor = i / state.timeframe;
      const trafficIncrease = (state.targetTraffic - state.currentTraffic) * growthFactor;
      projectedTrafficData.push(state.currentTraffic + trafficIncrease);
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
   * 
   * @returns {ChartData} Chart data for revenue growth visualization
   */
  const generateRevenueGrowthChart = (): ChartData => {
    const labels: string[] = [];
    const currentRevenueData: number[] = [];
    const projectedRevenueData: number[] = [];
    
    const monthlyCurrentRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
    const monthlyTargetRevenue = (state.targetTraffic * state.conversionRate / 100) * state.averageOrderValue;
    
    // Generate data points for each month
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentRevenueData.push(monthlyCurrentRevenue);
      
      // Simple linear growth model
      const growthFactor = i / state.timeframe;
      const revenueIncrease = (monthlyTargetRevenue - monthlyCurrentRevenue) * growthFactor;
      projectedRevenueData.push(monthlyCurrentRevenue + revenueIncrease);
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
   * 
   * @returns {ChartData} Chart data for ROI comparison visualization
   */
  const generateROIComparisonChart = (): ChartData => {
    // Simple ROI comparison by month
    const labels: string[] = [];
    const cumulativeCostData: number[] = [];
    const cumulativeRevenueIncreaseData: number[] = [];
    const roiData: number[] = [];
    
    const monthlyCost = state.monthlySEOCost;
    const monthlyRevenueIncrease = ((state.targetTraffic - state.currentTraffic) * state.conversionRate / 100) * state.averageOrderValue;
    
    for (let i = 1; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      
      // Apply a growth curve to revenue (slower at start, faster later)
      const growthFactor = Math.min(1, (i / state.timeframe) * 1.5);
      const adjustedMonthlyRevenueIncrease = monthlyRevenueIncrease * growthFactor;
      
      // Calculate cumulative values
      const cumulativeCost = monthlyCost * i;
      cumulativeCostData.push(cumulativeCost);
      
      // For revenue, use a compounding approach
      const revenueForMonth = adjustedMonthlyRevenueIncrease;
      const previousRevenue = i > 1 ? cumulativeRevenueIncreaseData[i - 2] : 0;
      cumulativeRevenueIncreaseData.push(previousRevenue + revenueForMonth);
      
      // ROI calculation: (Revenue - Cost) / Cost * 100
      const roiForMonth = ((previousRevenue + revenueForMonth) - cumulativeCost) / cumulativeCost * 100;
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
    
    // General recommendation
    recommendations.push({
      title: 'SEO Strategy Overview',
      description: `Based on your input, your projected ROI over ${state.timeframe} months is ${roi.toFixed(2)}%.`,
      items: [
        `Your initial traffic of ${state.currentTraffic} visitors should grow to ${state.targetTraffic} visitors.`,
        `Monthly SEO investment of $${state.monthlySEOCost} is expected to generate significant returns.`,
        `Break-even point is projected after approximately ${Math.ceil(state.monthlySEOCost * state.timeframe / (((state.targetTraffic - state.currentTraffic) * state.conversionRate / 100) * state.averageOrderValue))} months.`,
      ],
    });
    
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