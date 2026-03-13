import React from 'react';
import PropTypes from 'prop-types';
import { AlertTriangle, RotateCw } from 'lucide-react';

const ErrorAlert = ({ message, onRetry, className = '' }) => {
  return (
    <div className={`alert alert-danger ${className}`} role="alert">
      <div className="d-flex align-items-center gap-2">
        <AlertTriangle className="flex-shrink-0" size={20} />
        <div className="flex-grow-1">
          <strong>Error!</strong> {message || 'Something went wrong.'}
        </div>
        {onRetry && (
          <button 
            className="btn btn-sm btn-outline-danger d-flex align-items-center gap-1"
            onClick={onRetry}
          >
            <RotateCw size={16} /> Retry
          </button>
        )}
      </div>
    </div>
  );
};

ErrorAlert.propTypes = {
  message: PropTypes.string,
  onRetry: PropTypes.func,
  className: PropTypes.string
};

export default ErrorAlert;