import React from 'react';
import { Link } from 'react-router-dom';
import './LinkText.css';

export default function LinkText({ text, to = '/', className = '', ariaLabel }) {
  return (
    <Link to={to} className={`t2s-link-text ${className}`} aria-label={ariaLabel || text}>
      {text}
    </Link>
  );
}
