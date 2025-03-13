import React from 'react';
import styled from 'styled-components';
import { CalculatorState } from '../../types';
import FormGroup from '../Form/FormGroup';
import InputGroup from '../Form/InputGroup';

interface AdvancedCalculatorProps {
  state: CalculatorState;
  updateState: (updates: Partial<CalculatorState>) => void;
  getFieldError: (fieldName: string) => string | undefined;
}

const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({ state, updateState, getFieldError }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (e.target.type === 'number') {
      const numValue = parseFloat(value);
      if (!isNaN(numValue) || value === '') {
        updateState({ [name]: value === '' ? 0 : numValue });
      }
    } else {
      updateState({ [name]: value });
    }
  };

  return (
    <AdvancedCalculatorContainer>
      <FormTitle>Advanced SEO ROI Calculator</FormTitle>
      <FormDescription>
        Fine-tune your SEO ROI calculation with additional metrics and industry-specific factors.
      </FormDescription>
      
      <SectionTitle>Traffic & Conversion Metrics</SectionTitle>
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
            error={getFieldError('currentTraffic')}
          />
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
            error={getFieldError('targetTraffic')}
          />
        </FormGroup>
        
        <FormGroup
          id="organicCTR"
          label="Organic CTR (%)"
          tooltip="The percentage of search impressions that result in clicks to your site. Average is 27.6% for position #1, 15% for #2, 11% for #3."
          error={getFieldError('organicCTR')}
        >
          <InputGroup
            id="organicCTR"
            name="organicCTR"
            type="number"
            value={state.organicCTR || ''}
            onChange={handleInputChange}
            placeholder="e.g. 27.6"
            step="0.1"
            suffix="%"
            error={getFieldError('organicCTR')}
          />
        </FormGroup>
        
        <FormGroup
          id="conversionRate"
          label="Conversion Rate (%)"
          tooltip="The percentage of visitors who complete a desired action"
          helperText="Average rates range from 1-5%"
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
            step="0.1"
            suffix="%"
            error={getFieldError('conversionRate')}
          />
        </FormGroup>
        
        <FormGroup
          id="averageOrderValue"
          label="Average Order Value ($)"
          tooltip="The average amount customers spend per transaction"
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
            step="0.01"
            prefix="$"
            error={getFieldError('averageOrderValue')}
          />
        </FormGroup>
      </FormGrid>
      
      <SectionTitle>SEO Strategy Factors</SectionTitle>
      <FormGrid>
        <FormGroup
          id="keywordDifficulty"
          label="Keyword Difficulty (1-100)"
          tooltip="How difficult it is to rank for your target keywords"
          helperText="Higher values mean more competitive keywords"
          error={getFieldError('keywordDifficulty')}
        >
          <InputGroup
            id="keywordDifficulty"
            name="keywordDifficulty"
            type="number"
            value={state.keywordDifficulty || ''}
            onChange={handleInputChange}
            placeholder="e.g. 40"
            min="1"
            max="100"
            error={getFieldError('keywordDifficulty')}
          />
        </FormGroup>
        
        <FormGroup
          id="competitionLevel"
          label="Competition Level"
          tooltip="How competitive your industry is for SEO"
          error={getFieldError('competitionLevel')}
        >
          <Select
            id="competitionLevel"
            name="competitionLevel"
            value={state.competitionLevel}
            onChange={handleInputChange}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </Select>
        </FormGroup>
        
        <FormGroup
          id="industryType"
          label="Industry Type"
          tooltip="Your business category for more relevant recommendations"
          error={getFieldError('industryType')}
        >
          <Select
            id="industryType"
            name="industryType"
            value={state.industryType}
            onChange={handleInputChange}
          >
            <option value="ecommerce">E-commerce</option>
            <option value="saas">SaaS</option>
            <option value="local">Local Business</option>
            <option value="other">Other</option>
          </Select>
        </FormGroup>
      </FormGrid>
      
      <SectionTitle>Investment Breakdown</SectionTitle>
      <InvestmentNote>These three percentages should add up to 100%</InvestmentNote>
      <FormGrid>
        <FormGroup
          id="contentInvestment"
          label="Content Investment (%)"
          tooltip="Percentage of your SEO budget allocated to content creation"
          error={getFieldError('contentInvestment')}
        >
          <InputGroup
            id="contentInvestment"
            name="contentInvestment"
            type="number"
            value={state.contentInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            min="0"
            max="100"
            suffix="%"
            error={getFieldError('contentInvestment')}
          />
        </FormGroup>
        
        <FormGroup
          id="linkBuildingInvestment"
          label="Link Building Investment (%)"
          tooltip="Percentage of your SEO budget allocated to link building"
          error={getFieldError('linkBuildingInvestment')}
        >
          <InputGroup
            id="linkBuildingInvestment"
            name="linkBuildingInvestment"
            type="number"
            value={state.linkBuildingInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 40"
            min="0"
            max="100"
            suffix="%"
            error={getFieldError('linkBuildingInvestment')}
          />
        </FormGroup>
        
        <FormGroup
          id="technicalSEOInvestment"
          label="Technical SEO Investment (%)"
          tooltip="Percentage of your SEO budget allocated to technical improvements"
          error={getFieldError('technicalSEOInvestment')}
        >
          <InputGroup
            id="technicalSEOInvestment"
            name="technicalSEOInvestment"
            type="number"
            value={state.technicalSEOInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            min="0"
            max="100"
            suffix="%"
            error={getFieldError('technicalSEOInvestment')}
          />
        </FormGroup>
        
        <FormGroup
          id="monthlySEOCost"
          label="Total Monthly SEO Investment ($)"
          tooltip="Your monthly spend on SEO services, tools, and resources"
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
            step="0.01"
            prefix="$"
            error={getFieldError('monthlySEOCost')}
          />
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
          />
        </FormGroup>
      </FormGrid>
    </AdvancedCalculatorContainer>
  );
};

const AdvancedCalculatorContainer = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const FormTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.headings.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.headings.h2.fontWeight};
  line-height: ${({ theme }) => theme.typography.headings.h2.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FormDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
`;

const InvestmentNote = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-style: italic;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: white;
  transition: ${({ theme }) => theme.transitions.default};
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

export default AdvancedCalculator; 