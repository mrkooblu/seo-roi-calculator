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

// Set default options for all charts to improve rendering quality
ChartJS.defaults.font.family = 'Inter, system-ui, sans-serif';
ChartJS.defaults.elements.line.tension = 0.4; // Smoother curves
ChartJS.defaults.elements.line.borderWidth = 3; // Thicker lines for better visibility
ChartJS.defaults.elements.bar.borderWidth = 0; // Clean bars without borders
ChartJS.defaults.elements.point.radius = 4; // Larger points
ChartJS.defaults.elements.point.hoverRadius = 6; // Larger hover points

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
      data: dataset.data.map(value => Math.ceil(value)), // Round up all values
      borderWidth: dataset.type === 'line' ? 3 : undefined, // Thicker lines for line graphs
      pointRadius: dataset.type === 'line' ? 4 : undefined // Larger points for line graphs
    }))
  };

  // Check if this is a traffic chart by looking at dataset labels
  const isTrafficChart = processedData.datasets.some(
    dataset => dataset.label?.toLowerCase().includes('traffic')
  );

  // Fixed TypeScript type issues in the options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: window?.devicePixelRatio || 3, // Use device pixel ratio for high-DPI rendering or a high value as fallback
    animation: {
      duration: 1500, // Slightly longer animation for smoothness
    },
    scales: {
      y: {
        beginAtZero: true,
        position: 'left' as const,
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Lighter grid lines
          lineWidth: 1,
        },
        ticks: {
          // Use proper type signature for callback function
          padding: 8, // Add padding to ticks for better readability
          font: {
            size: 12, // Larger font size
          },
          callback: function(tickValue: number | string) {
            // Only apply Math.ceil to numeric values and add commas
            if (typeof tickValue === 'number') {
              return formatNumber(tickValue);
            }
            return tickValue;
          }
        }
      },
      x: {
        grid: {
          color: 'rgba(200, 200, 200, 0.2)', // Lighter grid lines
          lineWidth: 1,
        },
        ticks: {
          padding: 5, // Add padding to ticks
          font: {
            size: 12, // Larger font size
          },
          maxRotation: 45, // Rotate labels if needed
          minRotation: 0,
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
          padding: 8, // Add padding to ticks
          font: {
            size: 12, // Larger font size
          },
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
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 16,
          padding: 16,
          font: {
            size: 13, // Larger font for legend
          }
        }
      },
      tooltip: {
        padding: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#333',
        bodyColor: '#333',
        borderWidth: 1,
        borderColor: 'rgba(200, 200, 200, 0.7)',
        cornerRadius: 8,
        boxPadding: 6,
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 13,
        },
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
                // This is for percentage values (ROI)
                label += formattedValue + '%';
              } else if (isTrafficChart || label.toLowerCase().includes('traffic')) {
                // For traffic metrics, don't add currency symbol
                label += formattedValue;
              } else {
                // For revenue and investment metrics
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
    return <div style={{ height: '400px' }}>Loading chart...</div>;
  }

  // Set base type as "bar" but datasets can override with their own type
  return (
    <div className="chart-wrapper" style={{ height: '400px' }}>
      <Chart type="bar" data={processedData} options={options} />
    </div>
  );
};

export default ChartComponent; 