import React from 'react';
import styled, { keyframes } from 'styled-components';

interface LoadingStateProps {
  message?: string;
}

/**
 * LoadingState component displays a loading animation
 * Can be used when calculating results or loading data
 */
const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Calculating results...' }) => {
  return (
    <LoadingContainer>
      <SpinnerContainer>
        <Spinner />
      </SpinnerContainer>
      <LoadingMessage>{message}</LoadingMessage>
    </LoadingContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0% { opacity: 0.6; }
  50% { opacity: 1; }
  100% { opacity: 0.6; }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background-color: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.sm};
  margin-top: ${({ theme }) => theme.spacing.xl};
  animation: ${pulse} 2s infinite ease-in-out;
`;

const SpinnerContainer = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid ${({ theme }) => theme.colors.background};
  border-top: 5px solid ${({ theme }) => theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const LoadingMessage = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin: 0;
`;

export default LoadingState; 