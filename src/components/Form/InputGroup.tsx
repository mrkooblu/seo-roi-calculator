import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface InputGroupProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  prefix?: string;
  suffix?: string;
  error?: string;
}

const InputGroup = forwardRef<HTMLInputElement, InputGroupProps>(
  ({ id, prefix, suffix, error, ...props }, ref) => {
    return (
      <InputContainer>
        {prefix && <InputPrefix>{prefix}</InputPrefix>}
        <StyledInput
          id={id}
          name={id}
          ref={ref}
          $hasPrefix={!!prefix}
          $hasSuffix={!!suffix}
          $hasError={!!error}
          {...props}
        />
        {suffix && <InputSuffix>{suffix}</InputSuffix>}
      </InputContainer>
    );
  }
);

InputGroup.displayName = 'InputGroup';

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
`;

interface StyledInputProps {
  $hasPrefix: boolean;
  $hasSuffix: boolean;
  $hasError: boolean;
}

const StyledInput = styled.input<StyledInputProps>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  padding-left: ${({ $hasPrefix, theme }) => $hasPrefix ? theme.spacing.xl : theme.spacing.md};
  padding-right: ${({ $hasSuffix, theme }) => $hasSuffix ? theme.spacing.xl : theme.spacing.md};
  border: 1px solid ${({ theme, $hasError }) => 
    $hasError ? theme.colors.danger : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  color: ${({ theme }) => theme.colors.text.primary};
  background-color: white;
  transition: ${({ theme }) => theme.transitions.default};
  
  &:focus {
    outline: none;
    border-color: ${({ theme, $hasError }) => 
      $hasError ? theme.colors.danger : theme.colors.primary};
    box-shadow: 0 0 0 2px ${({ theme, $hasError }) => 
      $hasError ? `${theme.colors.danger}33` : `${theme.colors.primary}33`};
  }
  
  &::placeholder {
    color: ${({ theme }) => theme.colors.text.muted};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.background};
    cursor: not-allowed;
  }
`;

const InputPrefix = styled.div`
  position: absolute;
  left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

const InputSuffix = styled.div`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.text.secondary};
  pointer-events: none;
`;

export default InputGroup; 