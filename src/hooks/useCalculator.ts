import { useState } from 'react';
import { 
  CalculatorInputs, 
  AdvancedCalculatorInputs, 
  CalculatorState, 
  CalculatorTab 
} from '../types/calculator';
import { 
  ROIResults 
} from '../types/results';
import { 
  calculateROI as calculateROIUtil, 
  calculateAdvancedROI as calculateAdvancedROIUtil, 
  generateChartData, 
  generateRecommendations 
} from '../utils/calculations';
import { ValidationErrors } from '../types/forms';

// Default values for the calculator
const defaultCalculatorInputs: CalculatorInputs = {
  keywords: 0,
  avgMonthlySV: 0,
  clickThroughRate: 3.5,
  conversionRate: 2.5,
  avgOrderValue: 0,
  seoInvestment: 0,
  lifetimeValueMultiplier: 1,
  profitMargin: 50,
  timePeriod: 12,
  advancedOptionsVisible: false
};

const defaultAdvancedInputs: AdvancedCalculatorInputs = {
  seoGoal: 'sales',
  currentRankings: 'medium',
  competitionLevel: 'medium',
  contentInvestment: 0,
  linkBuildingInvestment: 0,
  technicalSEOInvestment: 0,
  localSEOInvestment: 0,
  toolsInvestment: 0
};

export const useCalculator = () => {
  // Combined state for all calculator inputs and settings
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    ...defaultCalculatorInputs,
    ...defaultAdvancedInputs,
    activeTab: 'basic',
    hasCalculated: false
  });

  // State for validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});

  // State for calculation results
  const [results, setResults] = useState<ROIResults | null>(null);

  // Handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value, type } = e.target;
    
    // Convert to number if the input type is number
    const processedValue = type === 'number' ? 
      (value === '' ? 0 : parseFloat(value)) : 
      value;
    
    setCalculatorState(prev => ({
      ...prev,
      [id]: processedValue
    }));

    // Clear error for this field if exists
    if (errors[id]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  // Toggle advanced options visibility
  const toggleAdvancedOptions = () => {
    setCalculatorState(prev => ({
      ...prev,
      advancedOptionsVisible: !prev.advancedOptionsVisible
    }));
  };

  // Switch calculator tab
  const switchTab = (tab: CalculatorTab) => {
    setCalculatorState(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  // Validate form inputs
  const validateForm = (): boolean => {
    const validationErrors: ValidationErrors = {};
    
    // Required fields validation
    if (calculatorState.activeTab === 'basic') {
      if (!calculatorState.keywords) {
        validationErrors.keywords = 'Please enter number of keywords';
      }
      if (!calculatorState.avgMonthlySV) {
        validationErrors.avgMonthlySV = 'Please enter average monthly search volume';
      }
      if (!calculatorState.avgOrderValue) {
        validationErrors.avgOrderValue = 'Please enter average order value';
      }
      if (!calculatorState.seoInvestment) {
        validationErrors.seoInvestment = 'Please enter SEO investment amount';
      }
    } else {
      // For advanced tab, we need to validate the investment breakdown
      const totalInvestment = 
        calculatorState.contentInvestment +
        calculatorState.linkBuildingInvestment +
        calculatorState.technicalSEOInvestment +
        calculatorState.localSEOInvestment +
        calculatorState.toolsInvestment;
        
      if (totalInvestment <= 0) {
        validationErrors.contentInvestment = 'Please enter at least one investment amount';
      }
    }

    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  // Calculate ROI for basic calculator
  const performBasicROICalculation = () => {
    if (!validateForm()) return;

    const calculationResults = calculateROIUtil(calculatorState);
    
    const chartData = generateChartData(
      calculatorState.timePeriod,
      calculatorState.seoInvestment,
      calculationResults.monthlyProfit
    );

    const recommendations = generateRecommendations(
      calculationResults.monthlyROI,
      calculationResults.breakEvenPoint,
      calculatorState.conversionRate,
      calculatorState.clickThroughRate,
      calculatorState.keywords
    );

    setResults({
      calculations: calculationResults,
      chartData,
      recommendations
    });

    setCalculatorState(prev => ({
      ...prev,
      hasCalculated: true
    }));
  };

  // Calculate ROI for advanced calculator
  const performAdvancedROICalculation = () => {
    if (!validateForm()) return;

    // First update the basic inputs based on advanced selection
    const updatedInputs = calculateAdvancedROIUtil(calculatorState, calculatorState);
    
    // Update the state with new values
    setCalculatorState(prev => ({
      ...prev,
      ...updatedInputs
    }));

    // Then calculate with the updated values
    const calculationResults = calculateROIUtil(updatedInputs);
    
    const chartData = generateChartData(
      updatedInputs.timePeriod,
      updatedInputs.seoInvestment,
      calculationResults.monthlyProfit
    );

    const recommendations = generateRecommendations(
      calculationResults.monthlyROI,
      calculationResults.breakEvenPoint,
      updatedInputs.conversionRate,
      updatedInputs.clickThroughRate,
      updatedInputs.keywords
    );

    setResults({
      calculations: calculationResults,
      chartData,
      recommendations
    });

    // Switch to basic tab to show results
    setCalculatorState(prev => ({
      ...prev,
      activeTab: 'basic',
      hasCalculated: true
    }));
  };

  // Calculate ROI based on active tab
  const calculateROI = () => {
    if (calculatorState.activeTab === 'basic') {
      performBasicROICalculation();
    } else {
      performAdvancedROICalculation();
    }
  };

  // Reset the calculator
  const resetCalculator = () => {
    setCalculatorState({
      ...defaultCalculatorInputs,
      ...defaultAdvancedInputs,
      activeTab: 'basic',
      hasCalculated: false
    });
    setResults(null);
    setErrors({});
  };

  return {
    calculatorState,
    errors,
    results,
    handleInputChange,
    toggleAdvancedOptions,
    switchTab,
    calculateROI,
    resetCalculator
  };
}; 