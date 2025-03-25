import React from 'react';
import styled from 'styled-components';

// New component for SEMrush recommendations
const SemrushRecommendation = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
  padding: ${({ theme }) => theme.spacing[4]};
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing[6]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
`;

const SemrushLogo = styled.img`
  height: 28px;
  margin-bottom: ${({ theme }) => theme.spacing[2]};
`;

const SemrushTitle = styled.h2`
  font-size: 30px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  margin-top: ${({ theme }) => theme.spacing[2]};
`;

const SemrushText = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray[600]};
  margin-bottom: ${({ theme }) => theme.spacing[3]};
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
`;

const SemrushCTA = styled.a`
  display: inline-block;
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[4]}`};
  background-color: #ff642d;
  color: white;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  transition: all 0.2s ease;
  margin-top: ${({ theme }) => theme.spacing[2]};
  
  &:hover {
    background-color: #e85a29;
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ToolsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: ${({ theme }) => theme.spacing[4]};
  margin-top: ${({ theme }) => theme.spacing[4]};
  margin-bottom: ${({ theme }) => theme.spacing[4]};
`;

const ToolTitle = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.md};
  color: ${({ theme }) => theme.colors.gray[800]};
  margin-bottom: ${({ theme }) => theme.spacing[1]};
  transition: color 0.2s ease;
`;

const ToolDescription = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.gray[600]};
`;

const ToolContent = styled.div`
  min-height: 80px;
`;

const PreviewImage = styled.div`
  display: block;
  width: 100%;
  height: 0;
  padding-bottom: 60%; /* 16:9 aspect ratio */
  margin-top: 12px;
  border-radius: 6px;
  overflow: hidden;
  opacity: 1; /* Visible by default */
  transition: transform 0.3s ease;
  background-image: url(${props => props.imageSrc});
  background-size: cover;
  background-position: top center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const ToolCard = styled.a`
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing[3]};
  border: 1px solid ${({ theme }) => theme.colors.gray[200]};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  text-decoration: none;
  background-color: white;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    background-color: #fff4f0;
    text-decoration: none;
  }
  
  &:hover ${ToolTitle} {
    color: #ff632b;
  }
`;

const ToolCardWithPreview = ({ title, description, href, imageSrc }) => {
  return (
    <ToolCard href={href} target="_blank" rel="noopener noreferrer">
      <ToolContent>
        <ToolTitle>{title}</ToolTitle>
        <ToolDescription>{description}</ToolDescription>
      </ToolContent>
      <PreviewImage imageSrc={imageSrc} />
    </ToolCard>
  );
};

const SemrushModule = () => {
  return (
    <SemrushRecommendation>
      <SemrushLogo src="/images/semrush-logo-black-font.png" alt="SEMrush Logo" />
      <SemrushTitle>Track Your Campaign Performance</SemrushTitle>
      <SemrushText>
        Now that you've built your UTM links, don't stop at basic tracking. UTMs tell you where traffic comes from. 
        Semrush tells you why it matters for your bottom line.
      </SemrushText>
      
      <ToolsGrid>
        <ToolCardWithPreview 
          href="https://www.semrush.com/analytics/adwords/positions" 
          title="Advertising Research"
          description="See exactly which ads generate profitable results for your competitors."
          imageSrc="/images/advertising_research.webp"
        />
        
        <ToolCardWithPreview 
          href="https://www.semrush.com/analytics/keywordmagic/start" 
          title="Keyword Magic Tool"
          description="Target the exact terms your ideal customers search for in seconds."
          imageSrc="/images/keyword_magic_tool.webp"
        />
        
        <ToolCardWithPreview 
          href="https://www.semrush.com/analytics/organic/overview/?db=us" 
          title="Organic Research"
          description="Analyze what's working for competitors and adapt their strategies."
          imageSrc="/images/organic_research.webp"
        />
        
        <ToolCardWithPreview 
          href="https://www.semrush.com/market-explorer/" 
          title="Market Explorer"
          description="Track changing market dynamics and stay ahead of industry shifts."
          imageSrc="/images/market-explorer.webp"
        />
      </ToolsGrid>
      
      <SemrushCTA href="https://www.semrush.com/signup/" target="_blank" rel="noopener noreferrer">
        Try SEMrush for Free
      </SemrushCTA>
    </SemrushRecommendation>
  );
};

export default SemrushModule; 