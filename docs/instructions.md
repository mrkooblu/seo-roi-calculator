# SEO ROI Calculator - Technical Specification

## Project Overview
Convert the existing SEO ROI Calculator from vanilla HTML, CSS, and JavaScript to a modern React application using Next.js with TypeScript. The calculator helps users estimate the return on investment of their SEO efforts by analyzing various metrics like keywords, search volume, conversion rates, and investment costs.

## Current Implementation
The current implementation consists of:
- Single HTML file with embedded JavaScript and references to external CSS
- Vanilla JavaScript for calculations and DOM manipulation
- Chart.js for data visualization
- CSS for styling and responsive design

## Current Implementation Analysis
A detailed analysis of the existing codebase to be migrated:

### HTML Structure (`index.html`)
- Main container with calculator cards and results sections
- Form elements for basic and advanced calculator inputs
- Tab switching mechanism between basic and advanced modes
- Results display with metrics, charts, and recommendations
- Implementation of tooltips for helper information

### JavaScript Functionality (`script.js`)
Key functions to be migrated:
- `calculateROI()`: Core calculation function for basic metrics
- `calculateAdvancedROI()`: Extended calculation for advanced options
- `generateRecommendations()`: Creates dynamic recommendations based on results
- `createROIChart()`: Chart.js implementation for data visualization
- `validateForm()`: Form validation logic
- Event handlers for form submission and UI interaction
- Tab switching logic between calculator modes
- Toggle functionality for advanced options

### CSS Styling (`style.css`)
Key styling components to be converted:
- Reset and base styles for consistent rendering
- Typography settings for headings and body text
- Layout containers and card styling
- Form element styling (inputs, labels, buttons)
- Results display styling with appropriate visual hierarchy
- Chart container styling
- Tooltip implementation
- Responsive design breakpoints and adaptations
- Animation and transition effects

The conversion will map these existing components to React components and TypeScript interfaces while maintaining the same visual design and user experience but with improved code organization and type safety.

## Target Implementation
We'll convert this to:
- Next.js application with React components, fully typed with TypeScript
- Organized component structure with proper type definitions
- React state management using hooks with typed state
- Styled components or CSS modules
- Preserved functionality and UI

## Key Features to Preserve
- Basic calculator functionality
- Advanced calculator with additional options
- Tab switching between basic and advanced modes
- Form validation
- Results display with metrics
- Chart visualization of ROI over time
- Recommendations engine
- Responsive design
- Tooltip functionality

## Style Guide
Based on the Exploding Topics design, our SEO ROI Calculator will follow these style guidelines:

### Color Palette
- **Primary Blue**: #0066FF (for buttons, links, and primary actions)
- **Success Green**: #10b981 (for positive metrics, growth indicators)
- **Background**: #f8fafc (light gray for page background)
- **Card Background**: #FFFFFF (white for cards and content areas)
- **Text Primary**: #1e293b (dark gray/almost black for primary text)
- **Text Secondary**: #64748b (medium gray for secondary text)
- **Border Color**: #e2e8f0 (light gray for borders)
- **Chart Colors**:
  - Line: #0066FF
  - Area Fill: rgba(0, 102, 255, 0.1) (transparent blue gradient)
  - Secondary metrics: #10b981 (green), #f97316 (orange), #ef4444 (red)

### Typography
- **Primary Font**: Inter, system-ui, sans-serif
- **Headings**:
  - H1: 32px/40px, 700 weight
  - H2: 24px/32px, 600 weight
  - H3: 20px/28px, 600 weight
- **Body Text**: 16px/24px, 400 weight
- **Small Text**: 14px/20px, 400 weight
- **Metric Values**: 18px/24px, 600 weight
- **Growth Indicators**: 14px/20px, 500 weight

### Layout & Spacing
- **Container Width**: Max-width 1200px, centered
- **Card Padding**: 24px
- **Grid Gap**: 24px
- **Section Spacing**: 48px between major sections
- **Border Radius**:
  - Cards and Buttons: 8px
  - Inputs: 6px
  - Chips/Tags: 16px (fully rounded)

### Component Styling

#### Cards
- White background (#FFFFFF)
- Border radius: 8px
- Box shadow: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)
- Padding: 24px

#### Buttons
- Primary: #0066FF background, white text
- Border radius: 8px
- Padding: 10px 16px
- Font weight: 500
- Transition: background-color 0.2s ease
- Hover state: Slightly darker shade

#### Form Elements
- Input fields with clear borders
- Border radius: 6px
- Padding: 10px 12px
- Focus state: Blue border or outline
- Error state: Red border or outline

#### Metrics Display
- Clear label/value pairs
- Value in larger/bolder text than label
- Growth indicators with appropriate colors:
  - Positive growth: Green (#10b981)
  - Negative: Red (#ef4444)
- Format: "+99%" with strong visual emphasis

#### Charts
- Clean, minimal design
- Light grid lines (#e2e8f0)
- Smooth curved lines
- Gradient area fill below lines
- Responsive sizing
- Clear labels and values
- Consistent color scheme with the rest of the UI

### Responsive Design
- **Breakpoints**:
  - Mobile: < 640px
  - Tablet: 640px - 1024px
  - Desktop: > 1024px
- **Mobile Adaptations**:
  - Single column layout
  - Stacked cards
  - Simplified charts
  - Larger touch targets
- **Animation**:
  - Subtle transitions for tab switching
  - Smooth loading states
  - Gentle hover effects

### UI Patterns
- Clean card-based UI for distinct sections
- Clear visual hierarchy with appropriate spacing
- Metrics prominently displayed with growth indicators
- Consistent action patterns (primary actions in blue)
- Focus on readability and clear data presentation
- Use of whitespace to prevent visual overload

This style guide will ensure our SEO ROI Calculator has a modern, professional appearance aligned with contemporary SaaS and analytics tools like Exploding Topics.

## Project Structure
```
seo_roi_calculator/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── Calculator/
│   │   │   ├── BasicCalculator.tsx
│   │   │   ├── AdvancedCalculator.tsx
│   │   │   ├── CalculatorTabs.tsx
│   │   │   └── index.tsx
│   │   ├── Form/
│   │   │   ├── FormGroup.tsx
│   │   │   ├── InputGroup.tsx
│   │   │   └── Tooltip.tsx
│   │   ├── Results/
│   │   │   ├── ResultCard.tsx
│   │   │   ├── ResultItem.tsx
│   │   │   ├── ROIChart.tsx
│   │   │   └── Recommendations.tsx
│   │   └── Layout/
│   │       ├── Header.tsx
│   │       └── Container.tsx
│   ├── hooks/
│   │   ├── useCalculator.ts
│   │   └── useAdvancedCalculator.ts
│   ├── utils/
│   │   ├── calculations.ts
│   │   └── formatters.ts
│   ├── types/
│   │   ├── calculator.ts
│   │   ├── results.ts
│   │   └── forms.ts
│   ├── styles/
│   │   ├── globals.css
│   │   └── Home.module.css
│   └── pages/
│       ├── _app.tsx
│       ├── _document.tsx
│       └── index.tsx
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Type Definitions
We'll create the following TypeScript interfaces and types:

1. **CalculatorInputs**
   - Type definitions for all inputs in the basic calculator form
   - Proper typing for numeric values and string inputs

2. **AdvancedCalculatorInputs**
   - Type definitions for the advanced calculator form inputs
   - Union types for dropdown selections

3. **CalculationResults**
   - Interface for calculation results with proper typings
   - Numeric types for financial calculations

4. **ChartData**
   - Type definitions for chart data structure
   - Compatible with react-chartjs-2 typing requirements

## State Management
We'll use React's useState and useContext hooks to manage:
- Form input values (with proper TypeScript interfaces)
- Calculator tab state (with union or enum types)
- Advanced options visibility (boolean type)
- Calculation results (with defined result interfaces)
- Chart data (with chart data type definitions)

## Component Breakdown
1. **Calculator Container**
   - Manages overall calculator state with typed props and state
   - Handles tab switching logic
   - Contains BasicCalculator and AdvancedCalculator components

2. **BasicCalculator**
   - Form inputs for basic metrics with proper prop types
   - Advanced options toggle
   - Calculate button
   - Form validation with type-safe validation

3. **AdvancedCalculator**
   - Form inputs for advanced metrics with TypeScript interfaces
   - SEO investment breakdown
   - Calculate button
   - Form validation

4. **Results Section**
   - Conditionally rendered based on calculation state
   - Contains result cards and chart
   - Displays recommendations
   - All props properly typed

5. **ROIChart**
   - Renders Chart.js visualization with TypeScript support
   - Displays investment, profit, and ROI over time
   - Type-safe chart configuration

6. **Common Form Components**
   - FormGroup: Wraps label and input with generic props
   - InputGroup: Handle input with prefix/suffix
   - Tooltip: Information tooltips
   - All with properly typed props

## Dependencies
- next
- react
- react-dom
- typescript
- @types/react
- @types/react-dom
- @types/node
- chart.js
- react-chartjs-2 (React wrapper for Chart.js)
- styled-components (optional, for CSS-in-JS)
- @types/styled-components (if using styled-components)

## Implementation Steps
1. Set up Next.js project structure with TypeScript configuration
2. Define core interfaces and types
3. Create base components (Layout, Container) with proper typing
4. Implement form components and styling with typed props
5. Create calculator logic in hooks with TypeScript interfaces
6. Implement results display components with proper type definitions
7. Set up chart visualization with react-chartjs-2 and TypeScript
8. Add recommendations logic with appropriate typings
9. Implement responsive design
10. Add form validation with type-safe error handling
11. Test across various devices and browsers

## Performance Considerations
- Use React.memo with proper generic types for components that don't need frequent re-renders
- Optimize chart rendering for performance
- Add proper error handling with TypeScript's error types
- Ensure accessibility standards are met
- Use Next.js image optimization
- Leverage TypeScript's type checking for runtime error prevention

## Future Enhancements
- Save calculations to localStorage with typed persistence
- Add ability to export results as PDF
- Create comparison feature for multiple scenarios
- Add more advanced visualization options
- Implement dark mode
- Type-safe API integration for additional data sources

## Timeline
- Setup and TypeScript configuration: 1 day
- Component structure and type definitions: 1 day
- Calculator logic implementation: 1 day
- Results and visualization: 1 day
- Styling and responsive design: 1 day
- Testing and refinement: 1 day

Total estimated time: 6 days
