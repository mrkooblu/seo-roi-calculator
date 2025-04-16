import React, { useState } from 'react';
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
  const [warnings, setWarnings] = useState<Record<string, string>>({});
  
  // Calculate the total investment allocation percentage
  const totalInvestment = (
    (state.contentInvestment || 0) + 
    (state.linkBuildingInvestment || 0) + 
    (state.technicalSEOInvestment || 0)
  );

  // Determine if we need to show the allocation warning
  const showAllocationWarning = totalInvestment !== 100 && 
    (state.contentInvestment !== undefined && state.contentInvestment !== null) &&
    (state.linkBuildingInvestment !== undefined && state.linkBuildingInvestment !== null) && 
    (state.technicalSEOInvestment !== undefined && state.technicalSEOInvestment !== null);

  // Auto-adjust the third value when two values are set to make total 100%
  const autoBalanceInvestments = (name: string, value: number) => {
    // If we have two fields with values and the current field is one of them
    const contentSet = name !== 'contentInvestment' && state.contentInvestment !== undefined && state.contentInvestment !== null;
    const linkSet = name !== 'linkBuildingInvestment' && state.linkBuildingInvestment !== undefined && state.linkBuildingInvestment !== null;
    const technicalSet = name !== 'technicalSEOInvestment' && state.technicalSEOInvestment !== undefined && state.technicalSEOInvestment !== null;
    
    // If exactly two fields are already set (including the one being edited)
    if ([contentSet, linkSet, technicalSet].filter(Boolean).length === 1) {
      // Calculate what the third field should be to make total 100%
      let thirdField = '';
      let calculatedValue = 0;
      
      if (!contentSet && name !== 'contentInvestment') {
        thirdField = 'contentInvestment';
        calculatedValue = 100 - value - (linkSet ? state.linkBuildingInvestment : state.technicalSEOInvestment);
      } else if (!linkSet && name !== 'linkBuildingInvestment') {
        thirdField = 'linkBuildingInvestment';
        calculatedValue = 100 - value - (contentSet ? state.contentInvestment : state.technicalSEOInvestment);
      } else if (!technicalSet && name !== 'technicalSEOInvestment') {
        thirdField = 'technicalSEOInvestment';
        calculatedValue = 100 - value - (contentSet ? state.contentInvestment : state.linkBuildingInvestment);
      }
      
      // Only auto-adjust if the calculated value is valid (non-negative)
      if (thirdField && calculatedValue >= 0) {
        setWarnings({
          ...warnings,
          [thirdField]: `Auto-adjusted to ${calculatedValue}% to make total 100%`
        });
        clearWarningAfterDelay(thirdField);
        
        // Update the third field
        updateState({ [thirdField]: calculatedValue });
      }
    }
  };
  
  // Clear warning for a field after 5 seconds
  const clearWarningAfterDelay = (fieldName: string) => {
    setTimeout(() => {
      setWarnings(prev => {
        const newWarnings = { ...prev };
        delete newWarnings[fieldName];
        return newWarnings;
      });
    }, 5000);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Handle different input types differently
    if (e.target.type === 'number') {
      // Allow empty input for better user experience
      if (value === '') {
        updateState({ [name]: '' });
        return;
      }
      
      const numValue = parseFloat(value);
      
      // Check if it's a valid number
      if (isNaN(numValue)) {
        return; // Ignore invalid number inputs
      }
      
      // Prevent negative values
      if (numValue < 0) {
        setWarnings({
          ...warnings,
          [name]: `Negative values are not allowed for ${name}`
        });
        clearWarningAfterDelay(name);
        return; // Don't update state for negative values
      }
      
      // Handle specific field constraints
      switch (name) {
        case 'conversionRate':
          // Cap conversion rate at 100%
          if (numValue > 100) {
            updateState({ [name]: 100 });
            setWarnings({
              ...warnings,
              [name]: 'Conversion rate capped at a maximum of 100%'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
        
        case 'keywordDifficulty':
          // Ensure keyword difficulty is between 1-100
          if (numValue < 1) {
            updateState({ [name]: 1 });
            setWarnings({
              ...warnings,
              [name]: 'Keyword difficulty set to minimum value of 1'
            });
            clearWarningAfterDelay(name);
          } else if (numValue > 100) {
            updateState({ [name]: 100 });
            setWarnings({
              ...warnings,
              [name]: 'Keyword difficulty capped at maximum value of 100'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
          
        case 'targetTraffic':
          // Ensure target traffic is greater than current traffic
          if (numValue <= state.currentTraffic && numValue > 0) {
            updateState({ [name]: state.currentTraffic + 1 });
            setWarnings({
              ...warnings,
              [name]: `Target traffic must be greater than current traffic (${state.currentTraffic})`
            });
            clearWarningAfterDelay(name);
          } else if (numValue > 10000000) {
            updateState({ [name]: numValue });
            setWarnings({
              ...warnings,
              [name]: 'High traffic values may produce less accurate projections'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
          
        case 'contentInvestment':
        case 'linkBuildingInvestment':
        case 'technicalSEOInvestment':
          // These percentages should total 100%
          updateState({ [name]: numValue });
          
          // Try to auto-balance investments
          autoBalanceInvestments(name, numValue);
          
          // Check if we're close to 100% total
          const updatedState = {
            ...state,
            [name]: numValue
          };
          
          const total = (
            (name === 'contentInvestment' ? numValue : updatedState.contentInvestment || 0) +
            (name === 'linkBuildingInvestment' ? numValue : updatedState.linkBuildingInvestment || 0) +
            (name === 'technicalSEOInvestment' ? numValue : updatedState.technicalSEOInvestment || 0)
          );
          
          if (total > 100) {
            setWarnings({
              ...warnings,
              [name]: `Total investment allocation exceeds 100% (currently ${total}%)`
            });
            clearWarningAfterDelay(name);
          } else if (total < 100 && total >= 90 && total !== 0) {
            // Only show warning when we're close but not exactly at 100%
            setWarnings({
              ...warnings,
              [name]: `Total investment allocation is ${total}%, should sum to 100%`
            });
            clearWarningAfterDelay(name);
          }
          break;
          
        case 'timeframe':
          // Cap timeframe at 60 months
          if (numValue > 60) {
            updateState({ [name]: 60 });
            setWarnings({
              ...warnings,
              [name]: 'Timeframe capped at 60 months'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
          
        case 'averageOrderValue':
          if (numValue > 10000) {
            updateState({ [name]: numValue });
            setWarnings({
              ...warnings,
              [name]: 'High order values may impact calculation accuracy'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
          
        case 'monthlySEOCost':
          if (numValue > 100000) {
            updateState({ [name]: numValue });
            setWarnings({
              ...warnings,
              [name]: 'Extremely high monthly SEO costs entered'
            });
            clearWarningAfterDelay(name);
          } else {
            updateState({ [name]: numValue });
          }
          break;
          
        default:
          updateState({ [name]: numValue });
      }
    } else {
      // Handle non-number inputs (like select elements)
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
          {getFieldError('currentTraffic') && (
            <ErrorText>{getFieldError('currentTraffic')}</ErrorText>
          )}
          {warnings.currentTraffic && (
            <WarningText>{warnings.currentTraffic}</WarningText>
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
            error={getFieldError('targetTraffic')}
          />
          {getFieldError('targetTraffic') && (
            <ErrorText>{getFieldError('targetTraffic')}</ErrorText>
          )}
          {warnings.targetTraffic && (
            <WarningText>{warnings.targetTraffic}</WarningText>
          )}
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
          {getFieldError('conversionRate') && (
            <ErrorText>{getFieldError('conversionRate')}</ErrorText>
          )}
          {warnings.conversionRate && (
            <WarningText>{warnings.conversionRate}</WarningText>
          )}
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
          {getFieldError('averageOrderValue') && (
            <ErrorText>{getFieldError('averageOrderValue')}</ErrorText>
          )}
          {warnings.averageOrderValue && (
            <WarningText>{warnings.averageOrderValue}</WarningText>
          )}
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
          {getFieldError('keywordDifficulty') && (
            <ErrorText>{getFieldError('keywordDifficulty')}</ErrorText>
          )}
          {warnings.keywordDifficulty && (
            <WarningText>{warnings.keywordDifficulty}</WarningText>
          )}
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
      <InvestmentNote>
        These three percentages should add up to 100%
      </InvestmentNote>
      {showAllocationWarning && 
        <TotalDisplay $isValid={totalInvestment === 100}>
          Current Total: <strong>{totalInvestment}%</strong> {totalInvestment !== 100 ? '(should be 100%)' : '✓'}
        </TotalDisplay>
      }
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
          {getFieldError('contentInvestment') && (
            <ErrorText>{getFieldError('contentInvestment')}</ErrorText>
          )}
          {warnings.contentInvestment && (
            <WarningText>{warnings.contentInvestment}</WarningText>
          )}
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
          {getFieldError('linkBuildingInvestment') && (
            <ErrorText>{getFieldError('linkBuildingInvestment')}</ErrorText>
          )}
          {warnings.linkBuildingInvestment && (
            <WarningText>{warnings.linkBuildingInvestment}</WarningText>
          )}
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
          {getFieldError('technicalSEOInvestment') && (
            <ErrorText>{getFieldError('technicalSEOInvestment')}</ErrorText>
          )}
          {warnings.technicalSEOInvestment && (
            <WarningText>{warnings.technicalSEOInvestment}</WarningText>
          )}
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
          {getFieldError('timeframe') && (
            <ErrorText>{getFieldError('timeframe')}</ErrorText>
          )}
          {warnings.timeframe && (
            <WarningText>{warnings.timeframe}</WarningText>
          )}
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

const TotalDisplay = styled.div<{ $isValid: boolean }>`
  color: ${({ theme, $isValid }) => $isValid ? theme.colors.success : theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  display: flex;
  align-items: center;
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

const ErrorText = styled.div`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const WarningText = styled.div`
  color: #FF9900;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  margin-top: ${({ theme }) => theme.spacing.xs};
  display: flex;
  align-items: center;
  
  &:before {
    content: "⚠️";
    margin-right: ${({ theme }) => theme.spacing.xs};
  }
`;

export default AdvancedCalculator; 