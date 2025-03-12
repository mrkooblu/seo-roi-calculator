import React from 'react';
import styled from 'styled-components';
import { CalculationResults } from '../../types';
import ROIChart from './ROIChart';
import Recommendations from './Recommendations';

interface ResultsProps {
  results: CalculationResults;
}

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
        <MetricCard>
          <MetricTitle>Initial Monthly Revenue</MetricTitle>
          <MetricValue>${initialRevenue.toFixed(2)}</MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Projected Monthly Revenue</MetricTitle>
          <MetricValue>${projectedRevenue.toFixed(2)}</MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Monthly Revenue Increase</MetricTitle>
          <MetricValue>${revenueIncrease.toFixed(2)}</MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Total SEO Investment</MetricTitle>
          <MetricValue>${totalSEOCost.toFixed(2)}</MetricValue>
        </MetricCard>
        
        <MetricCard $highlight>
          <MetricTitle>Return on Investment</MetricTitle>
          <MetricValue>{roi.toFixed(2)}%</MetricValue>
        </MetricCard>
        
        <MetricCard>
          <MetricTitle>Break-even Month</MetricTitle>
          <MetricValue>{breakEvenMonth}</MetricValue>
        </MetricCard>
      </ResultsGrid>

      <ChartSection>
        <SectionTitle>Traffic Growth Projection</SectionTitle>
        <ROIChart data={trafficGrowthChart} />
      </ChartSection>
      
      <ChartSection>
        <SectionTitle>Revenue Growth Projection</SectionTitle>
        <ROIChart data={revenueGrowthChart} />
      </ChartSection>
      
      <ChartSection>
        <SectionTitle>ROI Comparison</SectionTitle>
        <ROIChart data={roiComparisonChart} />
      </ChartSection>

      <RecommendationsSection>
        <SectionTitle>Recommendations</SectionTitle>
        <Recommendations recommendations={recommendations} />
      </RecommendationsSection>
    </ResultsContainer>
  );
};

interface MetricCardProps {
  $highlight?: boolean;
}

const ResultsContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing.xl};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

const ResultsTitle = styled.h2`
  font-size: ${({ theme }) => theme.typography.fontSize['3xl']};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.text.primary};
  text-align: center;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const MetricCard = styled.div<MetricCardProps>`
  background-color: ${({ theme, $highlight }) => $highlight ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $highlight }) => $highlight ? '#fff' : theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
`;

const MetricTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const ChartSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  margin-bottom: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RecommendationsSection = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export default Results; 