import React from 'react';
import styled, { keyframes } from 'styled-components';

interface ResultItemProps {
  title: string;
  value: string;
  highlight?: boolean;
  prefix?: string;
  suffix?: string;
  isPositive?: boolean;
}

/**
 * ResultItem displays a single metric in the results section
 * It can be highlighted and show positive/negative values with appropriate styling
 */
const ResultItem: React.FC<ResultItemProps> = ({ 
  title, 
  value, 
  highlight = false,
  prefix,
  suffix,
  isPositive
}) => {
  return (
    <MetricCard $highlight={highlight}>
      <MetricTitle>{title}</MetricTitle>
      <MetricValueWrapper>
        {prefix && <MetricPrefix>{prefix}</MetricPrefix>}
        <MetricValue>{value}</MetricValue>
        {suffix && <MetricSuffix>{suffix}</MetricSuffix>}
      </MetricValueWrapper>
      {isPositive !== undefined && (
        <ChangeIndicator $isPositive={isPositive}>
          {isPositive ? '▲' : '▼'} {isPositive ? 'Increase' : 'Decrease'} 
        </ChangeIndicator>
      )}
    </MetricCard>
  );
};

const fadeIn = keyframes`
  from { 
    opacity: 0;
    transform: translateY(20px);
  }
  to { 
    opacity: 1;
    transform: translateY(0);
  }
`;

interface MetricCardProps {
  $highlight?: boolean;
}

const MetricCard = styled.div<MetricCardProps>`
  background-color: ${({ theme, $highlight }) => $highlight ? theme.colors.primary : theme.colors.background};
  color: ${({ theme, $highlight }) => $highlight ? '#fff' : theme.colors.text.primary};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  text-align: center;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  animation: ${fadeIn} 0.5s ease-out;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const MetricTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const MetricValueWrapper = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: center;
`;

const MetricPrefix = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-right: 2px;
`;

const MetricValue = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xxl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
`;

const MetricSuffix = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  margin-left: 2px;
`;

interface ChangeIndicatorProps {
  $isPositive: boolean;
}

const ChangeIndicator = styled.div<ChangeIndicatorProps>`
  margin-top: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme, $isPositive }) => 
    $isPositive ? theme.colors.success : theme.colors.danger};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
`;

export default ResultItem; 