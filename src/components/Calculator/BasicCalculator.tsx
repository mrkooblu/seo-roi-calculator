import React from 'react';
import styled from 'styled-components';
import { CalculatorState } from '../../types';
import FormGroup from '../Form/FormGroup';
import InputGroup from '../Form/InputGroup';

interface BasicCalculatorProps {
  state: CalculatorState;
  updateState: (updates: Partial<CalculatorState>) => void;
  getFieldError: (fieldName: string) => string | undefined;
}

/**
 * Basic calculator component that collects essential metrics for ROI calculation
 */
const BasicCalculator: React.FC<BasicCalculatorProps> = ({ state, updateState, getFieldError }) => {
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
        <FormGroup
          id="currentTraffic"
          label="Current Monthly Organic Traffic"
          tooltip="The number of monthly visitors coming to your site through organic search"
          error={getFieldError('currentTraffic')}
          required
        >
          <InputGroup
            id="currentTraffic"
            name="currentTraffic"
            type="number"
            value={state.currentTraffic || ''}
            onChange={handleInputChange}
            placeholder="e.g. 1000"
            min="1"
            error={getFieldError('currentTraffic')}
            aria-invalid={!!getFieldError('currentTraffic')}
            aria-describedby={getFieldError('currentTraffic') ? 'currentTraffic-error' : undefined}
          />
          {getFieldError('currentTraffic') && (
            <ErrorText id="currentTraffic-error">{getFieldError('currentTraffic')}</ErrorText>
          )}
        </FormGroup>
        
        <FormGroup
          id="targetTraffic"
          label="Target Monthly Organic Traffic"
          tooltip="Your goal for monthly organic traffic after SEO improvements"
          error={getFieldError('targetTraffic')}
          required
        >
          <InputGroup
            id="targetTraffic"
            name="targetTraffic"
            type="number"
            value={state.targetTraffic || ''}
            onChange={handleInputChange}
            placeholder="e.g. 2000"
            min={state.currentTraffic + 1}
            error={getFieldError('targetTraffic')}
            aria-invalid={!!getFieldError('targetTraffic')}
            aria-describedby={getFieldError('targetTraffic') ? 'targetTraffic-error' : undefined}
          />
          {getFieldError('targetTraffic') && (
            <ErrorText id="targetTraffic-error">{getFieldError('targetTraffic')}</ErrorText>
          )}
        </FormGroup>
        
        <FormGroup
          id="conversionRate"
          label="Conversion Rate (%)"
          tooltip="The percentage of visitors who complete a desired action"
          error={getFieldError('conversionRate')}
          required
        >
          <InputGroup
            id="conversionRate"
            name="conversionRate"
            type="number"
            value={state.conversionRate || ''}
            onChange={handleInputChange}
            placeholder="e.g. 2"
            min="0.1"
            max="100"
            step="0.1"
            error={getFieldError('conversionRate')}
            aria-invalid={!!getFieldError('conversionRate')}
            aria-describedby={getFieldError('conversionRate') ? 'conversionRate-error' : undefined}
          />
          {getFieldError('conversionRate') && (
            <ErrorText id="conversionRate-error">{getFieldError('conversionRate')}</ErrorText>
          )}
        </FormGroup>
        
        <FormGroup
          id="averageOrderValue"
          label="Average Order Value ($)"
          tooltip="The average amount spent each time a customer places an order"
          error={getFieldError('averageOrderValue')}
          required
        >
          <InputGroup
            id="averageOrderValue"
            name="averageOrderValue"
            type="number"
            value={state.averageOrderValue || ''}
            onChange={handleInputChange}
            placeholder="e.g. 100"
            min="1"
            step="0.01"
            error={getFieldError('averageOrderValue')}
            aria-invalid={!!getFieldError('averageOrderValue')}
            aria-describedby={getFieldError('averageOrderValue') ? 'averageOrderValue-error' : undefined}
          />
          {getFieldError('averageOrderValue') && (
            <ErrorText id="averageOrderValue-error">{getFieldError('averageOrderValue')}</ErrorText>
          )}
        </FormGroup>
        
        <FormGroup
          id="monthlySEOCost"
          label="Monthly SEO Cost ($)"
          tooltip="Your monthly investment in SEO services"
          error={getFieldError('monthlySEOCost')}
          required
        >
          <InputGroup
            id="monthlySEOCost"
            name="monthlySEOCost"
            type="number"
            value={state.monthlySEOCost || ''}
            onChange={handleInputChange}
            placeholder="e.g. 1000"
            min="1"
            step="0.01"
            error={getFieldError('monthlySEOCost')}
            aria-invalid={!!getFieldError('monthlySEOCost')}
            aria-describedby={getFieldError('monthlySEOCost') ? 'monthlySEOCost-error' : undefined}
          />
          {getFieldError('monthlySEOCost') && (
            <ErrorText id="monthlySEOCost-error">{getFieldError('monthlySEOCost')}</ErrorText>
          )}
        </FormGroup>
        
        <FormGroup
          id="timeframe"
          label="Timeframe (Months)"
          tooltip="The period over which you want to calculate ROI"
          error={getFieldError('timeframe')}
          required
        >
          <InputGroup
            id="timeframe"
            name="timeframe"
            type="number"
            value={state.timeframe || ''}
            onChange={handleInputChange}
            placeholder="e.g. 12"
            min="1"
            max="60"
            error={getFieldError('timeframe')}
            aria-invalid={!!getFieldError('timeframe')}
            aria-describedby={getFieldError('timeframe') ? 'timeframe-error' : undefined}
          />
          {getFieldError('timeframe') && (
            <ErrorText id="timeframe-error">{getFieldError('timeframe')}</ErrorText>
          )}
        </FormGroup>
      </FormGrid>
    </BasicCalculatorContainer>
  );
};

const BasicCalculatorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

export default BasicCalculator; 