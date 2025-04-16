import React from 'react';
import styled from 'styled-components';
import Link from 'next/link';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 2rem;
  color: #2d3748;
`;

const DevPageList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const DevPageItem = styled.li`
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f7fafc;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;

const DevPageLink = styled(Link)`
  display: block;
  color: #2b6cb0;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.p`
  margin-top: 0.5rem;
  color: #4a5568;
  font-size: 0.875rem;
`;

const DevIndex = () => {
  return (
    <Container>
      <Title>SEO ROI Calculator - Developer Pages</Title>
      <p>Welcome to the development section. These pages are for testing and debugging purposes.</p>
      
      <DevPageList>
        <DevPageItem>
          <DevPageLink href="/dev/visualization-test">
            Visualization Test Page
          </DevPageLink>
          <Description>
            Test and debug the ROI chart visualizations with different parameters and options.
            Includes breakeven indicators, data labels, and multiple chart types.
          </Description>
        </DevPageItem>
        {/* Add more development pages here as they are created */}
      </DevPageList>
    </Container>
  );
};

export default DevIndex; 