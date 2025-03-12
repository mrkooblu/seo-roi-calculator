import React, { useState, useRef } from 'react';
import styled from 'styled-components';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
}

const Tooltip: React.FC<TooltipProps> = ({ content, children, position = 'top' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  const handleFocus = () => {
    setIsVisible(true);
  };

  const handleBlur = () => {
    setIsVisible(false);
  };

  return (
    <TooltipContainer
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
    >
      {children}
      {isVisible && (
        <TooltipContent
          ref={tooltipRef}
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
  vertical-align: middle;
`;

interface TooltipContentProps {
  $position: 'top' | 'right' | 'bottom' | 'left';
}

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  z-index: 10;
  background-color: ${({ theme }) => theme.colors.text.primary};
  color: white;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.normal};
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  max-width: 250px;
  word-wrap: break-word;
  box-shadow: ${({ theme }) => theme.shadows.md};
  
  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return `
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-bottom: 5px;
        `;
      case 'right':
        return `
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-left: 5px;
        `;
      case 'bottom':
        return `
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          margin-top: 5px;
        `;
      case 'left':
        return `
          right: 100%;
          top: 50%;
          transform: translateY(-50%);
          margin-right: 5px;
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
    const backgroundColor = theme.colors.text.primary;
    
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