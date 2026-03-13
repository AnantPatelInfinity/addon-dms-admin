import React, { useEffect, useState } from 'react';

const CustomToast = ({ message, type, onClose }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show toast when component mounts
        setIsVisible(true);

        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            handleClose();
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const handleClose = () => {
        setIsVisible(false);
        setTimeout(() => {
            onClose();
        }, 300); // Match this with your transition duration
    };

    const ToothIcon = () => (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
                transition: 'transform 0.2s ease',
                color: 'white'
            }}
        >
            <path
                d="M12 2C9.5 2 7.5 4 7.5 6.5V8.5C7.5 9.5 7 10.5 6.5 11.5C6 12.5 5.5 13.5 5.5 14.5V18.5C5.5 20.5 7 22 9 22C10.5 22 11.5 21 11.5 19.5V17C11.5 16.5 12 16 12.5 16C13 16 13.5 16.5 13.5 17V19.5C13.5 21 14.5 22 16 22C18 22 19.5 20.5 19.5 18.5V14.5C19.5 13.5 19 12.5 18.5 11.5C18 10.5 17.5 9.5 17.5 8.5V6.5C17.5 4 15.5 2 12 2Z"
                fill="currentColor"
            />
            <circle cx="10" cy="7" r="1" fill="white" opacity="0.8" />
            <circle cx="14" cy="7" r="1" fill="white" opacity="0.8" />
        </svg>
    );

    const getStyles = () => {
        const baseStyles = {
            position: 'fixed',
            top: '20px',
            right: '20px',
            zIndex: 1000,
            minWidth: '300px',
            maxWidth: '500px',
            padding: '16px',
            borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid',
            display: 'flex',
            alignItems: 'center',
            transform: isVisible ? 'translateX(0)' : 'translateX(120%)',
            opacity: isVisible ? 1 : 0,
            transition: 'all 0.3s ease-out',
            cursor: 'pointer'
        };

        const typeStyles = {
            success: {
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                borderColor: 'rgba(16, 185, 129, 0.2)',
                color: '#065F46'
            },
            error: {
                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                borderColor: 'rgba(239, 68, 68, 0.2)',
                color: '#7F1D1D'
            },
            info: {
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
                borderColor: 'rgba(59, 130, 246, 0.2)',
                color: '#1E3A8A'
            },
            warning: {
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                borderColor: 'rgba(245, 158, 11, 0.2)',
                color: '#92400E'
            }
        };

        return { ...baseStyles, ...typeStyles[type] };
    };

    const getIconBackground = () => {
        switch (type) {
            case 'success': return 'linear-gradient(135deg, #10B981, #059669)';
            case 'error': return 'linear-gradient(135deg, #EF4444, #DC2626)';
            case 'info': return 'linear-gradient(135deg, #3B82F6, #2563EB)';
            case 'warning': return 'linear-gradient(135deg, #F59E0B, #D97706)';
            default: return 'linear-gradient(135deg, #3B82F6, #2563EB)';
        }
    };

    return (
        <div style={getStyles()} onClick={handleClose}>
            <div style={{
                marginRight: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                flexShrink: 0,
                background: getIconBackground()
            }}>
                <ToothIcon />
            </div>
            <div style={{ flex: 1 }}>
                <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    lineHeight: '1.4'
                }}>
                    {message} 🦷
                </span>
            </div>
            <div style={{
                marginLeft: '12px',
                cursor: 'pointer',
                opacity: 0.6,
                fontSize: '18px',
                fontWeight: 'bold'
            }}>
                ×
            </div>
        </div>
    );
};

export default CustomToast;