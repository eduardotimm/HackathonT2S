import React from 'react';
import './FileInput.css';

export default function FileInput({
  onChange,
  accept,
  disabled = false,
  label,
  name,
  id,
  multiple = false,
  ariaLabel,
  className = '',
  ...rest
}) {
  return (
    <label className={`t2s-file-label ${disabled ? 'disabled' : ''} ${className}`} aria-label={ariaLabel}>
      <input
        type="file"
        name={name}
        id={id}
        className="t2s-file-input"
        onChange={(e) => {
          const files = multiple ? Array.from(e.target.files) : e.target.files[0] || null;
          onChange && onChange(files);
        }}
        accept={accept}
        disabled={disabled}
        multiple={multiple}
        {...rest}
      />
      <div className="t2s-file-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="t2s-file-icon"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3.375 3.375 0 0 1 19.5 6.625l-8.95 8.95a1.5 1.5 0 0 1-2.122-2.122l6.815-6.815-6.815 6.815a1.5 1.5 0 0 1-2.122-2.122l6.815-6.815"
          />
        </svg>
        <span className="t2s-file-text">{label || 'Anexar arquivo'}</span>
      </div>
    </label>
  );
}
