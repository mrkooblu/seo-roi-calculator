import { useState } from 'react';
import { CalculatorState, ValidationErrors } from '../types';

/**
 * Custom hook for form validation
 * Validates calculator inputs and maintains error state
 */
const useFormValidation = () => {
  const [errors, setErrors] = useState<ValidationErrors>({});

  /**
   * Validates calculator inputs and updates error state
   * 
   * @param {CalculatorState} state - Current calculator state to validate
   * @returns {boolean} Whether validation passed
   */
  const validateCalculatorInputs = (state: CalculatorState): boolean => {
    const newErrors: ValidationErrors = {};
    
    // Validate basic calculator inputs
    if (state.currentTraffic <= 0) {
      newErrors.currentTraffic = 'Current traffic must be greater than 0';
    }
    
    if (state.targetTraffic <= 0) {
      newErrors.targetTraffic = 'Target traffic must be greater than 0';
    } else if (state.targetTraffic <= state.currentTraffic) {
      newErrors.targetTraffic = 'Target traffic should be greater than current traffic';
    }
    
    if (state.conversionRate <= 0) {
      newErrors.conversionRate = 'Conversion rate must be greater than 0';
    } else if (state.conversionRate > 100) {
      newErrors.conversionRate = 'Conversion rate cannot exceed 100%';
    }
    
    if (state.averageOrderValue <= 0) {
      newErrors.averageOrderValue = 'Average order value must be greater than 0';
    }
    
    if (state.monthlySEOCost <= 0) {
      newErrors.monthlySEOCost = 'Monthly SEO cost must be greater than 0';
    }
    
    // Validate advanced calculator inputs
    if (state.organicCTR !== undefined) {
      if (state.organicCTR <= 0) {
        newErrors.organicCTR = 'Organic CTR must be greater than 0';
      } else if (state.organicCTR > 100) {
        newErrors.organicCTR = 'Organic CTR cannot exceed 100%';
      }
    }
    
    if (state.keywordDifficulty !== undefined) {
      if (state.keywordDifficulty < 0) {
        newErrors.keywordDifficulty = 'Keyword difficulty cannot be negative';
      } else if (state.keywordDifficulty > 100) {
        newErrors.keywordDifficulty = 'Keyword difficulty cannot exceed 100';
      }
    }
    
    if (state.timeframe <= 0) {
      newErrors.timeframe = 'Timeframe must be greater than 0';
    }
    
    if (state.contentInvestment !== undefined && 
        state.linkBuildingInvestment !== undefined && 
        state.technicalSEOInvestment !== undefined) {
      const total = state.contentInvestment + state.linkBuildingInvestment + state.technicalSEOInvestment;
      if (total !== 100) {
        newErrors.contentInvestment = 'Investment allocations must total 100%';
        newErrors.linkBuildingInvestment = 'Investment allocations must total 100%';
        newErrors.technicalSEOInvestment = 'Investment allocations must total 100%';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Clears all validation errors
   */
  const clearErrors = () => {
    setErrors({});
  };

  /**
   * Gets the error message for a specific field
   * 
   * @param {keyof ValidationErrors} field - The field name to get error for
   * @returns {string | undefined} Error message or undefined if no error
   */
  const getFieldError = (field: keyof ValidationErrors): string | undefined => {
    return errors[field];
  };

  return {
    errors,
    validateCalculatorInputs,
    clearErrors,
    getFieldError,
  };
};

export default useFormValidation; 