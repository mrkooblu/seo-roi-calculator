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
    if (state.currentTraffic === undefined || state.currentTraffic === null) {
      newErrors.currentTraffic = 'Current traffic is required';
    } else if (state.currentTraffic === 0) {
      newErrors.currentTraffic = 'Current traffic cannot be zero';
    } else if (state.currentTraffic < 0) {
      newErrors.currentTraffic = 'Current traffic cannot be negative';
    } else if (state.currentTraffic > 10000000) {
      newErrors.currentTraffic = 'Current traffic value is unrealistically high';
    }
    
    if (state.targetTraffic === undefined || state.targetTraffic === null) {
      newErrors.targetTraffic = 'Target traffic is required';
    } else if (state.targetTraffic === 0) {
      newErrors.targetTraffic = 'Target traffic cannot be zero';
    } else if (state.targetTraffic < 0) {
      newErrors.targetTraffic = 'Target traffic cannot be negative';
    } else if (state.targetTraffic <= state.currentTraffic) {
      newErrors.targetTraffic = 'Target traffic must be greater than current traffic';
    } else if (state.targetTraffic > 20000000) {
      newErrors.targetTraffic = 'Target traffic value is unrealistically high';
    }
    
    if (state.conversionRate === undefined || state.conversionRate === null) {
      newErrors.conversionRate = 'Conversion rate is required';
    } else if (state.conversionRate === 0) {
      newErrors.conversionRate = 'Conversion rate cannot be zero';
    } else if (state.conversionRate < 0) {
      newErrors.conversionRate = 'Conversion rate cannot be negative';
    } else if (state.conversionRate > 100) {
      newErrors.conversionRate = 'Conversion rate cannot exceed 100%';
    }
    
    if (state.averageOrderValue === undefined || state.averageOrderValue === null) {
      newErrors.averageOrderValue = 'Average order value is required';
    } else if (state.averageOrderValue === 0) {
      newErrors.averageOrderValue = 'Average order value cannot be zero';
    } else if (state.averageOrderValue < 0) {
      newErrors.averageOrderValue = 'Average order value cannot be negative';
    } else if (state.averageOrderValue > 1000000) {
      newErrors.averageOrderValue = 'Average order value is unrealistically high';
    }
    
    if (state.monthlySEOCost === undefined || state.monthlySEOCost === null) {
      newErrors.monthlySEOCost = 'Monthly SEO cost is required';
    } else if (state.monthlySEOCost === 0) {
      newErrors.monthlySEOCost = 'Monthly SEO cost cannot be zero';
    } else if (state.monthlySEOCost < 0) {
      newErrors.monthlySEOCost = 'Monthly SEO cost cannot be negative';
    } else if (state.monthlySEOCost > 1000000) {
      newErrors.monthlySEOCost = 'Monthly SEO cost is unrealistically high';
    }
    
    // Validate advanced calculator inputs
    if (state.keywordDifficulty !== undefined && state.keywordDifficulty !== null) {
      if (state.keywordDifficulty < 1) {
        newErrors.keywordDifficulty = 'Keyword difficulty must be at least 1';
      } else if (state.keywordDifficulty > 100) {
        newErrors.keywordDifficulty = 'Keyword difficulty cannot exceed 100';
      }
    }
    
    if (state.timeframe === undefined || state.timeframe === null) {
      newErrors.timeframe = 'Timeframe is required';
    } else if (state.timeframe === 0) {
      newErrors.timeframe = 'Timeframe cannot be zero';
    } else if (state.timeframe < 0) {
      newErrors.timeframe = 'Timeframe cannot be negative';
    } else if (state.timeframe > 60) {
      newErrors.timeframe = 'Timeframe cannot exceed 60 months';
    }
    
    // Validate investment percentages in advanced calculator
    if (state.contentInvestment !== undefined && 
        state.linkBuildingInvestment !== undefined && 
        state.technicalSEOInvestment !== undefined) {
      
      // Check for negative values
      if (state.contentInvestment < 0) {
        newErrors.contentInvestment = 'Content investment cannot be negative';
      }
      
      if (state.linkBuildingInvestment < 0) {
        newErrors.linkBuildingInvestment = 'Link building investment cannot be negative';
      }
      
      if (state.technicalSEOInvestment < 0) {
        newErrors.technicalSEOInvestment = 'Technical SEO investment cannot be negative';
      }
      
      // Check total equals 100%
      const total = state.contentInvestment + state.linkBuildingInvestment + state.technicalSEOInvestment;
      if (total !== 100) {
        if (!newErrors.contentInvestment) {
          newErrors.contentInvestment = `Investment allocations total ${total}%, but must equal 100%`;
        }
        if (!newErrors.linkBuildingInvestment) {
          newErrors.linkBuildingInvestment = `Investment allocations total ${total}%, but must equal 100%`;
        }
        if (!newErrors.technicalSEOInvestment) {
          newErrors.technicalSEOInvestment = `Investment allocations total ${total}%, but must equal 100%`;
        }
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

  /**
   * Updates validation errors directly
   * 
   * @param {ValidationErrors} newErrors - New errors to add to the errors object
   */
  const updateValidationErrors = (newErrors: ValidationErrors) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      ...newErrors
    }));
  };

  return {
    errors,
    validateCalculatorInputs,
    clearErrors,
    getFieldError,
    updateValidationErrors,
  };
};

export default useFormValidation; 