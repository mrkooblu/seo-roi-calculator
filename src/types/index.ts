// General types
export interface CalculatorState {
  // Basic calculator inputs
  currentTraffic: number;
  targetTraffic: number;
  conversionRate: number;
  averageOrderValue: number;
  monthlySEOCost: number;
  
  // Advanced calculator inputs
  keywordDifficulty: number;
  competitionLevel: 'low' | 'medium' | 'high';
  industryType: 'ecommerce' | 'saas' | 'local' | 'other';
  contentInvestment: number;
  linkBuildingInvestment: number;
  technicalSEOInvestment: number;
  
  // Other state
  timeframe: number; // in months
  
  // Error state
  error?: string | null; // Optional error message for validation failures
}

export interface CalculationResults {
  // Basic metrics
  initialRevenue: number;
  projectedRevenue: number;
  revenueIncrease: number;
  averageMonthlyIncrease: number; // Average revenue increase per month across the timeframe
  totalSEOCost: number;
  roi: number;
  breakEvenMonth: number;
  
  // Advanced metrics
  trafficGrowthChart: ChartData;
  revenueGrowthChart: ChartData;
  roiComparisonChart: ChartData;
  
  // Recommendations
  recommendations: RecommendationItem[];
}

// Form validation types
export interface ValidationErrors {
  [key: string]: string;
}

// Chart-related types
export interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

export interface Dataset {
  label: string;
  data: number[];
  backgroundColor?: string;
  borderColor?: string;
  borderWidth?: number;
  type?: 'bar' | 'line';
  yAxisID?: string;
}

// Recommendation types
export interface RecommendationItem {
  title: string;
  description: string;
  items?: string[];
  ctaUrl?: string;
  ctaText?: string;
} 