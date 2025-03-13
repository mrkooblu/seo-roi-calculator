import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import BasicCalculator from './BasicCalculator';
import AdvancedCalculator from './AdvancedCalculator';
import Results from '../Results';
import LoadingState from '../common/LoadingState';
import { CalculationResults } from '../../types';
import { useCalculatorState } from '../../hooks/useCalculatorState';

/**
 * Main Calculator component that manages calculator modes and result calculation
 */
const Calculator: React.FC = () => {
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'advanced'>('basic');
  const { state, errors, updateState, resetState, calculateResults, getFieldError } = useCalculatorState();
  const [results, setResults] = useState<CalculationResults | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleModeToggle = (mode: 'basic' | 'advanced') => {
    setCalculatorMode(mode);
  };

  const handleCalculate = () => {
    setIsCalculating(true);
    
    // Simulate calculation delay for better UX
    setTimeout(() => {
      const calculationResults = calculateResults();
      setIsCalculating(false);
      
      if (calculationResults) {
        setResults(calculationResults);
        // Smooth scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
        }, 100);
      }
    }, 1200);
  };

  const handleReset = () => {
    resetState();
    setResults(null);
  };

  return (
    <CalculatorWrapper>
      <CalculatorTabs>
        <CalculatorTab 
          $active={calculatorMode === 'basic'} 
          onClick={() => handleModeToggle('basic')}
        >
          Basic Calculator
        </CalculatorTab>
        <CalculatorTab 
          $active={calculatorMode === 'advanced'} 
          onClick={() => handleModeToggle('advanced')}
        >
          Advanced Calculator
        </CalculatorTab>
      </CalculatorTabs>

      <CalculatorContent>
        <CalculatorForm>
          {calculatorMode === 'basic' ? (
            <BasicCalculator 
              state={state} 
              updateState={updateState} 
              getFieldError={getFieldError}
            />
          ) : (
            <AdvancedCalculator 
              state={state} 
              updateState={updateState} 
              getFieldError={getFieldError}
            />
          )}

          <ButtonGroup>
            <Button 
              $primary 
              onClick={handleCalculate}
              disabled={isCalculating || Object.keys(errors).length > 0}
            >
              {isCalculating ? 'Calculating...' : 'Calculate ROI'}
            </Button>
            <Button onClick={handleReset} disabled={isCalculating}>Reset</Button>
          </ButtonGroup>

          {Object.keys(errors).length > 0 && (
            <ErrorSummary>
              <ErrorTitle>Please fix the following errors:</ErrorTitle>
              <ErrorList>
                {Object.entries(errors).map(([field, message]) => (
                  <ErrorItem key={field}>{message}</ErrorItem>
                ))}
              </ErrorList>
            </ErrorSummary>
          )}
        </CalculatorForm>
      </CalculatorContent>

      {isCalculating && <LoadingState />}
      
      {results && !isCalculating && (
        <div id="results-section">
          <Results results={results} />
        </div>
      )}
    </CalculatorWrapper>
  );
};

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface TabProps {
  $active: boolean;
}

interface ButtonProps {
  $primary?: boolean;
  disabled?: boolean;
}

const CalculatorWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  animation: ${fadeIn} 0.6s ease-out;
`;

const CalculatorTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  border-top-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-top-right-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.card};
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const CalculatorTab = styled.button<TabProps>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${(props) => props.$active ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => props.$active ? 'white' : props.theme.colors.text.secondary};
  border: none;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  flex: 1;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${(props) => props.$active ? props.theme.colors.primary : props.theme.colors.background};
  }
`;

const CalculatorContent = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.card};
  border-bottom-left-radius: ${({ theme }) => theme.borderRadius.md};
  border-bottom-right-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const CalculatorForm = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${(props) => props.$primary ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => props.$primary ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.$primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: ${(props) => props.disabled ? 'not-allowed' : 'pointer'};
  transition: ${({ theme }) => theme.transitions.default};
  opacity: ${(props) => props.disabled ? 0.6 : 1};

  &:hover {
    background-color: ${(props) => props.disabled ? (props.$primary ? props.theme.colors.primary : 'transparent') : 
      (props.$primary ? props.theme.colors.primary : props.theme.colors.background)};
    opacity: ${(props) => props.disabled ? 0.6 : (props.$primary ? 0.9 : 1)};
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ErrorSummary = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.danger};
  animation: ${fadeIn} 0.5s ease-out;
`;

const ErrorTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ErrorList = styled.ul`
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

const ErrorItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.danger};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

export default Calculator; 