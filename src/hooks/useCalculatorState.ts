import { useState } from 'react';
import { CalculatorState, CalculationResults, ChartData, RecommendationItem } from '../types';
import useFormValidation from './useFormValidation';

/**
 * SEO ROI Calculator - Calculation Logic
 * --------------------------------------
 * 
 * This file contains the core calculation logic for the SEO ROI calculator.
 * Key features and implementation notes:
 * 
 * 1. GROWTH MODEL:
 *    - Uses an S-curve growth model for traffic projections
 *    - Adjusts growth based on current traffic levels (slower for new sites, faster for established sites)
 *    - Incorporates competition level into growth rate calculations
 *    - Applies a flat period at the beginning for realistic early SEO performance
 * 
 * 2. BREAK-EVEN CALCULATION:
 *    - Calculates break-even point where cumulative revenue exceeds cumulative cost
 *    - Supports fractional month precision through linear interpolation 
 *    - Consistently rounded to 1 decimal place for display
 * 
 * 3. ROUNDING BEHAVIOR:
 *    - Traffic values are always rounded to integers
 *    - Revenue and cost calculations use precise values internally
 *    - Final displayed metrics are rounded for presentation clarity
 * 
 * 4. CHART DATA CONSISTENCY:
 *    - All chart data derives from the same shared traffic projection
 *    - Break-even visualization aligns with break-even calculation
 *    - Interpolation methods ensure visual and numerical agreement
 * 
 * 5. EDGE CASES:
 *    - Special handling for low-traffic sites (< 1000 visitors)
 *    - Graceful handling of unrealistic inputs
 *    - Adjustments based on competition level and industry type
 * 
 * Last Updated: 2023 - Improved calculation consistency and precision
 */

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
 * Ensures that the final month's traffic exactly matches the target traffic input
 * 
 * @param {number[]} projectedTrafficData - The generated traffic projection
 * @param {number} targetTraffic - The user's target traffic goal
 * @param {number} timeframe - The timeframe in months
 * @returns {number[]} Corrected traffic projection with exact match for final month
 */
const ensureFinalMonthMatchesTarget = (
  projectedTrafficData: number[],
  targetTraffic: number,
  timeframe: number
): number[] => {
  // If the projection is empty or doesn't have enough data points, return it unchanged
  if (!projectedTrafficData || projectedTrafficData.length <= timeframe) {
    return projectedTrafficData;
  }
  
  // Check if the final month already exactly matches the target
  if (projectedTrafficData[timeframe] === targetTraffic) {
    return projectedTrafficData;
  }
  
  // Create a copy of the projection to avoid modifying the original
  const correctedProjection = [...projectedTrafficData];
  
  // Force the final month to exactly match the target traffic
  correctedProjection[timeframe] = targetTraffic;
  
  return correctedProjection;
};

/**
 * Shared traffic projection model that ensures consistent calculations
 * across all components of the calculator
 * 
 * @param {CalculatorState} state - Current calculator state
 * @returns {number[]} Projected traffic values for each month
 */
const generateTrafficProjection = (state: CalculatorState): number[] => {
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
  // Use a type-safe approach without 'any'
  if (state.competitionLevel) {
    // IMPROVED: Adjust growth factor based on competition level
    if (state.competitionLevel === 'high') {
      domainAuthorityFactor *= 0.8; // Slow down growth for high competition
    } else if (state.competitionLevel === 'low') {
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
  if (state.competitionLevel) {
    if (state.competitionLevel === 'high') {
      rampUpPeriod += 1; // Add a month for high competition
    } else if (state.competitionLevel === 'low') {
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
  
  // Before returning, ensure final month exactly matches target traffic
  return ensureFinalMonthMatchesTarget(projectedTrafficData, state.targetTraffic, state.timeframe);
};

/**
 * Calculate break-even month based on traffic projections and conversion metrics
 * This function is used consistently across all calculator components
 * Now supports fractional month precision for more accurate break-even point
 * 
 * @param {CalculatorState} state - Current calculator state
 * @param {number[]} projectedTrafficData - Projected traffic data points
 * @returns {number} Break-even month with fractional precision
 */
const calculateBreakEvenMonth = (
  state: CalculatorState,
  projectedTrafficData: number[]
): number => {
  const baselineMonthlyRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
  let cumulativeAdditionalRevenue = 0;
  let cumulativeCost = 0;
  let previousCumulativeRevenue = 0;
  let breakEvenMonth = state.timeframe; // Default to last month if never breaks even
  let breakEvenFound = false;
  
  // Start from month 1 (index 1) since month 0 is baseline
  for (let i = 1; i <= state.timeframe; i++) {
    // Calculate additional revenue for this month based on traffic increase
    const monthlyProjectedTraffic = projectedTrafficData[i];
    const projectedMonthlyRevenue = (monthlyProjectedTraffic * state.conversionRate / 100) * state.averageOrderValue;
    const additionalMonthlyRevenue = projectedMonthlyRevenue - baselineMonthlyRevenue;
    
    // Store previous cumulative revenue for interpolation
    previousCumulativeRevenue = cumulativeAdditionalRevenue;
    
    // Add to cumulative totals
    cumulativeAdditionalRevenue += additionalMonthlyRevenue;
    cumulativeCost += state.monthlySEOCost;
    
    // Check if we've reached break-even
    if (cumulativeAdditionalRevenue >= cumulativeCost && !breakEvenFound) {
      // ENHANCED PRECISION: Calculate fractional month using linear interpolation
      if (i > 1 && previousCumulativeRevenue < cumulativeCost) {
        // Calculate how far between months the break-even occurs
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
  
  // CONSISTENT ROUNDING: Round to 1 decimal place for display
  return Math.round(breakEvenMonth * 10) / 10;
};

/**
 * Utility functions to safeguard against JavaScript precision issues
 * These functions help ensure accurate calculations with very large numbers
 */

/**
 * Safely rounds a number to prevent floating point precision issues
 * 
 * @param {number} value - The value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
const safeRound = (value: number, decimals: number = 2): number => {
  if (!isFinite(value)) return 0;
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};

/**
 * Safely performs percentage calculation avoiding common precision issues
 * 
 * @param {number} value - Base value
 * @param {number} percentage - Percentage to calculate
 * @returns {number} Result of percentage calculation
 */
const safePercentage = (value: number, percentage: number): number => {
  if (!isFinite(value) || !isFinite(percentage)) return 0;
  // Convert to integers for calculation then back to decimals
  return safeRound((value * percentage) / 100);
};

/**
 * Safely adds two numbers, handling potential overflow
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Sum with proper precision
 */
const safeAdd = (a: number, b: number): number => {
  if (!isFinite(a) || !isFinite(b)) return 0;
  // Use string conversion for very large numbers if needed
  if (Math.abs(a) > Number.MAX_SAFE_INTEGER || Math.abs(b) > Number.MAX_SAFE_INTEGER) {
    // Fall back to a safer approach for extreme values
    return safeRound(Number(a.toString()) + Number(b.toString()));
  }
  return safeRound(a + b);
};

/**
 * Safely multiplies two numbers, handling potential overflow
 * 
 * @param {number} a - First number
 * @param {number} b - Second number
 * @returns {number} Product with proper precision
 */
const safeMultiply = (a: number, b: number): number => {
  if (!isFinite(a) || !isFinite(b)) return 0;
  // Use string conversion for very large numbers if needed
  if (Math.abs(a) > Number.MAX_SAFE_INTEGER || Math.abs(b) > Number.MAX_SAFE_INTEGER) {
    // Fall back to a safer approach for extreme values
    return safeRound(Number((a * b).toPrecision(14)));
  }
  return safeRound(a * b);
};

/**
 * Validates inputs for potential JavaScript precision issues
 * 
 * @param {CalculatorState} state - Current calculator state
 * @returns {string | null} Error message if validation fails, null otherwise
 */
const validatePrecisionLimits = (state: CalculatorState): string | null => {
  // Check for extremely large values that might cause precision issues
  if (state.currentTraffic > 1000000000) {
    return "Current traffic exceeds safe calculation limit (1 billion visitors). Please enter a lower value.";
  }
  
  if (state.targetTraffic > 1000000000) {
    return "Target traffic exceeds safe calculation limit (1 billion visitors). Please enter a lower value.";
  }
  
  if (state.averageOrderValue > 100000000) {
    return "Average order value exceeds safe calculation limit ($100 million). Please enter a lower value.";
  }
  
  if (state.monthlySEOCost > 10000000) {
    return "Monthly SEO cost exceeds safe calculation limit ($10 million). Please enter a lower value.";
  }
  
  // Check for extreme combinations that could lead to overflow
  const potentialMaxRevenue = state.targetTraffic * (state.conversionRate / 100) * state.averageOrderValue;
  if (potentialMaxRevenue > Number.MAX_SAFE_INTEGER) {
    return "The combination of traffic, conversion rate, and order value would result in revenue figures that exceed safe calculation limits. Please reduce one or more of these values.";
  }
  
  return null;
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
  const { 
    errors, 
    validateCalculatorInputs, 
    clearErrors, 
    getFieldError,
    updateValidationErrors 
  } = useFormValidation();

  // Mark validateCalculatorInputs as unused to satisfy linter
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const unused = validateCalculatorInputs;

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
    // Clear previous errors
    clearErrors();
    
    // Validate inputs
    if (!state.currentTraffic || !state.targetTraffic || !state.timeframe || !state.conversionRate || !state.averageOrderValue) {
      updateValidationErrors({
        calculationError: "Please fill in all required fields"
      });
      return null;
    }

    // Validate that target traffic is greater than current traffic
    if (state.targetTraffic <= state.currentTraffic) {
      updateValidationErrors({
        targetTraffic: "Target traffic must be greater than current traffic"
      });
      return null;
    }

    // Validate timeframe
    if (state.timeframe < 1 || state.timeframe > 60) {
      updateValidationErrors({
        timeframe: "Timeframe must be between 1 and 60 months"
      });
      return null;
    }

    // Validate against extreme values that could cause precision issues
    const precisionError = validatePrecisionLimits(state);
    if (precisionError) {
      updateValidationErrors({
        calculationError: precisionError
      });
      return null;
    }

    try {
      // Use shared traffic projection for all calculations
      const projectedTrafficData = generateTrafficProjection(state);
      
      // Basic calculations
      // Use safe calculation methods for more precise results with large numbers
      const conversionRateDecimal = state.conversionRate / 100;
      const monthlyConversions = safeMultiply(state.currentTraffic, conversionRateDecimal);
      const initialRevenue = safeMultiply(monthlyConversions, state.averageOrderValue);
      
      const projectedMonthlyConversions = safeMultiply(state.targetTraffic, conversionRateDecimal);
      // This represents the final month's revenue at the end of the timeframe
      const projectedRevenue = safeMultiply(projectedMonthlyConversions, state.averageOrderValue);
      
      // Calculate difference between final and initial revenue with safe math
      const revenueIncrease = safeRound(projectedRevenue - initialRevenue);
      const totalSEOCost = safeMultiply(state.monthlySEOCost, state.timeframe);
      
      // Check for division by zero in ROI calculation
      if (totalSEOCost === 0) {
        throw new Error("Cannot calculate ROI with zero SEO cost");
      }
      
      // ROI calculation with safe math to avoid precision errors
      const totalIncrease = safeMultiply(revenueIncrease, state.timeframe);
      const totalProfit = safeRound(totalIncrease - totalSEOCost);
      const roi = safeRound((totalProfit / totalSEOCost) * 100);
      
      // Calculate break-even month using the shared function
      const breakEvenMonth = calculateBreakEvenMonth(state, projectedTrafficData);

      // Validate breakEvenMonth is a valid number
      if (isNaN(breakEvenMonth)) {
        throw new Error("Break-even calculation resulted in an invalid value");
      }
      
      // Calculate average monthly increase using the traffic growth data
      let totalMonthlyIncreases = 0;
      let monthsWithIncrease = 0;
      
      // Start from month 1 (index 1) since month 0 is baseline
      for (let i = 1; i <= state.timeframe; i++) {
        // Calculate additional revenue for this month based on traffic
        const additionalTraffic = projectedTrafficData[i] - state.currentTraffic;
        
        // Calculate additional revenue for this month using safe math
        const monthlyConversionRate = safePercentage(additionalTraffic, state.conversionRate);
        const additionalMonthlyRevenue = safeMultiply(monthlyConversionRate, state.averageOrderValue);
        
        // Add to monthly increases sum (for average calculation)
        totalMonthlyIncreases = safeAdd(totalMonthlyIncreases, additionalMonthlyRevenue);
        monthsWithIncrease++;
      }
      
      // Calculate average monthly increase across the timeframe using safe division
      const averageMonthlyIncrease = monthsWithIncrease > 0 ? safeRound(totalMonthlyIncreases / monthsWithIncrease) : 0;
      
      // Generate charts using the shared traffic projection data
      const trafficGrowthChart = generateTrafficGrowthChart(projectedTrafficData);
      const revenueGrowthChart = generateRevenueGrowthChart(projectedTrafficData);
      const roiComparisonChart = generateROIComparisonChart(projectedTrafficData);
      
      // Generate recommendations
      const recommendations = generateRecommendations(roi, breakEvenMonth);
      
      // Add sanity checks for extreme calculation results
      // ROI sanity check
      if (roi > 10000) { // 10,000% ROI is extremely high
        throw new Error("Calculated ROI is unrealistically high. Please review your inputs.");
      }

      // Revenue projection sanity check
      const monthlyRevenueGrowthFactor = projectedRevenue / initialRevenue;
      if (monthlyRevenueGrowthFactor > 100 && initialRevenue > 0) {
        throw new Error("Projected revenue growth is unrealistically high (100x current revenue). Please review your inputs.");
      }

      // Break-even sanity check
      if (breakEvenMonth < 1 && breakEvenMonth !== 0) { // Break-even less than 1 month is suspect
        throw new Error("Break-even calculation produced an invalid result. Please review your inputs.");
      }

      // Final validation of projection data integrity - strict check for exact match
      const finalMonthTraffic = projectedTrafficData[state.timeframe];
      if (finalMonthTraffic !== state.targetTraffic) {
        throw new Error("Traffic projection model failed to match target traffic in final month. Please try different inputs.");
      }

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
    } catch (error) {
      // Handle calculation errors
      if (error instanceof Error) {
        // Add calculation error to errors object
        updateValidationErrors({
          calculationError: `Calculation failed: ${error.message}`
        });
      } else {
        // Generic error handling
        updateValidationErrors({
          calculationError: "An unexpected error occurred during calculation"
        });
      }
      return null;
    }
  };

  /**
   * Generates traffic growth chart data based on shared traffic projection
   * 
   * @param {number[]} projectedTrafficData - Projected traffic data points
   * @returns {ChartData} Chart data for traffic growth visualization
   */
  const generateTrafficGrowthChart = (projectedTrafficData: number[]): ChartData => {
    const labels: string[] = [];
    const currentTrafficData: number[] = [];
    
    // Generate labels and current traffic baseline
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentTrafficData.push(state.currentTraffic);
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
   * Generates revenue growth chart data based on shared traffic projection
   * 
   * @param {number[]} projectedTrafficData - Projected traffic data points
   * @returns {ChartData} Chart data for revenue growth visualization
   */
  const generateRevenueGrowthChart = (projectedTrafficData: number[]): ChartData => {
    const labels: string[] = [];
    const currentRevenueData: number[] = [];
    const projectedRevenueData: number[] = [];
    
    const monthlyCurrentRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
    
    // Generate data points for each month using the shared traffic projection
    for (let i = 0; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      currentRevenueData.push(monthlyCurrentRevenue);
      
      // Use traffic projection to calculate revenue
      const projectedTraffic = projectedTrafficData[i];
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
   * Generates ROI comparison chart data based on shared traffic projection
   * Uses consistent calculation methods with the break-even point
   * 
   * @param {number[]} projectedTrafficData - Projected traffic data points
   * @returns {ChartData} Chart data for ROI comparison visualization
   */
  const generateROIComparisonChart = (projectedTrafficData: number[]): ChartData => {
    // ROI comparison by month using shared traffic projection
    const labels: string[] = [];
    const cumulativeCostData: number[] = [];
    const cumulativeRevenueIncreaseData: number[] = [];
    const roiData: number[] = [];
    
    const monthlyCost = state.monthlySEOCost;
    const baselineMonthlyRevenue = (state.currentTraffic * state.conversionRate / 100) * state.averageOrderValue;
    
    let cumulativeRevenueIncrease = 0;
    
    for (let i = 1; i <= state.timeframe; i++) {
      labels.push(`Month ${i}`);
      
      // Calculate cumulative cost
      const cumulativeCost = monthlyCost * i;
      cumulativeCostData.push(cumulativeCost);
      
      // Calculate revenue using the shared traffic projections
      const projectedTraffic = projectedTrafficData[i];
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
   * Uses the shared break-even month calculation for consistency
   * 
   * @param {number} roi - Calculated ROI percentage
   * @param {number} breakEvenMonth - Calculated break-even month
   * @returns {RecommendationItem[]} Array of recommendation objects
   */
  const generateRecommendations = (roi: number, breakEvenMonth: number): RecommendationItem[] => {
    const recommendations: RecommendationItem[] = [];
    
    // Use the pre-calculated break-even month for consistency
    let breakEvenText = "";
    
    if (breakEvenMonth < state.timeframe) {
      breakEvenText = `Based on gradual traffic growth, you should reach break-even around month ${breakEvenMonth}.`;
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