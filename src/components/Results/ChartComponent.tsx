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
import annotationPlugin from 'chartjs-plugin-annotation';

// Define custom annotation options type for our specific chart
type ChartAnnotations = {
  breakEvenLine?: {
    type: 'line';
    xMin: number;
    xMax: number;
    borderColor: string;
    borderWidth: number;
    borderDash: number[];
    label: {
      display: boolean;
      content: string;
      position: 'start';
      backgroundColor: string;
      font: {
        size: number;
        weight: 'bold';
      };
      yAdjust: number;
      xAdjust: number;
      padding: number;
    };
  };
  breakEvenBox?: {
    type: 'box';
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: string | number;
    backgroundColor: string;
    borderColor: string;
    borderWidth: number;
  };
  breakEvenPoint?: {
    type: 'point';
    xValue: number;
    yValue: number;
    backgroundColor: string;
    radius: number;
  };
};

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
  Legend,
  annotationPlugin // Register annotation plugin for break-even indicator
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
  breakEvenMonth?: number; // New prop for break-even point indicator
  chartType?: string; // Chart type identifier to apply specific configurations
}

const ChartComponent: React.FC<ChartComponentProps> = ({ 
  data, 
  breakEvenMonth,
  chartType 
}) => {
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

  // Check if this is ROI comparison chart
  const isROIComparisonChart = chartType === 'roiComparison' || 
    processedData.datasets.some(dataset => dataset.label?.toLowerCase().includes('roi'));

  // Create annotation configuration if this is an ROI comparison chart
  const annotationConfig = isROIComparisonChart && breakEvenMonth && breakEvenMonth <= data.labels.length ? {
    annotation: {
      annotations: {
        breakEvenLine: {
          type: 'line' as const,
          xMin: breakEvenMonth - 0.5, // Adjust for half-bar width
          xMax: breakEvenMonth - 0.5,
          borderColor: 'rgba(255, 99, 132, 0.8)',
          borderWidth: 2,
          borderDash: [6, 4],
          label: {
            display: true,
            content: `Break-even: Month ${breakEvenMonth}`,
            position: 'start' as const,
            backgroundColor: 'rgba(255, 99, 132, 0.8)',
            font: {
              size: 12,
              weight: 'bold' as const
            },
            yAdjust: -15,
            xAdjust: 0,
            padding: 6
          }
        },
        breakEvenBox: {
          type: 'box' as const,
          xMin: Math.floor(breakEvenMonth) - 1,
          xMax: Math.ceil(breakEvenMonth) - 1,
          yMin: 0,
          yMax: 'max',
          backgroundColor: 'rgba(255, 255, 0, 0.08)',
          borderColor: 'rgba(255, 99, 132, 0.3)',
          borderWidth: 1
        },
        breakEvenPoint: {
          type: 'point' as const,
          xValue: breakEvenMonth - 1,
          yValue: 0, // Will be dynamically set based on data
          backgroundColor: 'rgba(255, 99, 132, 1)',
          radius: 6
        }
      } as ChartAnnotations
    }
  } : {};

  // Find max value for the break-even point indicator (if applicable)
  if (isROIComparisonChart && breakEvenMonth && annotationConfig.annotation) {
    // Find the maximum value in the datasets to position the break-even indicator
    let maxValue = 0;
    data.datasets.forEach(dataset => {
      if (dataset.yAxisID !== 'y1') { // Exclude percentage datasets
        const datasetMax = Math.max(...(dataset.data as number[])); 
        if (datasetMax > maxValue) {
          maxValue = datasetMax;
        }
      }
    });
    
    // Position the break-even point at a percentage of the max height
    const annotations = annotationConfig.annotation.annotations as ChartAnnotations;
    if (annotations.breakEvenPoint) {
      annotations.breakEvenPoint.yValue = maxValue * 0.85;
    }
  }

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
      },
      // Add annotation configuration if available
      ...(annotationConfig.annotation ? { annotation: annotationConfig.annotation } : {})
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