import React from 'react';

/**
 * Header component for the application
 * Contains the title, clear data button, and responsive layouts
 * 
 * @param {Object} props - Component props
 * @param {Function} props.onClearData - Function to handle clear data button click
 */
const Header = ({ onClearData }) => {
  return (
    <div className="position-relative mb-2">
      {/* Desktop layout */}
      <div className="d-none d-md-block">
        <div className="position-relative">
          <div className="display-1 h1 fw-bold text-center text-primary font-title m-0">I can't decide</div>
          
          <button 
            className="btn btn-sm btn-outline-danger position-absolute" 
            style={{ top: '50%', right: 0, transform: 'translateY(-50%)' }}
            onClick={onClearData}
            title="Clear all data and start over"
          >
            Clear Data
          </button>
        </div>
      </div>
      
      {/* Mobile layout */}
      <div className="d-flex d-md-none justify-content-between align-items-center">
        <div className="h2 fw-bold text-primary font-title m-0">I can't decide</div>
        
        <button 
          className="btn btn-sm btn-outline-danger" 
          onClick={onClearData}
          title="Clear all data and start over"
        >
          Clear Data
        </button>
      </div>
    </div>
  );
};

export default Header;
