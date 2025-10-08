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
        <img src="https://cdn-icons-png.flaticon.com/512/60/60740.png" alt="upload" className="t2s-file-icon" />
        <span className="t2s-file-text">{label || 'Anexar arquivo'}</span>
      </div>
    </label>
  );
}
