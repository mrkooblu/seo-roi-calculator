import React from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { theme } from '../../styles/theme';
import GlobalStyle from '../../styles/GlobalStyle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <LayoutWrapper>
        {children}
      </LayoutWrapper>
    </ThemeProvider>
  );
};

const LayoutWrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default Layout; 