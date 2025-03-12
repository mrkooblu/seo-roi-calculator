import React from 'react';
import styled from 'styled-components';
import { CalculatorState } from '../../types';

interface AdvancedCalculatorProps {
  state: CalculatorState;
  updateState: (updates: Partial<CalculatorState>) => void;
}

const AdvancedCalculator: React.FC<AdvancedCalculatorProps> = ({ state, updateState }) => {
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
          <Label htmlFor="organicCTR">Organic CTR (%)</Label>
          <Input
            id="organicCTR"
            name="organicCTR"
            type="number"
            value={state.organicCTR || ''}
            onChange={handleInputChange}
            placeholder="e.g. 3.5"
            step="0.1"
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
      </FormGrid>
      
      <SectionTitle>SEO Strategy Factors</SectionTitle>
      <FormGrid>
        <FormGroup>
          <Label htmlFor="keywordDifficulty">Keyword Difficulty (1-100)</Label>
          <Input
            id="keywordDifficulty"
            name="keywordDifficulty"
            type="number"
            value={state.keywordDifficulty || ''}
            onChange={handleInputChange}
            placeholder="e.g. 40"
            min="1"
            max="100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="competitionLevel">Competition Level</Label>
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
        
        <FormGroup>
          <Label htmlFor="industryType">Industry Type</Label>
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
      <FormGrid>
        <FormGroup>
          <Label htmlFor="contentInvestment">Content Investment (%)</Label>
          <Input
            id="contentInvestment"
            name="contentInvestment"
            type="number"
            value={state.contentInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            min="0"
            max="100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="linkBuildingInvestment">Link Building Investment (%)</Label>
          <Input
            id="linkBuildingInvestment"
            name="linkBuildingInvestment"
            type="number"
            value={state.linkBuildingInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 40"
            min="0"
            max="100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="technicalSEOInvestment">Technical SEO Investment (%)</Label>
          <Input
            id="technicalSEOInvestment"
            name="technicalSEOInvestment"
            type="number"
            value={state.technicalSEOInvestment || ''}
            onChange={handleInputChange}
            placeholder="e.g. 30"
            min="0"
            max="100"
          />
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="monthlySEOCost">Total Monthly SEO Investment ($)</Label>
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
    </AdvancedCalculatorContainer>
  );
};

const AdvancedCalculatorContainer = styled.div`
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

const SectionTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin: ${({ theme }) => theme.spacing.lg} 0 ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
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

const Select = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: white;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

export default AdvancedCalculator; 