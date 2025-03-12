import React from 'react';
import styled from 'styled-components';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = 'button',
  fullWidth = false,
  disabled = false
}) => {
  return (
    <StyledButton 
      onClick={onClick} 
      type={type} 
      fullWidth={fullWidth}
      disabled={disabled}
    >
      {children}
    </StyledButton>
  );
};

interface StyledButtonProps {
  fullWidth: boolean;
}

const StyledButton = styled.button<StyledButtonProps>`
  display: inline-block;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  padding: 15px 30px;
  border-radius: ${({ theme }) => theme.borderRadius.button};
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  text-transform: uppercase;
  letter-spacing: 1px;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};

  &:hover {
    background-color: #0055cc;
  }

  &:disabled {
    background-color: #a3c2f5;
    cursor: not-allowed;
  }
`;

export default Button; 