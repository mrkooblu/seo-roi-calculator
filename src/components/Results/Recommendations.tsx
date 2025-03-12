import React from 'react';
import styled from 'styled-components';
import { RecommendationItem } from '../../types';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
}

const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  return (
    <ResultCard>
      <RecommendationsContainer>
        {recommendations.map((recommendation, index) => (
          <RecommendationSection key={index}>
            <RecommendationTitle>
              <strong>{recommendation.title}</strong>
            </RecommendationTitle>
            
            <RecommendationDescription>
              {recommendation.description}
            </RecommendationDescription>
            
            {recommendation.items && recommendation.items.length > 0 && (
              <RecommendationList>
                {recommendation.items.map((item, itemIndex) => (
                  <RecommendationItem key={itemIndex}>
                    {item}
                  </RecommendationItem>
                ))}
              </RecommendationList>
            )}
          </RecommendationSection>
        ))}
      </RecommendationsContainer>
    </ResultCard>
  );
};

const RecommendationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RecommendationSection = styled.div`
  background-color: ${({ theme }) => theme.colors.background};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.sm};
`;

const RecommendationTitle = styled.h4`
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
  font-weight: ${({ theme }) => theme.typography.fontWeight.semiBold};
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const RecommendationDescription = styled.p`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.secondary};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const RecommendationList = styled.ul`
  padding-left: ${({ theme }) => theme.spacing.lg};
`;

const RecommendationItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

export default Recommendations; 