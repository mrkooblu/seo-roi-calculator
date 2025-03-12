import React from 'react';
import styled from 'styled-components';
import { CalculatorTab } from '../../types/calculator';

interface CalculatorTabsProps {
  activeTab: CalculatorTab;
  onTabChange: (tab: CalculatorTab) => void;
}

const CalculatorTabs: React.FC<CalculatorTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      <Tab
        active={activeTab === 'basic'}
        onClick={() => onTabChange('basic')}
      >
        Basic Calculator
      </Tab>
      <Tab
        active={activeTab === 'advanced'}
        onClick={() => onTabChange('advanced')}
      >
        Advanced Options
      </Tab>
    </TabsContainer>
  );
};

interface TabProps {
  active: boolean;
}

const TabsContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Tab = styled.div<TabProps>`
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 3px solid ${({ active, theme }) => 
    active ? theme.colors.primary : 'transparent'};
  font-weight: ${({ active }) => (active ? 600 : 400)};
  color: ${({ active, theme }) => 
    active ? theme.colors.primary : theme.colors.textPrimary};
  transition: all 0.2s ease;

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export default CalculatorTabs; 