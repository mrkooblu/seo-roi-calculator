import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CalculatorTab } from '../../types/calculator';

interface CalculatorTabsProps {
  activeTab: CalculatorTab;
  onTabChange: (tab: CalculatorTab) => void;
}

/**
 * CalculatorTabs component provides tab navigation between calculator modes
 * Includes animation and responsive design
 */
const CalculatorTabs: React.FC<CalculatorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      <Tab
        $active={activeTab === 'basic'}
        onClick={() => onTabChange('basic')}
      >
        <TabIcon>📊</TabIcon>
        <TabText>Basic Calculator</TabText>
      </Tab>
      <Tab
        $active={activeTab === 'advanced'}
        onClick={() => onTabChange('advanced')}
      >
        <TabIcon>🔍</TabIcon>
        <TabText>Advanced Options</TabText>
      </Tab>
    </TabsContainer>
  );
};

const slideDown = keyframes`
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

interface TabProps {
  $active: boolean;
}

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  animation: ${slideDown} 0.5s ease-out;
  
  @media (max-width: 768px) {
    flex-direction: column;
    border-bottom: none;
  }
`;

const Tab = styled.div<TabProps>`
  display: flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  position: relative;
  font-weight: ${({ $active, theme }) => 
    $active ? theme.typography.fontWeight.semiBold : theme.typography.fontWeight.normal};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.text.secondary};
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.primary : 'transparent'};
    transition: all 0.3s ease;
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    
    &::after {
      background-color: ${({ $active, theme }) => 
        $active ? theme.colors.primary : theme.colors.primary + '40'};
    }
  }
  
  @media (max-width: 768px) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    background-color: ${({ $active, theme }) => 
      $active ? theme.colors.background : 'transparent'};
      
    &::after {
      width: 4px;
      height: 100%;
      top: 0;
      left: 0;
      bottom: auto;
    }
  }
`;

const TabIcon = styled.span`
  margin-right: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.lg};
`;

const TabText = styled.span`
  font-size: ${({ theme }) => theme.typography.fontSize.base};
`;

export default CalculatorTabs; 