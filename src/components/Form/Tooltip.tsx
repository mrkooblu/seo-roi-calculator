import React, { useState } from 'react';
import styled from 'styled-components';
import { FiInfo } from 'react-icons/fi';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

/**
 * A tooltip component that displays information when hovered or focused
 * Can be used standalone with an info icon or wrapped around other elements
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top' 
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
        <TooltipContent 
          role="tooltip"
          $position={position}
          aria-hidden={!isVisible}
        >
          {content}
          <TooltipArrow $position={position} />
        </TooltipContent>
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

interface TooltipContentProps {
  $position: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  z-index: 100;
  background-color: ${({ theme }) => theme.colors.background.dark};
  color: ${({ theme }) => theme.colors.text.light};
  padding: 8px 12px;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-size: 14px;
  width: max-content;
  max-width: 250px;
  text-align: center;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  /* Position the tooltip based on the position prop */
  ${({ $position }) => {
    switch ($position) {
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
      default:
        return '';
    }
  }}
`;

const TooltipArrow = styled.div<TooltipContentProps>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
  ${({ $position, theme }) => {
    const backgroundColor = theme.colors.background.dark;
    
    switch ($position) {
      case 'top':
        return `
          border-width: 5px 5px 0 5px;
          border-color: ${backgroundColor} transparent transparent transparent;
          bottom: -5px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'right':
        return `
          border-width: 5px 5px 5px 0;
          border-color: transparent ${backgroundColor} transparent transparent;
          left: -5px;
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'bottom':
        return `
          border-width: 0 5px 5px 5px;
          border-color: transparent transparent ${backgroundColor} transparent;
          top: -5px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return `
          border-width: 5px 0 5px 5px;
          border-color: transparent transparent transparent ${backgroundColor};
          right: -5px;
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return '';
    }
  }}
`;

export default Tooltip; 