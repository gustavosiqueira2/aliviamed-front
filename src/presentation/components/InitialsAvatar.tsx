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

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
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
  size?: number;
  fontSize?: number;
  shadow?: boolean;
};

const InitialsAvatar = ({
  name,
  size = 32,
  fontSize = 12,
  shadow = false,
}: TInitialsAvatarProps) => (
  <div
    style={{
      fontSize: fontSize,
      background: `linear-gradient(140deg, ${colorFromName(name)}65, ${colorFromName(name)})`,
      minWidth: size,
      minHeight: size,
      width: size,
      height: size,
      boxShadow: shadow ? `${colorFromName(name)}28 0px 6px 20px 5px` : '',
    }}
    className="flex items-center justify-center rounded-full text-white"
  >
    {getInitials(name)}
  </div>
);

export default InitialsAvatar;
