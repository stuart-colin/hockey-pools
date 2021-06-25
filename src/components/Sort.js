import React from 'react';

const compare = (a, b) => {
  if (a > b) {
    
  }
}

const Sort = ({ children, by }) => {
  if (!by) {
    return children;
  }
  return children.toArray(children).sort(compare);
}

export default Sort;