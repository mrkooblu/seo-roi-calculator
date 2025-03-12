import React from 'react';
import styled from 'styled-components';
import { CalculatorState } from '../../types';

interface BasicCalculatorProps {
  state: CalculatorState;
  updateState: (updates: Partial<CalculatorState>) => void;
}

const BasicCalculator: React.FC<BasicCalculatorProps> = ({ state, updateState }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (!isNaN(numValue) || value === '') {
      updateState({ [name]: value === '' ? 0 : numValue });
    }
  };

  return (
    <BasicCalculatorContainer>
      <FormTitle>Basic SEO ROI Calculator</FormTitle>
      <FormDescription>
        Enter your current traffic and conversion metrics to calculate the potential ROI of your SEO investment.
      </FormDescription>
      
      <FormGrid>
        <FormGroup>
          <Label htmlFor="currentTraffic">Current Monthly Organic Traffic</Label>
          <Input
            id="currentTraffic"
            name="currentTraffic"
            type="number"
            value={state.currentTraffic || ''}
            onChange={handleInputChange}
            placeholder="e.g. 1000"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="targetTraffic">Target Monthly Organic Traffic</Label>
          <Input
            id="targetTraffic"
            name="targetTraffic"
            type="number"
            value={state.targetTraffic || ''}
            onChange={handleInputChange}
            placeholder="e.g. 2000"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
          <Input
            id="conversionRate"
            name="conversionRate"
            type="number"
            value={state.conversionRate || ''}
            onChange={handleInputChange}
            placeholder="e.g. 2"
            step="0.1"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
          <Input
            id="averageOrderValue"
            name="averageOrderValue"
            type="number"
            value={state.averageOrderValue || ''}
            onChange={handleInputChange}
            placeholder="e.g. 100"
            step="0.01"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="monthlySEOCost">Monthly SEO Investment ($)</Label>
          <Input
            id="monthlySEOCost"
            name="monthlySEOCost"
            type="number"
            value={state.monthlySEOCost || ''}
            onChange={handleInputChange}
            placeholder="e.g. 1000"
            step="0.01"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="timeframe">Timeframe (Months)</Label>
          <Input
            id="timeframe"
            name="timeframe"
            type="number"
            value={state.timeframe || ''}
            onChange={handleInputChange}
            placeholder="e.g. 12"
            min="1"
            max="60"
          />
        </FormGroup>
      </FormGrid>
    </BasicCalculatorContainer>
  );
};

const BasicCalculatorContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const FormTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Input = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
`;

export default BasicCalculator; 