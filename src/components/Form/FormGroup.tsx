import React from 'react';
import styled from 'styled-components';
import Tooltip from './Tooltip';

interface FormGroupProps {
  id: string;
  label: string;
  children: React.ReactNode;
  tooltip?: string;
  helperText?: string;
  error?: string;
  required?: boolean;
}

const FormGroup: React.FC<FormGroupProps> = ({
  id,
  label,
  children,
  tooltip,
  helperText,
  error,
  required = false,
}) => {
  return (
    <FormGroupContainer>
      <LabelContainer>
        <Label htmlFor={id}>
          {label}
          {required && <RequiredAsterisk>*</RequiredAsterisk>}
        </Label>
        {tooltip && (
          <Tooltip 
            content={tooltip} 
            position="bottom" 
            maxWidth={300}
          >
            <TooltipTrigger tabIndex={0} aria-label={`Help information for ${label}`}>
              <QuestionIcon>?</QuestionIcon>
            </TooltipTrigger>
          </Tooltip>
        )}
      </LabelContainer>
      
      {children}
      
      {helperText && <HelperText>{helperText}</HelperText>}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </FormGroupContainer>
  );
};

const FormGroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const LabelContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const RequiredAsterisk = styled.span`
  color: ${({ theme }) => theme.colors.danger};
  margin-left: 3px;
`;

const TooltipTrigger = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-left: ${({ theme }) => theme.spacing.xs};
  cursor: help;
  transition: transform 0.2s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const QuestionIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  font-size: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2);
`;

const HelperText = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const ErrorMessage = styled.div`
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.danger};
`;

export default FormGroup; 