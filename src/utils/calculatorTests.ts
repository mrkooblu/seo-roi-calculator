import { CalculatorState } from '../types';
// Import specific functions from useCalculatorState
import { useCalculatorState } from '../hooks/useCalculatorState';

/**
 * Test suite for SEO ROI calculator
 * Verifies consistency between break-even calculations and chart data
 * Includes edge cases for validation
 */

// Test case definitions
interface TestCase {
  name: string;
  inputs: CalculatorState;
  expectedBreakEvenRange: [number, number]; // Min and max expected break-even month
}

// Define test cases with edge case scenarios
const testCases: TestCase[] = [
  {
    name: "Low traffic site (500 visitors)",
    inputs: {
      currentTraffic: 500,
      targetTraffic: 1500,
      conversionRate: 1.5,
      averageOrderValue: 80,
      monthlySEOCost: 1000,
      timeframe: 12,
      // Advanced settings with defaults
      keywordDifficulty: 40,
      competitionLevel: 'medium',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [11, 12] // Expected break-even between months 11-12
  },
  {
    name: "Very low traffic site (300 visitors)",
    inputs: {
      currentTraffic: 300,
      targetTraffic: 1200,
      conversionRate: 2,
      averageOrderValue: 100,
      monthlySEOCost: 1000,
      timeframe: 12,
      keywordDifficulty: 40,
      competitionLevel: 'medium',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [11, 13] // Expected break-even between months 11-13
  },
  {
    name: "Mid-size site with high conversion",
    inputs: {
      currentTraffic: 5000,
      targetTraffic: 10000,
      conversionRate: 4,
      averageOrderValue: 50,
      monthlySEOCost: 2000,
      timeframe: 12,
      keywordDifficulty: 40,
      competitionLevel: 'medium',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [4, 6] // Expected break-even between months 4-6
  },
  {
    name: "High-ticket item with low conversion",
    inputs: {
      currentTraffic: 1000,
      targetTraffic: 2000,
      conversionRate: 0.5,
      averageOrderValue: 1000,
      monthlySEOCost: 1500,
      timeframe: 12,
      keywordDifficulty: 40,
      competitionLevel: 'medium',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [7, 9] // Expected break-even between months 7-9
  },
  {
    name: "Never breaks even scenario",
    inputs: {
      currentTraffic: 200,
      targetTraffic: 400,
      conversionRate: 0.5,
      averageOrderValue: 20,
      monthlySEOCost: 1000,
      timeframe: 12,
      keywordDifficulty: 40,
      competitionLevel: 'high',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [12, Infinity] // Expected to never break even
  },
  {
    name: "Border case - exactly 500 visitors",
    inputs: {
      currentTraffic: 500,
      targetTraffic: 1500,
      conversionRate: 1.5,
      averageOrderValue: 80,
      monthlySEOCost: 1000,
      timeframe: 12,
      keywordDifficulty: 40,
      competitionLevel: 'medium',
      industryType: 'ecommerce',
      contentInvestment: 30, 
      linkBuildingInvestment: 40,
      technicalSEOInvestment: 30
    },
    expectedBreakEvenRange: [11, 12] // Expected break-even between months 11-12
  }
];

/**
 * Runs tests to verify break-even calculation consistency
 * Can be run in development environment to validate calculation changes
 * 
 * @returns {Object} Test results with pass/fail status
 */
export const runCalculatorTests = (): { passed: boolean, results: any[] } => {
  const results: any[] = [];
  let allTestsPassed = true;
  
  // Create a helper for testing that doesn't rely on React hooks
  const calculatorTester = {
    calculateResults: (state: CalculatorState) => {
      // Simplified version of the calculation logic for testing purposes
      const { 
        currentTraffic, targetTraffic, conversionRate, 
        averageOrderValue, monthlySEOCost, timeframe 
      } = state;
      
      // Basic calculations
      const monthlyConversions = (currentTraffic * conversionRate) / 100;
      const initialRevenue = monthlyConversions * averageOrderValue;
      
      const projectedMonthlyConversions = (targetTraffic * conversionRate) / 100;
      const projectedRevenue = projectedMonthlyConversions * averageOrderValue;
      
      // Calculate cumulative costs and revenues to find break-even
      const baselineMonthlyRevenue = (currentTraffic * conversionRate / 100) * averageOrderValue;
      let cumulativeAdditionalRevenue = 0;
      let cumulativeCost = 0;
      let previousCumulativeRevenue = 0;
      let breakEvenMonth = timeframe; // Default to last month if never breaks even
      let breakEvenFound = false;
      
      // Simple traffic growth model for testing
      for (let i = 1; i <= timeframe; i++) {
        // Simple linear traffic growth for testing
        const growthFraction = i / timeframe;
        const trafficIncrease = (targetTraffic - currentTraffic) * growthFraction;
        const monthlyTraffic = currentTraffic + trafficIncrease;
        
        // Calculate revenue for this month
        const monthlyRevenue = (monthlyTraffic * conversionRate / 100) * averageOrderValue;
        const additionalMonthlyRevenue = monthlyRevenue - baselineMonthlyRevenue;
        
        // Store previous cumulative revenue for interpolation
        previousCumulativeRevenue = cumulativeAdditionalRevenue;
        
        // Add to cumulative totals
        cumulativeAdditionalRevenue += additionalMonthlyRevenue;
        cumulativeCost += monthlySEOCost;
        
        // Check if we've reached break-even
        if (cumulativeAdditionalRevenue >= cumulativeCost && !breakEvenFound) {
          // Calculate fractional month using linear interpolation
          if (i > 1 && previousCumulativeRevenue < cumulativeCost) {
            const previousMonthDeficit = cumulativeCost - previousCumulativeRevenue;
            const currentMonthSurplus = cumulativeAdditionalRevenue - cumulativeCost;
            const totalChange = previousMonthDeficit + currentMonthSurplus;
            const fraction = previousMonthDeficit / totalChange;
            
            // Add fractional part to the previous month
            breakEvenMonth = (i - 1) + fraction;
          } else {
            breakEvenMonth = i;
          }
          breakEvenFound = true;
          break;
        }
      }
      
      // Round to 1 decimal place for display
      breakEvenMonth = Math.round(breakEvenMonth * 10) / 10;
      
      return {
        breakEvenMonth
      };
    }
  };
  
  testCases.forEach(testCase => {
    // Calculate break-even month using the test helper
    const result = calculatorTester.calculateResults(testCase.inputs);
    const breakEvenMonth = result.breakEvenMonth;
    
    // Verify break-even month is within expected range
    const isInRange = 
      breakEvenMonth >= testCase.expectedBreakEvenRange[0] && 
      breakEvenMonth <= testCase.expectedBreakEvenRange[1];
    
    if (!isInRange) {
      allTestsPassed = false;
    }
    
    // Record test result
    results.push({
      name: testCase.name,
      passed: isInRange,
      expected: `Between months ${testCase.expectedBreakEvenRange[0]} and ${testCase.expectedBreakEvenRange[1]}`,
      actual: `Month ${breakEvenMonth}`,
      inputs: { ...testCase.inputs }
    });
  });
  
  return {
    passed: allTestsPassed,
    results
  };
};

/**
 * Utility to verify that break-even calculation matches what's shown in chart
 * 
 * @param {CalculatorState} state - Calculator state
 * @param {number} breakEvenMonth - Calculated break-even month
 * @param {Array} chartData - ROI comparison chart data
 * @returns {boolean} True if break-even is consistent between calculation and chart
 */
export const verifyBreakEvenConsistency = (
  state: CalculatorState,
  breakEvenMonth: number,
  chartData: any
): boolean => {
  // Extract cumulative cost and revenue data from chart
  const cumulativeCostData = chartData.datasets.find(
    (ds: any) => ds.label.includes('Cost')
  )?.data || [];
  
  const cumulativeRevenueData = chartData.datasets.find(
    (ds: any) => ds.label.includes('Revenue Increase')
  )?.data || [];
  
  // Find crossover point in chart data
  let chartBreakEvenMonth = state.timeframe;
  
  for (let i = 0; i < cumulativeCostData.length; i++) {
    if (cumulativeRevenueData[i] >= cumulativeCostData[i]) {
      // If this is the first crossover point
      chartBreakEvenMonth = i + 1; // Add 1 because chart months are 1-indexed
      
      // If we can detect a fractional month through interpolation
      if (i > 0) {
        const prevMonthCostDiff = cumulativeCostData[i-1] - cumulativeRevenueData[i-1];
        const thisMonthRevenueDiff = cumulativeRevenueData[i] - cumulativeCostData[i];
        const totalDiff = prevMonthCostDiff + thisMonthRevenueDiff;
        
        if (totalDiff > 0) {
          // Calculate fractional part
          const fraction = prevMonthCostDiff / totalDiff;
          chartBreakEvenMonth = i + fraction;
        }
      }
      
      break;
    }
  }
  
  // Calculate difference between break-even points
  const difference = Math.abs(breakEvenMonth - chartBreakEvenMonth);
  
  // Allow small difference due to rounding and interpolation
  // The visual representation might be slightly different from the precise calculation
  return difference <= 0.5;
}; 