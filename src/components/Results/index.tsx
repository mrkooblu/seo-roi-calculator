import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CalculationResults } from '../../types';
import ROIChart from './ROIChart';
import Recommendations from './Recommendations';
import ResultItem from './ResultItem';
import Tooltip from '../Form/Tooltip';
import { FiInfo } from 'react-icons/fi';

// Helper function to format numbers with commas and round to whole numbers
const formatNumber = (value: number): string => {
  // Round up to integer and format with commas
  return Math.ceil(value).toLocaleString('en-US');
};

interface ResultsProps {
  results: CalculationResults;
}

/**
 * Results component displays the calculation results with metrics, charts, and recommendations
 * It uses animation and visually highlights important metrics
 */
const Results: React.FC<ResultsProps> = ({ results }) => {
  const { 
    initialRevenue,
    projectedRevenue,
    revenueIncrease,
    totalSEOCost,
    roi,
    breakEvenMonth,
    trafficGrowthChart,
    revenueGrowthChart,
    roiComparisonChart,
    recommendations
  } = results;

  return (
    <ResultsContainer>
      <ResultsTitle>Your SEO ROI Results</ResultsTitle>
      
      <ResultsGrid>
        <ResultItem 
          title="Initial Monthly Revenue"
          value={formatNumber(initialRevenue)}
          prefix="$"
        />
        
        <ResultItem 
          title="Projected Monthly Revenue"
          value={formatNumber(projectedRevenue)}
          prefix="$"
          isPositive={projectedRevenue > initialRevenue}
        />
        
        <ResultItem 
          title="Monthly Revenue Increase"
          value={formatNumber(revenueIncrease)}
          prefix="$"
          isPositive={revenueIncrease > 0}
        />
        
        <ResultItem 
          title="Total SEO Investment"
          value={formatNumber(totalSEOCost)}
          prefix="$"
        />
        
        <ResultItem 
          title="Return on Investment"
          value={formatNumber(roi)}
          suffix="%"
          highlight={true}
          isPositive={roi > 0}
        />
        
        <ResultItem 
          title="Break-even Month"
          value={breakEvenMonth.toString()}
        />
      </ResultsGrid>

      <ChartSection>
        <SectionTitleWrapper>
          <SectionTitle>Traffic Growth Projection</SectionTitle>
          <CustomTooltipWrapper>
            <Tooltip 
              content="Visualizes your organic traffic growth over time, calculated using S-curve modeling that accounts for typical SEO momentum patterns."
              position="right"
            >
              <ChartInfoIcon />
            </Tooltip>
          </CustomTooltipWrapper>
        </SectionTitleWrapper>
        <ChartContainer>
          <ROIChart data={trafficGrowthChart} />
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <SectionTitleWrapper>
          <SectionTitle>Revenue Growth Projection</SectionTitle>
          <CustomTooltipWrapper>
            <Tooltip 
              content="Shows how your revenue is expected to grow as traffic and conversions increase, incorporating time-based conversion rate maturation."
              position="right"
            >
              <ChartInfoIcon />
            </Tooltip>
          </CustomTooltipWrapper>
        </SectionTitleWrapper>
        <ChartContainer>
          <ROIChart data={revenueGrowthChart} />
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <SectionTitleWrapper>
          <SectionTitle>ROI Comparison</SectionTitle>
          <CustomTooltipWrapper>
            <Tooltip 
              content="Compares your cumulative investment against returns over time, showing the point where your SEO efforts become profitable."
              position="right"
            >
              <ChartInfoIcon />
            </Tooltip>
          </CustomTooltipWrapper>
        </SectionTitleWrapper>
        <ChartContainer>
          <ROIChart data={roiComparisonChart} />
        </ChartContainer>
      </ChartSection>

      <RecommendationsSection>
        <SectionTitle>Recommendations</SectionTitle>
        <Recommendations recommendations={recommendations} />
      </RecommendationsSection>
    </ResultsContainer>
  );
};

const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(30px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

const ResultsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
  animation: ${fadeIn} 0.8s ease-out;
  
  @media (max-width: 768px) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const ResultsTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.headings.h2.fontSize};
  font-weight: ${({ theme }) => theme.typography.headings.h2.fontWeight};
  line-height: ${({ theme }) => theme.typography.headings.h2.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize['2xl']};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const ChartSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const ChartContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  transition: box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.headings.h3.fontSize};
  font-weight: ${({ theme }) => theme.typography.headings.h3.fontWeight};
  line-height: ${({ theme }) => theme.typography.headings.h3.lineHeight};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const SectionTitleWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const CustomTooltipWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  margin-left: 6px;
  line-height: 1;
  
  /* Ensure vertical alignment */
  position: relative;
  top: 1px;
  
  /* Override tooltip content styling */
  div[role="tooltip"] {
    background-color: #EBF3FF;
    color: black;
    font-weight: 400;
  }
  
  /* Override tooltip arrow styling */
  div[role="tooltip"] > div {
    border-color: transparent;
    &[class*="right"] {
      border-right-color: #EBF3FF;
    }
    &[class*="top"] {
      border-top-color: #EBF3FF;
    }
    &[class*="bottom"] {
      border-bottom-color: #EBF3FF;
    }
    &[class*="left"] {
      border-left-color: #EBF3FF;
    }
  }
`;

const ChartInfoIcon = styled(FiInfo)`
  width: 18px;
  height: 18px;
  color: ${({ theme }) => theme.colors.primary};
  display: block; /* Ensures no extra spacing */
`;

const RecommendationsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default Results; 