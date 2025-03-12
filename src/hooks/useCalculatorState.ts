import { useState } from 'react';
import { CalculatorState, CalculationResults, ChartData, RecommendationItem } from '../types';

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

export const useCalculatorState = () => {
  const [state, setState] = useState<CalculatorState>(initialState);

  const updateState = (updates: Partial<CalculatorState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates,
    }));
  };

  const resetState = () => {
    setState(initialState);
  };

  const calculateResults = (): CalculationResults => {
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

  // Helper functions for chart data generation
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
    
    // Traffic-specific recommendations
    if (state.targetTraffic > state.currentTraffic * 2) {
      recommendations.push({
        title: 'Ambitious Traffic Growth Strategy',
        description: 'Your target traffic represents significant growth. Consider these strategies:',
        items: [
          'Conduct comprehensive keyword research focusing on long-tail opportunities',
          'Develop a robust content calendar with regular publishing schedule',
          'Invest in technical SEO improvements to ensure site can handle increased traffic',
          'Implement structured data markup to improve visibility in search results',
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
    updateState,
    resetState,
    calculateResults,
  };
}; 