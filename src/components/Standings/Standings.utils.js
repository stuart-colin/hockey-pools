const AVATAR_COLORS = [
  '#db2828', // red
  '#f2711c', // orange
  '#b5cc18', // olive
  '#21ba45', // green
  '#00b5ad', // teal
  '#2185d0', // blue
  '#6435c9', // violet
  '#a333c8', // purple
  '#e03997', // pink
  '#a5673f', // brown
];

export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

export const getAvatarSvg = (name) => {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><circle cx="32" cy="32" r="32" fill="${color}"/><text x="32" y="32" text-anchor="middle" dy=".36em" fill="white" font-family="sans-serif" font-size="24" font-weight="500">${initials}</text></svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
};

export const TOP_10_COLORS = [
  '#66b36650',
  '#66b36650',
  '#73b97250',
  '#7fbf7e50',
  '#8bc58a50',
  '#97cb9650',
  '#afd7af50',
  '#bbddbb50',
  '#c7e3c750',
  '#d3e9d350',
];
