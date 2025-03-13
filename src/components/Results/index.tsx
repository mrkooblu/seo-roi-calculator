import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CalculationResults } from '../../types';
import ROIChart from './ROIChart';
import Recommendations from './Recommendations';
import ResultItem from './ResultItem';

// this is a change

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
          value={initialRevenue.toFixed(2)}
          prefix="$"
        />
        
        <ResultItem 
          title="Projected Monthly Revenue"
          value={projectedRevenue.toFixed(2)}
          prefix="$"
          isPositive={projectedRevenue > initialRevenue}
        />
        
        <ResultItem 
          title="Monthly Revenue Increase"
          value={revenueIncrease.toFixed(2)}
          prefix="$"
          isPositive={revenueIncrease > 0}
        />
        
        <ResultItem 
          title="Total SEO Investment"
          value={totalSEOCost.toFixed(2)}
          prefix="$"
        />
        
        <ResultItem 
          title="Return on Investment"
          value={roi.toFixed(2)}
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
        <SectionTitle>Traffic Growth Projection</SectionTitle>
        <ChartContainer>
          <ROIChart data={trafficGrowthChart} />
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <SectionTitle>Revenue Growth Projection</SectionTitle>
        <ChartContainer>
          <ROIChart data={revenueGrowthChart} />
        </ChartContainer>
      </ChartSection>
      
      <ChartSection>
        <SectionTitle>ROI Comparison</SectionTitle>
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
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
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
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
  
  @media (max-width: 768px) {
    font-size: ${({ theme }) => theme.typography.fontSize.lg};
  }
`;

const RecommendationsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default Results; 