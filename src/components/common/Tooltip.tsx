import React, { useState } from 'react';
import styled from 'styled-components';
import { FiInfo } from 'react-icons/fi';

interface TooltipProps {
  text: string;
  position?: 'top' | 'right' | 'bottom' | 'left';
  children?: React.ReactNode;
}

/**
 * A tooltip component that displays information when hovered
 * Can be used standalone with an info icon or wrapped around other elements
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  text, 
  position = 'top',
  children 
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  return (
    <TooltipContainer
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children || <InfoIcon />}
      {isVisible && (
        <TooltipText position={position}>
          {text}
        </TooltipText>
      )}
    </TooltipContainer>
  );
};

const TooltipContainer = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
`;

const InfoIcon = styled(FiInfo)`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 5px;
  width: 16px;
  height: 16px;
`;

const TooltipText = styled.div<{ position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.background.dark};
  color: ${({ theme }) => theme.colors.text.light};
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 14px;
  width: max-content;
  max-width: 250px;
  text-align: center;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16);
  
  /* Position the tooltip based on the position prop */
  ${({ position }) => {
    switch (position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-10px);
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(10px);
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(10px);
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-10px);
        `;
    }
  }}

  /* Add arrow to tooltip */
  &::before {
    content: '';
    position: absolute;
    border-width: 5px;
    border-style: solid;
    border-color: transparent;
    
    ${({ position, theme }) => {
      switch (position) {
        case 'top':
          return `
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-top-color: ${theme.colors.background.dark};
          `;
        case 'right':
          return `
            right: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-right-color: ${theme.colors.background.dark};
          `;
        case 'bottom':
          return `
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: ${theme.colors.background.dark};
          `;
        case 'left':
          return `
            left: 100%;
            top: 50%;
            transform: translateY(-50%);
            border-left-color: ${theme.colors.background.dark};
          `;
      }
    }}
  }
`;

export default Tooltip; 