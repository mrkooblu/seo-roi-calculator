import React, { useState } from 'react';
import styled from 'styled-components';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js';
// Using require for plugins that don't have TypeScript definitions
// @ts-ignore
import ChartDataLabels from 'chartjs-plugin-datalabels';
// @ts-ignore
import ChartAnnotation from 'chartjs-plugin-annotation';
import { generateChartData, calculateBreakEvenMonth, VisualizationChartDataPoint } from '../../utils/calculations';
import type { CompetitionLevel } from '../../types/calculator';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  ChartDataLabels,
  ChartAnnotation
);

// Styled components
const PageContainer = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
  color: #2d3748;
`;

const TestGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 2rem;
  margin-top: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Controls = styled.div`
  background-color: #f7fafc;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  color: #4a5568;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  font-size: 0.875rem;
  background-color: white;
`;

const ChartContainer = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const Checkbox = styled.input`
  margin-right: 0.5rem;
`;

const RadioGroup = styled.div`
  margin-bottom: 1rem;
`;

const RadioButton = styled.input`
  margin-right: 0.5rem;
`;

const RadioLabel = styled.label`
  margin-right: 1rem;
  font-size: 0.875rem;
`;

const MetricsContainer = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const MetricCard = styled.div`
  background-color: #f7fafc;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const MetricTitle = styled.h3`
  font-size: 0.875rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
`;

const MetricValue = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: #2d3748;
`;

const DebugInfo = styled.div`
  margin-top: 2rem;
  padding: 1rem;
  background-color: #edf2f7;
  border-radius: 6px;
  font-family: monospace;
  font-size: 0.75rem;
  white-space: pre-wrap;
`;

/**
 * Development-only page for testing the break-even visualization
 * Helps verify that the break-even point indicator correctly aligns with the data
 */
const VisualizationTestPage = () => {
  const [calculatorState, setCalculatorState] = useState({
    currentTraffic: 5000,
    targetTraffic: 20000,
    conversionRate: 2,
    averageOrderValue: 100,
    monthlyCost: 3000,
    monthlyHours: 40,
    hourlyRate: 150,
    projectLength: 12,
    domainAuthority: 30,
    competitionLevel: 'medium' as CompetitionLevel,
    industryType: 'e-commerce'
  });
  
  const [chartType, setChartType] = useState<'revenue' | 'traffic' | 'combined'>('combined');
  const [showBreakEven, setShowBreakEven] = useState(true);
  const [showDataLabels, setShowDataLabels] = useState(true);
  const [smoothLines, setSmoothLines] = useState(true);
  
  // Calculate break-even point
  const chartData = generateChartData(calculatorState);
  const breakEvenMonth = calculateBreakEvenMonth(chartData);
  
  // Prepare chart data
  const labels = chartData.map((d) => `Month ${d.month}`);
  
  // Different data sets based on chart type
  const datasets = [];
  
  if (chartType === 'revenue' || chartType === 'combined') {
    datasets.push({
      label: 'Cumulative Cost',
      data: chartData.map(m => m.cumulativeCost),
      borderColor: 'rgba(239, 68, 68, 1)',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      fill: false,
      tension: smoothLines ? 0.4 : 0,
    });
    
    datasets.push({
      label: 'Cumulative Additional Revenue',
      data: chartData.map(m => m.cumulativeAdditionalRevenue),
      borderColor: 'rgba(16, 185, 129, 1)',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: false,
      tension: smoothLines ? 0.4 : 0,
    });
  }
  
  if (chartType === 'traffic' || chartType === 'combined') {
    datasets.push({
      label: 'Monthly Traffic',
      data: chartData.map(m => m.monthlyTraffic),
      borderColor: 'rgba(59, 130, 246, 1)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: false,
      tension: smoothLines ? 0.4 : 0,
      yAxisID: 'y1',
    });
  }
  
  // Chart options with explicit type annotations for plugins
  const options: ChartOptions<'line'> = {
    responsive: true,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'SEO ROI Visualization Test',
        font: {
          size: 16,
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(context.parsed.y);
            }
            return label;
          }
        }
      },
      // @ts-ignore - plugin is registered but TypeScript doesn't know the types
      datalabels: {
        display: showDataLabels,
        align: 'end',
        anchor: 'end',
        formatter: (value: number) => {
          return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            notation: 'compact',
            maximumFractionDigits: 1
          }).format(value);
        },
        font: {
          weight: 'bold'
        },
        color: (context: any) => {
          return context.dataset.borderColor as string;
        },
      },
      // @ts-ignore - plugin is registered but TypeScript doesn't know the types
      annotation: showBreakEven ? {
        annotations: {
          breakEvenLine: {
            type: 'line',
            xMin: breakEvenMonth,
            xMax: breakEvenMonth,
            borderColor: 'rgba(75, 85, 99, 1)',
            borderWidth: 2,
            borderDash: [6, 6],
            label: {
              display: true,
              content: `Break-even: Month ${breakEvenMonth.toFixed(1)}`,
              position: 'start'
            }
          }
        }
      } : {}
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Month'
        }
      },
      y: {
        type: 'linear' as const,
        display: true,
        position: 'left' as const,
        title: {
          display: true,
          text: 'Value ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + new Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value as number);
          }
        }
      },
      y1: {
        type: 'linear' as const,
        display: chartType === 'traffic' || chartType === 'combined',
        position: 'right' as const,
        title: {
          display: true,
          text: 'Traffic (visitors)'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('en-US', {
              notation: 'compact',
              maximumFractionDigits: 1
            }).format(value as number);
          }
        }
      },
    },
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    setCalculatorState(prev => ({
      ...prev,
      [name]: name === 'competitionLevel' || name === 'industryType' ? value : numValue
    }));
  };
  
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCalculatorState(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleChartTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChartType(e.target.value as 'revenue' | 'traffic' | 'combined');
  };
  
  const toggleOption = (option: 'showBreakEven' | 'showDataLabels' | 'smoothLines') => {
    if (option === 'showBreakEven') {
      setShowBreakEven(!showBreakEven);
    } else if (option === 'showDataLabels') {
      setShowDataLabels(!showDataLabels);
    } else if (option === 'smoothLines') {
      setSmoothLines(!smoothLines);
    }
  };
  
  // Calculate key metrics
  const lastMonth = chartData[chartData.length - 1];
  const totalCost = lastMonth.cumulativeCost;
  const totalRevenue = lastMonth.cumulativeAdditionalRevenue;
  const totalROI = lastMonth.cumulativeROI;
  
  // Chart dimensions for debugging
  const chartRef = React.useRef<any>(null);
  const [chartDimensions, setChartDimensions] = React.useState({ width: 0, height: 0 });
  
  React.useEffect(() => {
    if (chartRef.current) {
      const { width, height } = chartRef.current.canvas;
      setChartDimensions({ width, height });
    }
  }, [chartType, showBreakEven, showDataLabels, smoothLines]);
  
  return (
    <PageContainer>
      <Title>SEO ROI Visualization Test Page</Title>
      <p>Use this page to test and debug the chart visualization for the SEO ROI calculator.</p>
      
      <TestGrid>
        <Controls>
          <h2>Calculator Inputs</h2>
          <FormGroup>
            <Label htmlFor="currentTraffic">Current Monthly Traffic</Label>
            <Input 
              type="number" 
              id="currentTraffic" 
              name="currentTraffic" 
              value={calculatorState.currentTraffic} 
              onChange={handleInputChange} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="targetTraffic">Target Monthly Traffic</Label>
            <Input 
              type="number" 
              id="targetTraffic" 
              name="targetTraffic" 
              value={calculatorState.targetTraffic} 
              onChange={handleInputChange} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="conversionRate">Conversion Rate (%)</Label>
            <Input 
              type="number" 
              id="conversionRate" 
              name="conversionRate" 
              value={calculatorState.conversionRate} 
              onChange={handleInputChange} 
              step="0.1" 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="averageOrderValue">Average Order Value ($)</Label>
            <Input 
              type="number" 
              id="averageOrderValue" 
              name="averageOrderValue" 
              value={calculatorState.averageOrderValue} 
              onChange={handleInputChange} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="monthlyCost">Monthly SEO Cost ($)</Label>
            <Input 
              type="number" 
              id="monthlyCost" 
              name="monthlyCost" 
              value={calculatorState.monthlyCost} 
              onChange={handleInputChange} 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="projectLength">Project Length (months)</Label>
            <Input 
              type="number" 
              id="projectLength" 
              name="projectLength" 
              value={calculatorState.projectLength} 
              onChange={handleInputChange} 
              min="1" 
              max="60" 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="domainAuthority">Domain Authority (0-100)</Label>
            <Input 
              type="number" 
              id="domainAuthority" 
              name="domainAuthority" 
              value={calculatorState.domainAuthority} 
              onChange={handleInputChange} 
              min="0" 
              max="100" 
            />
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="competitionLevel">Competition Level</Label>
            <Select 
              id="competitionLevel" 
              name="competitionLevel" 
              value={calculatorState.competitionLevel} 
              onChange={handleSelectChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </Select>
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="industryType">Industry Type</Label>
            <Select 
              id="industryType" 
              name="industryType" 
              value={calculatorState.industryType} 
              onChange={handleSelectChange}
            >
              <option value="e-commerce">E-commerce</option>
              <option value="saas">SaaS</option>
              <option value="local">Local Business</option>
              <option value="other">Other</option>
            </Select>
          </FormGroup>
          
          <h3>Chart Options</h3>
          <RadioGroup>
            <div>
              <RadioButton 
                type="radio" 
                id="chartTypeRevenue" 
                name="chartType" 
                value="revenue"
                checked={chartType === 'revenue'} 
                onChange={handleChartTypeChange} 
              />
              <RadioLabel htmlFor="chartTypeRevenue">Revenue Only</RadioLabel>
            </div>
            
            <div>
              <RadioButton 
                type="radio" 
                id="chartTypeTraffic" 
                name="chartType" 
                value="traffic"
                checked={chartType === 'traffic'} 
                onChange={handleChartTypeChange} 
              />
              <RadioLabel htmlFor="chartTypeTraffic">Traffic Only</RadioLabel>
            </div>
            
            <div>
              <RadioButton 
                type="radio" 
                id="chartTypeCombined" 
                name="chartType" 
                value="combined"
                checked={chartType === 'combined'} 
                onChange={handleChartTypeChange} 
              />
              <RadioLabel htmlFor="chartTypeCombined">Combined</RadioLabel>
            </div>
          </RadioGroup>
          
          <CheckboxGroup>
            <Checkbox 
              type="checkbox" 
              id="showBreakEven" 
              checked={showBreakEven} 
              onChange={() => toggleOption('showBreakEven')} 
            />
            <Label htmlFor="showBreakEven">Show Break-even Line</Label>
          </CheckboxGroup>
          
          <CheckboxGroup>
            <Checkbox 
              type="checkbox" 
              id="showDataLabels" 
              checked={showDataLabels} 
              onChange={() => toggleOption('showDataLabels')} 
            />
            <Label htmlFor="showDataLabels">Show Data Labels</Label>
          </CheckboxGroup>
          
          <CheckboxGroup>
            <Checkbox 
              type="checkbox" 
              id="smoothLines" 
              checked={smoothLines} 
              onChange={() => toggleOption('smoothLines')} 
            />
            <Label htmlFor="smoothLines">Smooth Lines</Label>
          </CheckboxGroup>
        </Controls>
        
        <div>
          <ChartContainer>
            <Line 
              ref={chartRef}
              data={{ labels, datasets }} 
              options={options} 
            />
          </ChartContainer>
          
          <MetricsContainer>
            <MetricCard>
              <MetricTitle>Break-even Point</MetricTitle>
              <MetricValue>
                {breakEvenMonth > 0 
                  ? `Month ${breakEvenMonth.toFixed(1)}` 
                  : 'Not reached'}
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricTitle>Total Cost</MetricTitle>
              <MetricValue>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalCost)}
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricTitle>Total Additional Revenue</MetricTitle>
              <MetricValue>
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD'
                }).format(totalRevenue)}
              </MetricValue>
            </MetricCard>
            
            <MetricCard>
              <MetricTitle>Total ROI</MetricTitle>
              <MetricValue>
                {totalROI.toFixed(2)}%
              </MetricValue>
            </MetricCard>
          </MetricsContainer>
          
          <DebugInfo>
            <div>Chart dimensions: {chartDimensions.width}x{chartDimensions.height}px</div>
            <div>Data points: {chartData.length}</div>
            <div>Break-even month: {breakEvenMonth > 0 ? breakEvenMonth.toFixed(2) : 'Not reached'}</div>
          </DebugInfo>
        </div>
      </TestGrid>
    </PageContainer>
  );
};

export default VisualizationTestPage; 