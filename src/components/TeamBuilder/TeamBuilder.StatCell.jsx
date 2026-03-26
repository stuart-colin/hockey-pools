import React from 'react';

/**
 * Displays a single stat with label above value in a fixed-width column
 */
const StatCell = ({ label, value }) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '2px',
        width: '20px',
        height: '100%',
        justifyContent: 'center',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          color: '#bbb',
          fontWeight: '500',
          letterSpacing: '0.5px',
          lineHeight: '1.5',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: '600',
          color: '#555',
          lineHeight: '1',
        }}
      >
        {value}
      </div>
    </div>
  );
};

export default StatCell;
