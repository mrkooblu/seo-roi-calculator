// DOM ready event
document.addEventListener('DOMContentLoaded', function() {
    // Set default values for basic calculator
    document.getElementById('click-through-rate').value = 3.5;
    document.getElementById('conversion-rate').value = 2.5;
    document.getElementById('lifetime-value-multiplier').value = 1;
    document.getElementById('profit-margin').value = 50;
    document.getElementById('time-period').value = 12;

    // Set placeholders
    document.getElementById('keywords').placeholder = "e.g., 15";
    document.getElementById('avg-monthly-sv').placeholder = "e.g., 500";
    document.getElementById('avg-order-value').placeholder = "e.g., 100";
    document.getElementById('seo-investment').placeholder = "e.g., 2500";

    // Fix: Properly handle Advanced Options toggle
    const toggleAdvancedBtn = document.querySelector('.toggle-advanced');
    toggleAdvancedBtn.addEventListener('click', function(e) {
        e.preventDefault(); // Prevent default behavior
        const advancedInputs = document.querySelector('.advanced-inputs');
        advancedInputs.classList.toggle('show');

        if (advancedInputs.classList.contains('show')) {
            this.textContent = '- Hide Advanced Options';
        } else {
            this.textContent = '+ Show Advanced Options';
        }
    });

    // Fix: Tab Switching - ensure proper activation/deactivation
    const tabs = document.querySelectorAll('.tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');

            // Hide all tab contents
            const tabContents = document.querySelectorAll('.tab-content');
            tabContents.forEach(content => {
                content.classList.remove('active');
            });

            // Show the corresponding tab content
            const tabContent = document.querySelector(`.tab-content[data-tab-content="${this.dataset.tab}"]`);
            if (tabContent) {
                tabContent.classList.add('active');
            }
        });
    });

    // Form Submission
    document.getElementById('roi-calculator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            calculateROI();
        }
    });

    document.getElementById('advanced-calculator-form').addEventListener('submit', function(e) {
        e.preventDefault();
        if (validateForm()) {
            calculateAdvancedROI();
        }
    });
});
    // ROI Calculation Function
    function calculateROI() {
        // Get input values
        const keywords = parseFloat(document.getElementById('keywords').value) || 0;
        const avgMonthlySV = parseFloat(document.getElementById('avg-monthly-sv').value) || 0;
        const ctr = parseFloat(document.getElementById('click-through-rate').value) || 0;
        const conversionRate = parseFloat(document.getElementById('conversion-rate').value) || 0;
        const avgOrderValue = parseFloat(document.getElementById('avg-order-value').value) || 0;
        const seoInvestment = parseFloat(document.getElementById('seo-investment').value) || 0;

        // Get advanced input values
        const lifetimeValueMultiplier = parseFloat(document.getElementById('lifetime-value-multiplier').value) || 1;
        const profitMargin = parseFloat(document.getElementById('profit-margin').value) || 50;
        const timePeriod = parseFloat(document.getElementById('time-period').value) || 12;

        // Calculate results
        const monthlyTraffic = keywords * avgMonthlySV * (ctr / 100);
        const monthlyConversions = monthlyTraffic * (conversionRate / 100);
        const monthlyRevenue = monthlyConversions * avgOrderValue * lifetimeValueMultiplier;
        const monthlyProfit = monthlyRevenue * (profitMargin / 100);
        const monthlyROI = seoInvestment > 0 ? ((monthlyProfit - seoInvestment) / seoInvestment) * 100 : 0;
        const annualROI = seoInvestment > 0 ? ((monthlyProfit * timePeriod - seoInvestment * timePeriod) / (seoInvestment * timePeriod)) * 100 : 0;
        const dollarReturn = seoInvestment > 0 ? monthlyProfit / seoInvestment : 0;

        const annualRevenue = monthlyRevenue * timePeriod;
        const annualProfit = monthlyProfit * timePeriod;
        const annualInvestment = seoInvestment * timePeriod;
        const netProfit = annualProfit - annualInvestment;

        // Calculate break-even point (in months)
        const breakevenPoint = monthlyProfit > 0 ? seoInvestment / monthlyProfit : Infinity;

        // Update results
        document.getElementById('monthly-traffic').textContent = Math.round(monthlyTraffic).toLocaleString();
        document.getElementById('monthly-conversions').textContent = monthlyConversions.toFixed(1);
        document.getElementById('monthly-revenue').textContent = '$' + monthlyRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('monthly-cost').textContent = '$' + seoInvestment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('monthly-roi').textContent = monthlyROI.toFixed(2) + '%';
        document.getElementById('annual-roi').textContent = annualROI.toFixed(2) + '%';
        document.getElementById('dollar-return').textContent = '$' + dollarReturn.toFixed(2);

        document.getElementById('breakeven-point').textContent = isFinite(breakevenPoint) ? breakevenPoint.toFixed(1) + ' months' : 'N/A';
        document.getElementById('annual-revenue').textContent = '$' + annualRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('annual-profit').textContent = '$' + annualProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('annual-investment').textContent = '$' + annualInvestment.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        document.getElementById('net-profit').textContent = '$' + netProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");

        // Generate recommendations
        generateRecommendations(monthlyROI, breakevenPoint, conversionRate, ctr, keywords, avgMonthlySV);

        // Create chart
        createROIChart(timePeriod, seoInvestment, monthlyProfit);

        // Show results
        document.getElementById('results').classList.add('show');

        // Scroll to results
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }

    // Generate Recommendations based on results
    function generateRecommendations(monthlyROI, breakevenPoint, conversionRate, ctr, keywords, avgMonthlySV) {
        const recommendationsElement = document.getElementById('recommendations');
        let recommendations = '';

        // ROI-based recommendations
        if (monthlyROI < 0) {
            recommendations += `<p><strong>Your current SEO ROI is negative.</strong> Here are some ways to improve:</p>
            <ul>
                <li>Focus on higher-converting keywords that align with your business goals</li>
                <li>Improve your website's conversion rate with better landing pages and user experience</li>
                <li>Reduce SEO costs by focusing on the most effective strategies</li>
                <li>Consider increasing your average order value through upselling or cross-selling</li>
            </ul>`;
        } else if (monthlyROI < 50) {
            recommendations += `<p><strong>Your SEO ROI is positive but could be improved.</strong> Consider these strategies:</p>
            <ul>
                <li>Target more high-intent keywords to attract users closer to making a purchase</li>
                <li>Optimize your highest-traffic pages for better conversion rates</li>
                <li>Implement A/B testing to identify what drives better results</li>
            </ul>`;
        } else {
            recommendations += `<p><strong>Your SEO ROI is strong!</strong> To maintain and improve:</p>
            <ul>
                <li>Continue expanding your keyword targeting to capture more market share</li>
                <li>Reinvest some of your profits into scaling successful SEO strategies</li>
                <li>Consider diversifying your traffic sources while maintaining your SEO advantage</li>
            </ul>`;
        }

        // Break-even point recommendations
        if (isFinite(breakevenPoint)) {
            if (breakevenPoint > 12) {
                recommendations += `<p><strong>Your break-even point is longer than 12 months.</strong> To speed up your ROI:</p>
                <ul>
                    <li>Focus on quick-win keywords that can rank faster</li>
                    <li>Optimize existing content that's already getting some traffic</li>
                    <li>Consider adjusting your SEO budget allocation for better efficiency</li>
                </ul>`;
            } else if (breakevenPoint > 6) {
                recommendations += `<p><strong>Your break-even point is between 6-12 months,</strong> which is typical for SEO campaigns. Keep optimizing to improve this timeline.</p>`;
            } else {
                recommendations += `<p><strong>Your break-even point is less than 6 months,</strong> which is excellent for an SEO campaign!</p>`;
            }
        }

        // Conversion rate recommendations
        if (conversionRate < 1) {
            recommendations += `<p><strong>Your conversion rate is below average.</strong> Focus on conversion rate optimization (CRO):</p>
            <ul>
                <li>Improve your call-to-action buttons and placement</li>
                <li>Streamline your checkout or lead capture process</li>
                <li>Add social proof and testimonials to build trust</li>
                <li>Ensure your site is mobile-friendly and loads quickly</li>
            </ul>`;
        }

        // CTR recommendations
        if (ctr < 2) {
            recommendations += `<p><strong>Your click-through rate is low.</strong> To improve:</p>
            <ul>
                <li>Optimize your meta titles and descriptions to be more compelling</li>
                <li>Use schema markup to enhance your search results appearance</li>
                <li>Target featured snippets to increase visibility</li>
                <li>Improve your brand recognition to encourage more clicks</li>
            </ul>`;
        }

        // Keyword recommendations
        if (keywords < 5) {
            recommendations += `<p><strong>You're targeting relatively few keywords.</strong> Consider:</p>
            <ul>
                <li>Expanding your content strategy to cover more relevant topics</li>
                <li>Creating topic clusters around your main keywords</li>
                <li>Targeting long-tail variations of your primary keywords</li>
            </ul>`;
        }

        recommendationsElement.innerHTML = recommendations;
    }

    // Create ROI Chart
    function createROIChart(timePeriod, monthlyCost, monthlyProfit) {
        const chartElement = document.getElementById('roi-chart');

        // Clear any existing chart
        chartElement.innerHTML = '';
        const canvas = document.createElement('canvas');
        chartElement.appendChild(canvas);

        // Generate data for the chart
        const labels = [];
        const investmentData = [];
        const profitData = [];
        const cumulativeROIData = [];

        let cumulativeInvestment = 0;
        let cumulativeProfit = 0;

        for (let i = 1; i <= timePeriod; i++) {
            labels.push(`Month ${i}`);

            cumulativeInvestment += monthlyCost;
            investmentData.push(cumulativeInvestment);

            cumulativeProfit += monthlyProfit;
            profitData.push(cumulativeProfit);

            const monthlyROI = cumulativeInvestment > 0 ? (cumulativeProfit - cumulativeInvestment) / cumulativeInvestment * 100 : 0;
            cumulativeROIData.push(monthlyROI);
        }

        // Create the chart
        new Chart(canvas, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Cumulative Investment ($)',
                        data: investmentData,
                        backgroundColor: 'rgba(255, 99, 132, 0.5)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 1,
                        order: 2
                    },
                    {
                        label: 'Cumulative Profit ($)',
                        data: profitData,
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgb(75, 192, 192)',
                        borderWidth: 1,
                        order: 1
                    },
                    {
                        label: 'Cumulative ROI (%)',
                        data: cumulativeROIData,
                        type: 'line',
                        borderColor: '#0093fe',
                        backgroundColor: 'rgba(0, 147, 254, 0.1)',
                        borderWidth: 2,
                        fill: true,
                        yAxisID: 'y1',
                        order: 0
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        title: {
                            display: true,
                            text: 'Amount ($)'
                        },
                        beginAtZero: true
                    },
                    y1: {
                        position: 'right',
                        title: {
                            display: true,
                            text: 'ROI (%)'
                        },
                        beginAtZero: true,
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                },
                plugins: {
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }

                                if (context.datasetIndex === 2) {
                                    label += context.raw.toFixed(2) + '%';
                                } else {
                                    label += '$' + context.raw.toFixed(2);
                                }

                                return label;
                            }
                        }
                    },
                    legend: {
                        position: 'top'
                    },
                    title: {
                        display: true,
                        text: 'SEO Investment vs. Profit Over Time'
                    }
                }
            }
        });
    }

    // Advanced ROI Calculation Function
    function calculateAdvancedROI() {
        // Get values from advanced form
        const seoGoal = document.getElementById('seo-campaign-goal').value;
        const currentRankings = document.getElementById('current-rankings').value;
        const competitionLevel = document.getElementById('competition-level').value;

        // Get investment breakdown
        const contentInvestment = parseFloat(document.getElementById('content-investment').value) || 0;
        const linkBuildingInvestment = parseFloat(document.getElementById('link-building-investment').value) || 0;
        const technicalSEOInvestment = parseFloat(document.getElementById('technical-seo-investment').value) || 0;
        const localSEOInvestment = parseFloat(document.getElementById('local-seo-investment').value) || 0;
        const toolsInvestment = parseFloat(document.getElementById('tools-investment').value) || 0;

        const totalInvestment = contentInvestment + linkBuildingInvestment + technicalSEOInvestment + localSEOInvestment + toolsInvestment;

        // Set default values based on selections
        let defaultKeywords = 10;
        let defaultSearchVolume = 500;
        let defaultCTR = 3.5;
        let defaultConversionRate = 2.5;

        // Adjust based on competition level
        if (competitionLevel === 'high') {
            defaultCTR -= 1;
            defaultKeywords -= 3;
        } else if (competitionLevel === 'low') {
            defaultCTR += 1;
            defaultKeywords += 5;
        }

        // Adjust based on current rankings
        if (currentRankings === 'new') {
            defaultKeywords = Math.max(5, defaultKeywords - 5);
        } else if (currentRankings === 'high') {
            defaultKeywords += 10;
            defaultCTR += 1;
        }

        // Adjust based on goal
        if (seoGoal === 'leads') {
            defaultConversionRate = 3.5;
        } else if (seoGoal === 'brand') {
            defaultConversionRate = 1.0;
        } else if (seoGoal === 'traffic') {
            defaultCTR += 2;
            defaultConversionRate = 1.5;
        }

        // Set values in the basic calculator
        if (!document.getElementById('keywords').value) {
            document.getElementById('keywords').value = defaultKeywords;
        }

        if (!document.getElementById('avg-monthly-sv').value) {
            document.getElementById('avg-monthly-sv').value = defaultSearchVolume;
        }

        document.getElementById('click-through-rate').value = defaultCTR;
        document.getElementById('conversion-rate').value = defaultConversionRate;
        document.getElementById('seo-investment').value = totalInvestment;

        // Switch to basic tab
        document.querySelector('.tab[data-tab="basic"]').click();

        // Calculate ROI using basic function
        calculateROI();
    }

    // Form validation
    function validateForm() {
        const requiredFields = document.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
        });

        return isValid;
    }