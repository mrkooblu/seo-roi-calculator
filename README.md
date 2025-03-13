# SEO ROI Calculator

A sophisticated web application for calculating the return on investment (ROI) of SEO campaigns. Built with Next.js, TypeScript, and Styled-Components.

## Features

- **Basic and Advanced Calculator Modes**: Choose between simplified and detailed input options
- **Comprehensive ROI Analysis**: Calculate key metrics like projected revenue, ROI percentage, and break-even point
- **Interactive Charts**: Visualize traffic growth, revenue projections, and ROI comparison
- **Tailored Recommendations**: Get strategic recommendations based on your specific inputs
- **Form Validation**: Ensures accurate data entry and meaningful results
- **Tooltips**: Helpful information for each input field
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Technology Stack

- **Next.js**: For server-side rendering and optimal SEO
- **TypeScript**: For type safety and improved developer experience
- **Styled-Components**: For component-based styling
- **Chart.js**: For data visualization
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
2. **Organic CTR (%)**: The percentage of impressions that result in clicks
3. **Keyword Difficulty**: Measures how competitive your target keywords are (1-100)
4. **Competition Level**: Your industry's SEO competitiveness (Low/Medium/High)
5. **Industry Type**: Your business category for tailored recommendations
6. **Investment Breakdown**: How your SEO budget is allocated (Content/Link Building/Technical SEO)

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
│   └── Results/       # Results visualization components
├── hooks/             # Custom React hooks
├── pages/             # Next.js pages
├── styles/            # Global styles and theme
│   ├── theme.ts       # Theme configuration
│   └── GlobalStyle.ts # Global style settings
└── types/             # TypeScript type definitions
```

## Component Documentation

### Calculator Components

- **Calculator**: Main container that manages calculator mode and results display
- **BasicCalculator**: Simplified calculator with essential metrics
- **AdvancedCalculator**: Detailed calculator with additional options

### Form Components

- **FormGroup**: Wrapper for form inputs with label, tooltip, and error handling
- **InputGroup**: Input component with prefix/suffix support
- **Tooltip**: Provides contextual help information

### Results Components

- **Results**: Displays calculation results, charts, and recommendations
- **ROIChart**: Renders interactive charts using Chart.js
- **Recommendations**: Shows tailored SEO strategy recommendations

### Layout Components

- **Layout**: Main layout wrapper with theme provider
- **Container**: Responsive container with consistent width
- **Header**: Application header with navigation

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
