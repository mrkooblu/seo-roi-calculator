import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FiInfo } from 'react-icons/fi';

interface TooltipProps {
  content: string;
  children?: React.ReactNode;
  position?: 'top' | 'right' | 'bottom' | 'left';
  maxWidth?: number;
}

/**
 * An enhanced tooltip component that displays information when hovered or focused
 * Features smart positioning and improved styling to prevent content overlap
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  content, 
  children, 
  position = 'top',
  maxWidth = 250
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [finalPosition, setFinalPosition] = useState(position);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Show/hide tooltip
  const showTooltip = () => setIsVisible(true);
  const hideTooltip = () => setIsVisible(false);

  // Recalculate position when tooltip becomes visible
  useEffect(() => {
    if (isVisible && containerRef.current && tooltipRef.current) {
      const container = containerRef.current;
      const tooltip = tooltipRef.current;
      
      // Get positioning information
      const containerRect = container.getBoundingClientRect();
      const tooltipRect = tooltip.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Check if tooltip overflows the viewport in its current position
      let newPosition = position;
      
      switch (position) {
        case 'top':
          if (containerRect.top < tooltipRect.height + 20) {
            newPosition = 'bottom';
          }
          break;
        case 'right':
          if (containerRect.right + tooltipRect.width + 20 > viewportWidth) {
            newPosition = 'left';
          }
          break;
        case 'bottom':
          if (containerRect.bottom + tooltipRect.height + 20 > viewportHeight) {
            newPosition = 'top';
          }
          break;
        case 'left':
          if (containerRect.left < tooltipRect.width + 20) {
            newPosition = 'right';
          }
          break;
      }
      
      setFinalPosition(newPosition);
    }
  }, [isVisible, position]);

  return (
    <TooltipContainer
      ref={containerRef}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children || <InfoIcon />}
      {isVisible && (
        <TooltipContent 
          ref={tooltipRef}
          role="tooltip"
          $position={finalPosition}
          aria-hidden={!isVisible}
          $maxWidth={maxWidth}
        >
          {content}
          <TooltipArrow $position={finalPosition} />
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

// Tooltip animations
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

interface TooltipContentProps {
  $position: 'top' | 'right' | 'bottom' | 'left';
  $maxWidth: number;
}

// Positioning offsets - increased to prevent overlap
const OFFSET = 15;

const TooltipContent = styled.div<TooltipContentProps>`
  position: absolute;
  z-index: 999; // Increased z-index
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 10px 14px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: 13px;
  line-height: 1.4;
  width: max-content;
  max-width: ${({ $maxWidth }) => `${$maxWidth}px`};
  text-align: left;
  box-shadow: ${({ theme }) => theme.shadows.lg};
  animation: ${fadeIn} 0.2s ease-out;
  pointer-events: none; // Prevents the tooltip from blocking interaction with elements underneath
  
  /* Position the tooltip based on the position prop with increased offsets */
  ${({ $position }) => {
    switch ($position) {
      case 'top':
        return css`
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-${OFFSET}px);
        `;
      case 'right':
        return css`
          left: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(${OFFSET}px);
        `;
      case 'bottom':
        return css`
          top: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(${OFFSET}px);
        `;
      case 'left':
        return css`
          right: 100%;
          top: 50%;
          transform: translateY(-50%) translateX(-${OFFSET}px);
        `;
      default:
        return '';
    }
  }}
`;

const TooltipArrow = styled.div<{ $position: 'top' | 'right' | 'bottom' | 'left' }>`
  position: absolute;
  width: 0;
  height: 0;
  border-style: solid;
  
  ${({ $position, theme }) => {
    const backgroundColor = theme.colors.primary;
    
    switch ($position) {
      case 'top':
        return css`
          border-width: 6px 6px 0 6px;
          border-color: ${backgroundColor} transparent transparent transparent;
          bottom: -6px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'right':
        return css`
          border-width: 6px 6px 6px 0;
          border-color: transparent ${backgroundColor} transparent transparent;
          left: -6px;
          top: 50%;
          transform: translateY(-50%);
        `;
      case 'bottom':
        return css`
          border-width: 0 6px 6px 6px;
          border-color: transparent transparent ${backgroundColor} transparent;
          top: -6px;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'left':
        return css`
          border-width: 6px 0 6px 6px;
          border-color: transparent transparent transparent ${backgroundColor};
          right: -6px;
          top: 50%;
          transform: translateY(-50%);
        `;
      default:
        return '';
    }
  }}
`;

export default Tooltip; 