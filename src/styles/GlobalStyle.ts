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
    font-size: ${theme.typography.fontSize.base};
    line-height: 1.5;
    color: ${theme.colors.text.primary};
    background-color: ${theme.colors.background};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3, h4, h5, h6 {
    margin-bottom: ${theme.spacing.md};
    font-weight: ${theme.typography.fontWeight.bold};
    line-height: 1.2;
  }

  h1 {
    font-size: ${theme.typography.fontSize['4xl']};
  }

  h2 {
    font-size: ${theme.typography.fontSize['3xl']};
  }

  h3 {
    font-size: ${theme.typography.fontSize.xxl};
  }

  h4 {
    font-size: ${theme.typography.fontSize.xl};
  }

  h5 {
    font-size: ${theme.typography.fontSize.lg};
  }

  h6 {
    font-size: ${theme.typography.fontSize.base};
  }

  p {
    margin-bottom: ${theme.spacing.md};
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