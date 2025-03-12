import React from 'react';
import styled from 'styled-components';

interface ContainerProps {
  children: React.ReactNode;
  fluid?: boolean;
}

const Container: React.FC<ContainerProps> = ({ children, fluid = false }) => {
  return <StyledContainer $fluid={fluid}>{children}</StyledContainer>;
};

interface StyledContainerProps {
  $fluid: boolean;
}

const StyledContainer = styled.div<StyledContainerProps>`
  width: 100%;
  max-width: ${(props) => (props.$fluid ? '100%' : '1200px')};
  margin: 0 auto;
  padding: 0 ${({ theme }) => theme.spacing.md};

  @media (min-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: 0 ${({ theme }) => theme.spacing.lg};
  }
`;

export default Container; 