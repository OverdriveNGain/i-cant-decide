import React from 'react';

/**
 * Confirmation Modal Component for clearing data
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether to show the modal
 * @param {Function} props.onClose - Function to call when closing the modal
 * @param {Function} props.onConfirm - Function to call when confirming the action
 */
const ConfirmationModal = ({ 
    show, 
    onClose, 
    onConfirm
}) => {
    if (!show) return null;
    
    return (
        <>
            {/* Semi-transparent overlay */}
            <div 
                className="position-fixed top-0 start-0 w-100 h-100" 
                style={{ 
                    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
                    zIndex: 1050,
                    backdropFilter: 'blur(3px)'
                }}
                onClick={() => onClose()}
            ></div>
            
            {/* Dialog */}
            <div 
                className="position-fixed top-50 start-50 translate-middle" 
                style={{ 
                    zIndex: 1055,
                    width: '90%',
                    maxWidth: '500px'
                }}
            >
                <div 
                    className="bg-white rounded shadow overflow-hidden"
                    style={{ 
                        animation: 'fadeInDown 0.3s ease-out',
                        border: '1px solid rgba(0,0,0,0.1)'
                    }}
                >
                    {/* Header */}
                    <div className="d-flex justify-content-between align-items-center border-bottom" style={{ padding: '0.5rem 1rem 0.5rem 1.25rem' }}>
                        <h5 className="m-0">Confirm Clear Data</h5>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary" 
                            onClick={() => onClose()}
                            aria-label="Close"
                            style={{ padding: '0.25rem 0.5rem', lineHeight: 1 }}
                        >
                            ×
                        </button>
                    </div>
                    
                    {/* Body */}
                    <div className="p-3">
                        <div className="d-flex">
                            <div className="me-3 text-danger" style={{ padding: '0.25rem' }}>
                                <i className="bi bi-exclamation-triangle-fill" style={{ fontSize: '1.25rem' }}></i>
                            </div>
                            <div>
                                <p className="mb-2" style={{ fontSize: '1rem' }}>Are you sure you want to clear all your data? This will remove:</p>
                                <ul className="mb-2" style={{ fontSize: '1rem', paddingLeft: '1.5rem' }}>
                                    <li>All your choices</li>
                                    <li>All your factors</li>
                                    <li>All factor importance ratings</li>
                                    <li>All choice ratings</li>
                                </ul>
                                <p className="text-danger mb-0" style={{ fontSize: '1rem' }}>
                                    <strong>This action cannot be undone.</strong>
                                </p>
                            </div>
                        </div>
                    </div>
                    
                    {/* Footer */}
                    <div className="d-flex justify-content-end p-2 bg-light border-top">
                        <button 
                            type="button" 
                            className="btn btn-sm btn-outline-secondary me-2" 
                            onClick={() => onClose()}
                        >
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="btn btn-sm btn-danger" 
                            onClick={() => onConfirm()}
                        >
                            Yes, Clear All Data
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Add animation styles */}
            <style>
                {`
                    @keyframes fadeInDown {
                        from {
                            opacity: 0;
                            transform: translateY(-20px);
                        }
                        to {
                            opacity: 1;
                            transform: translateY(0);
                        }
                    }
                `}
            </style>
        </>
    );
};

export default ConfirmationModal;
