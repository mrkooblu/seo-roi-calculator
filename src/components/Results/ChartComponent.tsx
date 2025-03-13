import React, { useEffect, useState } from 'react';
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
  BarController,
  LineController
} from 'chart.js';
import { ChartData } from '../../types';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  BarController, // Add explicit controller registration 
  LineController, // Add explicit controller registration
  Title,
  Tooltip,
  Legend
);

interface ChartComponentProps {
  data: ChartData;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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

  if (!isClient) {
    return <div style={{ height: '300px' }}>Loading chart...</div>;
  }

  // Set base type as "bar" but datasets can override with their own type
  return <Chart type="bar" data={data} options={options} />;
};

export default ChartComponent; 