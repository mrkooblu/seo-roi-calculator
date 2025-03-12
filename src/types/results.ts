export interface CalculationResults {
  monthlyTraffic: number;
  monthlyConversions: number;
  monthlyRevenue: number;
  monthlyCost: number;
  monthlyProfit: number;
  monthlyROI: number;
  annualROI: number;
  dollarReturn: number;
  breakEvenPoint: number;
  annualRevenue: number;
  annualProfit: number;
  annualInvestment: number;
  netProfit: number;
}

export interface ChartDataPoint {
  month: string;
  cumulativeInvestment: number;
  cumulativeProfit: number;
  cumulativeROI: number;
}

export interface RecommendationItem {
  title: string;
  description: string;
  items: string[];
}

export interface ROIResults {
  calculations: CalculationResults;
  chartData: ChartDataPoint[];
  recommendations: RecommendationItem[];
} 