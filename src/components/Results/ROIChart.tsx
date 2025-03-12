import React from 'react';
import { Chart } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { ChartData } from '../../types';
import styled from 'styled-components';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface ROIChartProps {
  data: ChartData;
}

const ROIChart: React.FC<ROIChartProps> = ({ data }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        position: 'left' as const,
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: {
          display: false,
        },
        display: data.datasets.some(dataset => dataset.yAxisID === 'y1'),
      },
    },
  };

  return (
    <ChartContainer>
      <Chart type="bar" data={data} options={options} />
    </ChartContainer>
  );
};

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
`;

export default ROIChart; 