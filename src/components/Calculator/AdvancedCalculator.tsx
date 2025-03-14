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
  const [domainInput, setDomainInput] = React.useState('');
  const [keywordInput, setKeywordInput] = React.useState('');
  
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

  const handleDomainCheck = () => {
    if (domainInput) {
      window.open(`https://www.semrush.com/analytics/overview/?searchType=domain&q=${encodeURIComponent(domainInput)}`, '_blank');
    }
  };

  const handleKeywordAnalyze = () => {
    if (keywordInput) {
      window.open(`https://www.semrush.com/analytics/keywordoverview/?q=${encodeURIComponent(keywordInput)}&db=us`, '_blank');
    }
  };

  const handleDomainKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleDomainCheck();
    }
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleKeywordAnalyze();
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
        
        {/* Domain Authority Section with Semrush Integration */}
        <FormGroup
          id="domainAuthority"
          label="Domain Authority"
          tooltip="Check your domain's authority score and get insights from Semrush"
          helperText="Understanding your domain's authority can help set realistic growth expectations and identify improvement opportunities."
        >
          <DomainAuthorityWrapper>
            <DomainInput
              type="text"
              placeholder="Enter your domain"
              value={domainInput}
              onChange={(e) => setDomainInput(e.target.value)}
              onKeyDown={handleDomainKeyDown}
            />
            <AuthorityButton
              type="button"
              onClick={handleDomainCheck}
            >
              Check
            </AuthorityButton>
          </DomainAuthorityWrapper>
        </FormGroup>
        
        {/* Keyword Research Section with Semrush Integration */}
        <FormGroup
          id="keywordResearch"
          label="Keyword Research"
          tooltip="Analyze keyword metrics and competition using Semrush"
          helperText="Research keywords to understand search volume, difficulty, and competitive landscape."
        >
          <KeywordResearchWrapper>
            <KeywordInput
              type="text"
              placeholder="Enter keyword"
              value={keywordInput}
              onChange={(e) => setKeywordInput(e.target.value)}
              onKeyDown={handleKeywordKeyDown}
            />
            <AnalyzeButton
              type="button"
              onClick={handleKeywordAnalyze}
            >
              Analyze
            </AnalyzeButton>
          </KeywordResearchWrapper>
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

const DomainAuthorityWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const DomainInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: white;
  transition: ${({ theme }) => theme.transitions.default};
  width: calc(100% - 80px); /* Increase input field size by reducing button space */
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const AuthorityButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  min-width: 70px; /* Make the button smaller */
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

// Keyword Research styled components - mirroring the Domain Authority styles
const KeywordResearchWrapper = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const KeywordInput = styled.input`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: white;
  transition: ${({ theme }) => theme.transitions.default};
  width: calc(100% - 80px); /* Increase input field size by reducing button space */
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme }) => `${theme.colors.primary}33`};
  }
`;

const AnalyzeButton = styled.button`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: white;
  background-color: ${({ theme }) => theme.colors.primary};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;
  white-space: nowrap;
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  min-width: 80px; /* Make the button smaller */
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryHover};
  }
`;

export default AdvancedCalculator; 