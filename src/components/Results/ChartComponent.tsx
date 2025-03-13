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
  LineController,
  TooltipItem
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

// Helper function to format numbers with commas and round to whole numbers
const formatNumber = (value: number): string => {
  // Round up to integer and format with commas
  return Math.ceil(value).toLocaleString('en-US');
};

interface ChartComponentProps {
  data: ChartData;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ data }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Round up all numeric values in datasets for display
  const processedData = {
    ...data,
    datasets: data.datasets.map(dataset => ({
      ...dataset,
      data: dataset.data.map(value => Math.ceil(value)) // Round up all values
    }))
  };

  // Fixed TypeScript type issues in the options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        position: 'left' as const,
        ticks: {
          // Use proper type signature for callback function
          callback: function(tickValue: number | string) {
            // Only apply Math.ceil to numeric values and add commas
            if (typeof tickValue === 'number') {
              return formatNumber(tickValue);
            }
            return tickValue;
          }
        }
      },
      y1: {
        beginAtZero: true,
        position: 'right' as const,
        grid: {
          display: false,
        },
        display: data.datasets.some(dataset => dataset.yAxisID === 'y1'),
        ticks: {
          // Use proper type signature for callback function
          callback: function(tickValue: number | string) {
            // Only apply Math.ceil to numeric values and add commas for percentages too
            if (typeof tickValue === 'number') {
              return formatNumber(tickValue);
            }
            return tickValue;
          }
        }
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function(context: TooltipItem<'bar' | 'line'>) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            
            // Round up the value - ensure it's a number first
            const rawValue = context.raw;
            let formattedValue = '';
            
            if (typeof rawValue === 'number') {
              formattedValue = formatNumber(rawValue);
              
              if (context.dataset.yAxisID === 'y1') {
                label += formattedValue + '%';
              } else {
                label += '$' + formattedValue;
              }
            } else {
              label += rawValue;
            }
            
            return label;
          }
        }
      }
    }
  };

  if (!isClient) {
    return <div style={{ height: '300px' }}>Loading chart...</div>;
  }

  // Set base type as "bar" but datasets can override with their own type
  return <Chart type="bar" data={processedData} options={options} />;
};

export default ChartComponent; 