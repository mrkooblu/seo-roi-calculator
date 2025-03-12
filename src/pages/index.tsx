import React from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Container from '../components/Layout/Container';
import Header from '../components/Layout/Header';
import Calculator from '../components/Calculator';

const Home: React.FC = () => {
  return (
    <>
      <Head>
        <title>Advanced SEO ROI Calculator</title>
        <meta
          name="description"
          content="Calculate the return on investment (ROI) of your SEO efforts with our advanced SEO ROI calculator."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Main>
        <Container>
          <Header />
          <Calculator />
        </Container>
      </Main>
    </>
  );
};

const Main = styled.main`
  min-height: 100vh;
  background-color: ${({ theme }) => theme.colors.background};
`;

export default Home; 