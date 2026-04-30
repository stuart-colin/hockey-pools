import React, { useState } from 'react';
import { Header, Icon } from 'semantic-ui-react';

/**
 * Collapsible section wrapper for Insights.
 *
 * Drops in around any existing `<section className='insights-section'>`
 * block, keeping the same divided H3 header but making the entire header
 * row clickable to toggle the section's children. Defaults to expanded.
 *
 * Uses the same circular blue chevron treatment used by TeamBuilder's
 * roster card — `<Icon circular color='blue' name='chevron up|down' />` —
 * to stay visually consistent with collapsibles elsewhere on the site.
 */

const headerRowStyle = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'flex',
  gap: '12px',
  justifyContent: 'space-between',
  userSelect: 'none',
};

// Strip the divider/spacing the section CSS applies to <Header> so the click
// target stays as one cohesive row. We re-apply the bottom border on the
// outer flex container instead.
const innerHeaderStyle = {
  border: 0,
  flex: 1,
  margin: 0,
  padding: 0,
};

const headerDividerStyle = {
  borderBottom: '2px solid #e1e8ed',
  marginBottom: '8px',
  paddingBottom: '12px',
};

const chevronStyle = {
  flexShrink: 0,
  margin: 0,
};

const CollapsibleSection = ({ title, defaultExpanded = true, children }) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  return (
    <section className='insights-section'>
      <div
        aria-expanded={isExpanded}
        onClick={() => setIsExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsExpanded((v) => !v);
          }
        }}
        role='button'
        style={{ ...headerRowStyle, ...headerDividerStyle }}
        tabIndex={0}
      >
        <Header as='h3' style={innerHeaderStyle}>
          {title}
        </Header>
        <Icon
          circular
          color='blue'
          name={isExpanded ? 'chevron up' : 'chevron down'}
          style={chevronStyle}
        />
      </div>
      {isExpanded ? children : null}
    </section>
  );
};

export default CollapsibleSection;
