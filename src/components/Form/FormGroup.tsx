import React from 'react';
import styled from 'styled-components';
import { FormGroupProps } from '../../types/forms';
import Tooltip from './Tooltip';

const FormGroup: React.FC<FormGroupProps> = ({
  id,
  label,
  required = false,
  tooltip,
  helperText,
  children,
  error
}) => {
  return (
    <StyledFormGroup>
      <StyledLabel htmlFor={id}>
        {label} {required && <Required>*</Required>}
        {tooltip && <Tooltip text={tooltip} />}
      </StyledLabel>
      {children}
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </StyledFormGroup>
  );
};

const StyledFormGroup = styled.div`
  margin-bottom: 25px;
`;

const StyledLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 400;
  font-size: 16px;
  line-height: 24px;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const Required = styled.span`
  color: ${({ theme }) => theme.colors.chart.red};
`;

const HelperText = styled.p`
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-top: 5px;
`;

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colors.chart.red};
  font-size: 14px;
  margin-top: 5px;
`;

export default FormGroup; 