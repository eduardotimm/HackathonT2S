import React from 'react';
import './Button.css';

export default function Button({
  label,
  children,
  onClick,
  type = 'button',
  disabled = false,
  className = '',
  variant = 'primary',
  size = 'md',
  ariaLabel,
  ...rest
}) {
  const classes = `t2s-btn t2s-btn--${variant} t2s-btn--${size} ${className}`;
  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled} aria-label={ariaLabel || label} {...rest}>
      {children || label}
    </button>
  );
}
