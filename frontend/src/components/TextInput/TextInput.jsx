import React from 'react';
import './TextInput.css';

export default function TextInput({
  value,
  onChange,
  placeholder,
  maxLength,
  disabled = false,
  className = '',
  name,
  id,
  ariaLabel,
  onBlur,
  type = 'text',
  ...rest
}) {
  return (
    <input
      className={`t2s-input ${className}`}
      type={type}
      name={name}
      id={id}
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={maxLength}
      disabled={disabled}
      aria-label={ariaLabel}
      onBlur={onBlur}
      {...rest}
    />
  );
}
