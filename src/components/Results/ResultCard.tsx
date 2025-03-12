import React from 'react';
import styled from 'styled-components';

interface ResultCardProps {
  children: React.ReactNode;
}

const ResultCard: React.FC<ResultCardProps> = ({ children }) => {
  return <StyledResultCard>{children}</StyledResultCard>;
};

const StyledResultCard = styled.div`
  background-color: ${({ theme }) => theme.colors.cardBackground};
  border-radius: ${({ theme }) => theme.borderRadius.card};
  box-shadow: ${({ theme }) => theme.shadows.card};
  padding: ${({ theme }) => theme.spacing.cardPadding};
  margin-bottom: 30px;
`;

export default ResultCard; 