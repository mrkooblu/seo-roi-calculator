import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html,
  body {
    font-family: ${theme.typography.fontFamily};
    font-size: ${theme.typography.body.fontSize};
    line-height: ${theme.typography.body.lineHeight};
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.md};
    line-height: 1.2;
  }

  h1 {
    font-size: ${theme.typography.headings.h1.fontSize};
    font-weight: ${theme.typography.headings.h1.fontWeight};
    line-height: ${theme.typography.headings.h1.lineHeight};
  }

  h2 {
    font-size: ${theme.typography.headings.h2.fontSize};
    font-weight: ${theme.typography.headings.h2.fontWeight};
    line-height: ${theme.typography.headings.h2.lineHeight};
  }

  h3 {
    font-size: ${theme.typography.headings.h3.fontSize};
    font-weight: ${theme.typography.headings.h3.fontWeight};
    line-height: ${theme.typography.headings.h3.lineHeight};
  }

  h4 {
    font-size: ${theme.typography.headings.h4.fontSize};
    font-weight: ${theme.typography.headings.h4.fontWeight};
    line-height: ${theme.typography.headings.h4.lineHeight};
  }

  h5 {
    font-size: ${theme.typography.fontSize.lg};
    font-weight: ${theme.typography.fontWeight.semiBold};
  }

  h6 {
    font-size: ${theme.typography.fontSize.base};
    font-weight: ${theme.typography.fontWeight.semiBold};
  }

  p {
    margin-bottom: ${theme.spacing.md};
    font-size: ${theme.typography.body.fontSize};
    line-height: ${theme.typography.body.lineHeight};
  }

  a {
    color: ${theme.colors.primary};
    text-decoration: none;
    transition: ${theme.transitions.default};

    &:hover {
      text-decoration: underline;
    }
  }

  button {
    cursor: pointer;
    font-family: inherit;
  }

  ul, ol {
    margin-bottom: ${theme.spacing.md};
    padding-left: ${theme.spacing.xl};
  }
`;

export default GlobalStyle; 