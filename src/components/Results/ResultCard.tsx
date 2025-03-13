import React from 'react';
import styled from 'styled-components';

interface ResultCardProps {
  children: React.ReactNode;
  title?: string;
}

const ResultCard: React.FC<ResultCardProps> = ({ children, title }) => {
  return (
    <Card>
      {title && <CardTitle>{title}</CardTitle>}
      {children}
    </Card>
  );
};

const Card = styled.div`
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const CardTitle = styled.h3`
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

export default ResultCard; 