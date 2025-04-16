import React, { useEffect, useState } from 'react';
import { Menu } from 'semantic-ui-react';

const Link = ({ href, name, active, children }) => {
  const [activeItem, setActiveItem] = useState('insights');

  useEffect(() => {
    onMenuSelect(activeItem);
  }, [activeItem]);

  const onClick = (event) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }

    event.preventDefault();
    window.history.pushState({}, '', href);

    const navEvent = new PopStateEvent('popstate');
    window.dispatchEvent(navEvent);
  };

  console.log(name)

  return (
    <Menu.Item
      onClick={onClick}
      href={href}
      name={name}
      active={active}>
      {children}
    </Menu.Item>
  )

};

export default Link;