# SEO ROI Calculator

A comprehensive tool to calculate and visualize the return on investment for SEO campaigns.

## Key Features

- **Advanced Traffic Growth Modeling**: Utilizes an S-curve growth model adjusted for domain authority, competition level, and industry type
- **Precise Break-Even Calculation**: Determines the exact month when SEO investment begins generating positive ROI, with fractional month precision
- **Interactive Visualization**: Clear charts showing traffic growth, revenue projections, and ROI over time
- **Visual Break-Even Indicator**: Clearly highlights the break-even point on charts
- **Comprehensive Testing Framework**: Ensures calculation accuracy and consistency

## Recent Improvements

### Enhanced Calculation Precision

- Refined traffic growth model incorporating domain authority, competition, and industry factors
- Implemented S-curve growth pattern for realistic traffic projections
- Added fractional month precision for break-even point calculation using linear interpolation

### Unified Calculation Pipeline

- Centralized calculation functions for better maintainability
- Improved type safety with proper TypeScript interfaces
- Consistent methodology across all chart types

### Improved Chart Clarity

- Added visual break-even indicator with vertical line and highlighted region
- Enhanced tooltip information for better data interpretation
- Consistent styling across all visualization components

### Robust Testing Framework

- Added unit tests for core calculation functions
- Created consistency verification between different calculation methods
- Added visualization validation tools for break-even indicator

## Development Tools

### Running Tests

To verify calculations are working correctly, visit the test utility:

```
/dev/test-calculator
```

This page runs a suite of tests to ensure consistency between:
- Break-even calculations and chart data
- Traffic projection algorithms
- Revenue projections

### Visual Validation

To validate the visual representation of the break-even indicator:

```
/dev/visualization-test
```

This tool allows you to:
- Adjust calculation inputs and see how the break-even indicator responds
- Verify that the indicator position matches the calculated break-even month
- Test different scenarios with varying growth patterns

## Calculation Methodology

### Traffic Growth Model

The traffic projection uses an S-curve growth pattern:
1. Initial slow growth phase
2. Accelerated middle growth phase
3. Plateau as it approaches the target traffic

Growth factors are adjusted based on:
- Keyword difficulty
- Competition level
- Industry type
- Current domain authority

### Break-Even Calculation

The break-even point is calculated by:
1. Generating monthly traffic projections
2. Converting traffic to revenue using conversion rate and average order value
3. Calculating cumulative cost and revenue increase for each month
4. Finding the exact point (with fractional precision) where cumulative revenue equals cumulative cost

## Troubleshooting

If the calculations seem inconsistent:

1. Check that all inputs have reasonable values
2. Verify that traffic projections follow expected growth patterns
3. Run the test utility to check for calculation errors
4. Use the visualization test to verify break-even indicator placement

## Features

- **Basic and Advanced Calculator Modes**: Choose between simplified and detailed input options
- **Comprehensive ROI Analysis**: Calculate key metrics like projected revenue, ROI percentage, and break-even point
- **Interactive Charts**: Visualize traffic growth, revenue projections, and ROI comparison
- **Tailored Recommendations**: Get strategic recommendations based on your specific inputs
- **Form Validation**: Ensures accurate data entry and meaningful results
- **Tooltips**: Helpful information for each input field
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Next.js**: For optimized rendering and improved performance
- **TypeScript**: For type safety and improved developer experience
- **Styled-Components**: For component-based styling
- **Chart.js**: For data visualization with annotations and custom tooltips
- **React**: For building the UI components

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/seo-roi-calculator.git
   cd seo-roi-calculator
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## How to Use

### Basic Calculator

The Basic Calculator allows you to enter the essential metrics needed to calculate SEO ROI:

1. **Current Monthly Organic Traffic**: Your website's current monthly organic search visitors
2. **Target Monthly Organic Traffic**: Your goal for monthly organic visitors after SEO improvements
3. **Conversion Rate (%)**: The percentage of visitors who complete desired actions (e.g., purchases)
4. **Average Order Value ($)**: The average revenue generated per conversion
5. **Monthly SEO Investment ($)**: Your monthly spend on SEO services and resources
6. **Timeframe (Months)**: The period over which you want to calculate ROI

### Advanced Calculator

The Advanced Calculator provides additional options for more detailed analysis:

1. **All Basic Calculator Fields**: Includes all metrics from the Basic Calculator
2. **Keyword Difficulty**: Measures how competitive your target keywords are (1-100)
3. **Competition Level**: Your industry's SEO competitiveness (Low/Medium/High)
4. **Industry Type**: Your business category for tailored recommendations
5. **Investment Breakdown**: How your SEO budget is allocated (Content/Link Building/Technical SEO)

### Understanding Results

After calculating, you'll see comprehensive results:

1. **Key Metrics**:
   - Initial Monthly Revenue
   - Projected Monthly Revenue
   - Monthly Revenue Increase
   - Total SEO Investment
   - Return on Investment (%)
   - Break-even Month

2. **Visualizations**:
   - Traffic Growth Projection
   - Revenue Growth Projection
   - ROI Comparison

3. **Recommendations**:
   - Tailored SEO strategy suggestions
   - Industry-specific recommendations
   - Budget allocation advice

## Project Structure

```
src/
├── components/        # React components
│   ├── Calculator/    # Calculator components
│   ├── Form/          # Form input components
│   ├── Layout/        # Layout components
│   ├── common/        # Shared UI components
│   └── Results/       # Results visualization components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages
├── styles/            # Global styles and theme
│   ├── theme.ts       # Theme configuration
│   └── GlobalStyle.ts # Global style settings
├── utils/             # Utility functions
└── types/             # TypeScript type definitions
```

## Component Documentation

### Calculator Components

- **Calculator**: Main container that manages calculator mode and results display
- **BasicCalculator**: Simplified calculator with essential metrics
- **AdvancedCalculator**: Detailed calculator with additional options
- **CalculatorTabs**: Navigation between Basic and Advanced calculator modes

### Form Components

- **FormGroup**: Wrapper for form inputs with label, tooltip, and error handling
- **InputGroup**: Input component with prefix/suffix support
- **Tooltip**: Provides contextual help information

### Results Components

- **Results**: Displays calculation results, charts, and recommendations
- **ROIChart**: Renders interactive charts using Chart.js
- **ChartComponent**: Core chart rendering with break-even annotations
- **ResultItem**: Displays individual metric results
- **Recommendations**: Shows tailored SEO strategy recommendations

### Layout Components

- **Layout**: Main layout wrapper with theme provider
- **Container**: Responsive container with consistent width
- **PageHeader**: Application header with title and description

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by modern SaaS and analytics tools
- Chart.js for data visualization
- Next.js team for the fantastic framework
