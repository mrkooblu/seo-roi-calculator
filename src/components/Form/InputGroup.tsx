import React from 'react';
import styled from 'styled-components';
import { InputGroupProps } from '../../types/forms';

const InputGroup: React.FC<InputGroupProps> = ({
  id,
  type,
  value,
  onChange,
  required = false,
  min,
  max,
  step,
  placeholder,
  prefix,
  suffix,
  error
}) => {
  const hasPrefix = Boolean(prefix);
  const hasSuffix = Boolean(suffix);

  return (
    <Container hasError={Boolean(error)}>
      {hasPrefix && <Prefix>{prefix}</Prefix>}
      <StyledInput
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        required={required}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        hasPrefix={hasPrefix}
        hasSuffix={hasSuffix}
        hasError={Boolean(error)}
      />
      {hasSuffix && <Suffix>{suffix}</Suffix>}
    </Container>
  );
};

interface ContainerProps {
  hasError?: boolean;
}

const Container = styled.div<ContainerProps>`
  display: flex;
  align-items: center;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.input};
  border: 1px solid ${({ theme, hasError }) => 
    hasError ? theme.colors.chart.red : theme.colors.border};
  overflow: hidden;
  
  &:focus-within {
    border-color: ${({ theme, hasError }) => 
      hasError ? theme.colors.chart.red : theme.colors.primary};
  }
`;

interface InputProps {
  hasPrefix: boolean;
  hasSuffix: boolean;
  hasError: boolean;
}

const StyledInput = styled.input<InputProps>`
  width: 100%;
  padding: 12px 15px;
  border: none;
  font-family: inherit;
  font-size: 16px;
  outline: none;
  border-radius: ${({ hasPrefix, hasSuffix, theme }) => {
    if (hasPrefix && hasSuffix) return '0';
    if (hasPrefix) return `0 ${theme.borderRadius.input} ${theme.borderRadius.input} 0`;
    if (hasSuffix) return `${theme.borderRadius.input} 0 0 ${theme.borderRadius.input}`;
    return theme.borderRadius.input;
  }};
`;

const Prefix = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  padding: 10px 15px;
  font-weight: 400;
`;

const Suffix = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f1f1;
  padding: 10px 15px;
  font-weight: 400;
`;

export default InputGroup; 