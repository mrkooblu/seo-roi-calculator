import React from 'react';
import styled, { keyframes } from 'styled-components';
import type { RecommendationItem } from '../../types';
import ResultCard from './ResultCard';
import { FiExternalLink } from 'react-icons/fi';

interface RecommendationsProps {
  recommendations: RecommendationItem[];
}

/**
 * Recommendations component displays strategy suggestions based on calculation results
 * Includes CTAs for each recommendation section
 */
const Recommendations: React.FC<RecommendationsProps> = ({ recommendations }) => {
  // Hard-coded CTA data based on section titles
  const getCTAInfo = (title: string) => {
    if (title.includes('Strategy Overview')) {
      return {
        url: 'https://www.semrush.com/signup/',
        text: 'Try SEMrush',
        color: '#ff642e' // Orange
      };
    } else if (title.includes('Conversion Rate')) {
      return {
        url: 'https://www.semrush.com/blog/conversion-rate-optimization/',
        text: 'Learn CRO Tips',
        color: '#0f9d58' // Green
      };
    } else if (title.includes('E-commerce')) {
      return {
        url: 'https://www.semrush.com/blog/ecommerce-seo/',
        text: 'E-commerce Guide',
        color: '#4285f4' // Blue
      };
    }
    return null;
  };

  return (
    <RecommendationsContainer>
      {recommendations.map((recommendation, index) => {
        const ctaInfo = getCTAInfo(recommendation.title);
        
        return (
          <ResultCard key={index}>
            <RecommendationLayout>
              <RecommendationContent>
                <RecommendationTitle>
                  {recommendation.title}
                </RecommendationTitle>
                
                <RecommendationDescription>
                  {recommendation.description}
                </RecommendationDescription>
                
                {recommendation.items && recommendation.items.length > 0 && (
                  <RecommendationList>
                    {recommendation.items.map((item, itemIndex) => (
                      <RecommendationListItem key={itemIndex}>{item}</RecommendationListItem>
                    ))}
                  </RecommendationList>
                )}
              </RecommendationContent>
              
              {ctaInfo && (
                <CTAContainer>
                  <CTAButton 
                    href={ctaInfo.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    $bgColor={ctaInfo.color}
                  >
                    <CTAText>{ctaInfo.text}</CTAText>
                    <CTAIcon><FiExternalLink /></CTAIcon>
                  </CTAButton>
                </CTAContainer>
              )}
            </RecommendationLayout>
          </ResultCard>
        );
      })}
    </RecommendationsContainer>
  );
};

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(0, 102, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(0, 102, 255, 0);
  }
`;

const floatAnimation = keyframes`
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
`;

const iconMove = keyframes`
  0% {
    transform: translateX(0);
  }
  50% {
    transform: translateX(3px);
  }
  100% {
    transform: translateX(0);
  }
`;

const RecommendationsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const RecommendationLayout = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const RecommendationContent = styled.div`
  flex: 1;
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

const RecommendationListItem = styled.li`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CTAContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-left: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: ${({ theme }) => theme.spacing.md};
    width: 100%;
  }
`;

interface CTAButtonProps {
  $bgColor?: string;
}

const CTAButton = styled.a<CTAButtonProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.lg}`};
  background-color: ${({ $bgColor, theme }) => $bgColor || theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  transition: all 0.3s ease;
  min-width: 160px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  animation: ${floatAnimation} 3s ease-in-out infinite;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
    animation: ${pulse} 1.5s infinite;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(255, 255, 255, 0.2),
      transparent
    );
    transition: 0.5s;
  }
  
  &:hover::before {
    left: 100%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
`;

const CTAText = styled.span`
  margin-right: ${({ theme }) => theme.spacing.xs};
`;

const CTAIcon = styled.span`
  display: inline-flex;
  align-items: center;
  animation: ${iconMove} 2s infinite ease-in-out;
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

export default Recommendations; 