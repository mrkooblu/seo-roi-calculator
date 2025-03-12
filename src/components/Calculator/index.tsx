import React, { useState } from 'react';
import styled from 'styled-components';
import BasicCalculator from './BasicCalculator';
import AdvancedCalculator from './AdvancedCalculator';
import Results from '../Results';
import { CalculationResults } from '../../types';
import { useCalculatorState } from '../../hooks/useCalculatorState';

const Calculator: React.FC = () => {
  const [calculatorMode, setCalculatorMode] = useState<'basic' | 'advanced'>('basic');
  const { state, updateState, resetState, calculateResults } = useCalculatorState();
  const [results, setResults] = useState<CalculationResults | null>(null);

  const handleModeToggle = (mode: 'basic' | 'advanced') => {
    setCalculatorMode(mode);
  };

  const handleCalculate = () => {
    const calculationResults = calculateResults();
    setResults(calculationResults);
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
          <BasicCalculator state={state} updateState={updateState} />
        ) : (
          <AdvancedCalculator state={state} updateState={updateState} />
        )}

        <ButtonGroup>
          <Button $primary onClick={handleCalculate}>Calculate ROI</Button>
          <Button onClick={handleReset}>Reset</Button>
        </ButtonGroup>
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

export default Calculator; 