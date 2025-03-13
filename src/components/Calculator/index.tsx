import React, { useState } from 'react';
import styled from 'styled-components';
import BasicCalculator from './BasicCalculator';
import AdvancedCalculator from './AdvancedCalculator';
import Results from '../Results';
import { CalculationResults } from '../../types';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const Calculator: React.FC = () => {
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'advanced'>('basic');
  const { state, errors, updateState, resetState, calculateResults, getFieldError } = useCalculatorState();
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleModeToggle = (mode: 'basic' | 'advanced') => {
    setCalculatorMode(mode);
  };

  const handleCalculate = () => {
    const calculationResults = calculateResults();
    if (calculationResults) {
      setResults(calculationResults);
    }
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
          <Button $primary onClick={handleCalculate}>Calculate ROI</Button>
          <Button onClick={handleReset}>Reset</Button>
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
      </CalculatorContent>

      {results && <Results results={results} />}
    </CalculatorWrapper>
  );
};

interface TabProps {
  $active: boolean;
}

interface ButtonProps {
  $primary?: boolean;
}

const CalculatorWrapper = styled.div`
  margin: ${({ theme }) => theme.spacing.xl} 0;
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  overflow: hidden;
`;

const CalculatorTabs = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
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
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const Button = styled.button<ButtonProps>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background-color: ${(props) => props.$primary ? props.theme.colors.primary : 'transparent'};
  color: ${(props) => props.$primary ? 'white' : props.theme.colors.text.primary};
  border: 1px solid ${(props) => props.$primary ? 'transparent' : props.theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.default};

  &:hover {
    background-color: ${(props) => props.$primary ? props.theme.colors.primary : props.theme.colors.background};
    opacity: ${(props) => props.$primary ? 0.9 : 1};
  }
`;

const ErrorSummary = styled.div`
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: rgba(239, 68, 68, 0.1);
  border: 1px solid ${({ theme }) => theme.colors.danger};
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