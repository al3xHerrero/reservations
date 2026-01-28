import React from 'react';
import { FieldSelect, FieldSelectOption } from './FieldSelect';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: FieldSelectOption[];
}

export function Select({
  label,
  error,
  helperText,
  options,
  value,
  onChange,
  disabled,
  name,
  required,
  ...props
}: SelectProps) {
  return (
    <FieldSelect
      id={props.id}
      label={label}
      placeholder={props.placeholder}
      value={(value as string | undefined) ?? ''}
      onChange={(next) => onChange?.({ target: { value: next } } as React.ChangeEvent<HTMLSelectElement>)}
      options={options}
      error={error}
      helperText={helperText}
      disabled={disabled}
      name={name}
      required={required}
    />
  );
}
