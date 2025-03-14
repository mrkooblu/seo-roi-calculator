import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Layout/Container';
import PageHeader from '../components/Layout/PageHeader';
import Calculator from '../components/Calculator';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>SEO ROI Calculator</title>
        <meta
          name="description"
          content="Calculate the return on investment (ROI) of your SEO efforts with our advanced SEO ROI calculator."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5.0, minimum-scale=1" />
        <meta name="theme-color" content="#4F46E5" />
      </Head>

      <Main>
        <Container>
          <PageHeader 
            title="SEO ROI Calculator" 
            description="Estimate the financial impact of your SEO investments with our interactive calculator. Enter your traffic metrics, conversion rates, and investment details to get a comprehensive analysis of your projected ROI, break-even point, and tailored strategy recommendations."
          />
          <Calculator />
        </Container>
      </Main>
    </>
  );
};

const Main = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.xl} 0;
`;

export default Home; 