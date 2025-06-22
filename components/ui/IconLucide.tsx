import { icons } from 'lucide-react-native';
import type { FC } from 'react';

type IconLucideProps = {
  name: keyof typeof icons;
  color?: string;
  size?: number;
};

const Icon: FC<IconLucideProps> = ({ name, color = "#000", size = 24 }) => {
  // eslint-disable-next-line import/namespace
  const LucideIcon = icons[name];
  if (!LucideIcon) return null;
  return <LucideIcon color={color} size={size} />;
};

export default Icon;