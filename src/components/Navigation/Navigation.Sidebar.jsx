import React from 'react';
import './Navigation.Sidebar.css';

const overlayStyle = (isVisible) => ({
  opacity: isVisible ? 1 : 0,
  pointerEvents: isVisible ? 'auto' : 'none',
});

const NavigationSidebar = ({ isVisible, onClose, children }) => {
  return (
    <>
      {/* Overlay backdrop */}
      <div
        className='custom-sidebar-overlay'
        style={overlayStyle(isVisible)}
        onClick={onClose}
      />

      {/* Sidebar panel */}
      <div className={`custom-sidebar ${isVisible ? 'visible' : ''}`}>
        <div>
          {children}
        </div>
      </div>
    </>
  );
};

export default NavigationSidebar;
