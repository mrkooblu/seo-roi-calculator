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
  timeframe: number; // Add timeframe prop to get access to the current timeframe
}

/**
 * Results component displays the calculation results with metrics, charts, and recommendations
 * It uses animation and visually highlights important metrics
 */
const Results: React.FC<ResultsProps> = ({ results, timeframe }) => {
  const { 
    initialRevenue,
    projectedRevenue,
    revenueIncrease,
    averageMonthlyIncrease,
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
          tooltip="Your current monthly revenue based on existing traffic and conversion rate"
        />
        
        <ResultItem 
          title="Target Monthly Revenue"
          value={formatNumber(projectedRevenue)}
          prefix="$"
          isPositive={projectedRevenue > initialRevenue}
          tooltip={`The projected monthly revenue you can expect to achieve by the end of month ${timeframe}, after reaching your target traffic`}
        />
        
        <ResultItem 
          title="Average Monthly Increase"
          value={formatNumber(averageMonthlyIncrease)}
          prefix="$"
          isPositive={averageMonthlyIncrease > 0}
          tooltip="The average monthly revenue increase you can expect over the entire timeframe"
        />
        
        <ResultItem 
          title="Total SEO Investment"
          value={formatNumber(totalSEOCost)}
          prefix="$"
          tooltip={`Your total investment in SEO over ${timeframe} months`}
        />
        
        <ResultItem 
          title="Return on Investment"
          value={formatNumber(roi)}
          suffix="%"
          highlight={true}
          isPositive={roi > 0}
          tooltip={`Your total return on investment over the ${timeframe}-month period`}
        />
        
        <ResultItem 
          title="Break-even Month"
          value={breakEvenMonth.toString()}
          tooltip="The month when your cumulative additional revenue exceeds your cumulative SEO costs"
        />
      </ResultsGrid>

      <ChartSection>
        <SectionTitleWrapper>
          <SectionTitle>Traffic Growth Projection</SectionTitle>
          <CustomTooltipWrapper>
            <Tooltip 
              content="Visualizes your organic traffic growth over time, calculated using S-curve modeling that accounts for typical SEO momentum patterns. Note that real growth will take time, especially for newer sites."
              position="right"
            >
              <ChartInfoIcon />
            </Tooltip>
          </CustomTooltipWrapper>
        </SectionTitleWrapper>
        <ChartContainer>
          <ROIChart data={trafficGrowthChart} />
        </ChartContainer>
        <ChartNote>SEO results take time, with slower growth in the early months and acceleration later</ChartNote>
      </ChartSection>
      
      <ChartSection>
        <SectionTitleWrapper>
          <SectionTitle>Revenue Growth Projection</SectionTitle>
          <CustomTooltipWrapper>
            <Tooltip 
              content="Shows how your revenue is expected to grow as traffic and conversions increase. Your 'Final Monthly Revenue' represents the last bar in this chart."
              position="right"
            >
              <ChartInfoIcon />
            </Tooltip>
          </CustomTooltipWrapper>
        </SectionTitleWrapper>
        <ChartContainer>
          <ROIChart data={revenueGrowthChart} />
        </ChartContainer>
        <ChartNote>Revenue follows the same growth pattern as traffic - gradual at first, then accelerating</ChartNote>
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
        <ChartNote>Break-even occurs when the blue bars (cumulative revenue) exceed the red bars (cumulative cost)</ChartNote>
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
  min-height: 400px; /* Ensure consistent height */
  width: 100%;
  
  /* Improve resolution with better rendering for charts */
  canvas {
    image-rendering: high-quality;
    image-rendering: -webkit-optimize-contrast; /* For Webkit browsers */
  }
  
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

const ChartNote = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-top: ${({ theme }) => theme.spacing.md};
  text-align: center;
`;

export default Results; 