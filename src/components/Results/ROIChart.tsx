import React from 'react';
import dynamic from 'next/dynamic';
import styled from 'styled-components';
import { ChartData } from '../../types';

// Create a client-side only Chart component
const ChartComponent = dynamic(
  () => import('./ChartComponent'),
  { ssr: false }
);

interface ROIChartProps {
  data: ChartData;
  breakEvenMonth?: number;
  chartType?: string;
}

const ROIChart: React.FC<ROIChartProps> = ({ 
  data, 
  breakEvenMonth, 
  chartType 
}) => {
  return (
    <ChartContainer>
      <ChartComponent 
        data={data} 
        breakEvenMonth={breakEvenMonth}
        chartType={chartType}
      />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default ROIChart; 