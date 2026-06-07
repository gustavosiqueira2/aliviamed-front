import { Avatar, type AvatarProps } from 'antd';

const COLORS = [
  '#1677ff',
  '#10b981',
  '#8b5cf6',
  '#f59e0b',
  '#ef4444',
  '#06b6d4',
  '#ec4899',
  '#14b8a6',
];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();

  return (
    parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
  ).toUpperCase();
};

const colorFromName = (name: string) => {
  let hash = 0;

  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }

  return COLORS[Math.abs(hash) % COLORS.length];
};

type TInitialsAvatarProps = {
  name: string;
} & Omit<AvatarProps, 'children'>;

const InitialsAvatar = ({ name, style, ...rest }: TInitialsAvatarProps) => (
  <Avatar style={{ backgroundColor: colorFromName(name), ...style }} {...rest}>
    {getInitials(name)}
  </Avatar>
);

export default InitialsAvatar;
