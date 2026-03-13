import React from 'react';
import PropTypes from 'prop-types';
// import { Loader2 } from 'lucide-react';
import Spinner from 'react-bootstrap/Spinner';

const LoadingSpinner = ({ text = 'Loading...', size = 'md', className = '' }) => {
  const spinnerSize = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];

  return (
    <div className={`d-flex align-items-center justify-content-center gap-2 ${className}`} style={{ height: "55vh" }}>
      <Spinner animation="border" size={spinnerSize} role="status" variant='primary' />
      {text && <span>{text}</span>}
    </div>
  );
};

LoadingSpinner.propTypes = {
  text: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string
};

export default LoadingSpinner;