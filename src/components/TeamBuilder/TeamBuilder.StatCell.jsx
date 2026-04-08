import React from 'react';

const statCellColumnStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '2px',
  width: '20px',
  height: '100%',
  justifyContent: 'center',
};

const statCellLabelStyle = {
  fontSize: '11px',
  color: '#bbb',
  fontWeight: '500',
  letterSpacing: '0.5px',
  lineHeight: '1.5',
};

const statCellValueStyle = {
  fontSize: '14px',
  fontWeight: '600',
  color: '#555',
  lineHeight: '1',
};

/**
 * Displays a single stat with label above value in a fixed-width column
 */
const StatCell = ({ label, value }) => {
  return (
    <div
      style={statCellColumnStyle}
    >
      <div
        style={statCellLabelStyle}
      >
        {label}
      </div>
      <div
        style={statCellValueStyle}
      >
        {value}
      </div>
    </div>
  );
};

export default StatCell;
