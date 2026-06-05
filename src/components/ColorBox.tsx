import * as React from 'react';
import * as LucideIcons from 'lucide-react';
import { cn } from '../lib/utils';

// All named colors in the app palette
export type BoxColor =
  | 'slate' | 'red' | 'orange' | 'yellow'
  | 'green' | 'teal' | 'blue' | 'purple' | 'pink'
  | 'white' | 'black';

// 100 tint for background, 300 tint for border — sourced directly from tailwind.config.ts
const COLOR_VALUES: Record<BoxColor, { bg: string; border: string }> = {
  slate:  { bg: '#EDE9E0', border: '#B8B3A5' },
  red:    { bg: '#FCDAD8', border: '#F48D88' },
  orange: { bg: '#FCDFC4', border: '#F5A265' },
  yellow: { bg: '#FDF5C0', border: '#F7DC4A' },
  green:  { bg: '#D2EAD0', border: '#7EBF79' },
  teal:   { bg: '#C4E8E4', border: '#57B8B0' },
  blue:   { bg: '#C9E1F7', border: '#62A8E5' },
  purple: { bg: '#DDD9FB', border: '#9D91EF' },
  pink:   { bg: '#F8D2E3', border: '#E67EAE' },
  white:  { bg: '#FFFFFF', border: '#D5D0C4' },
  black:  { bg: '#1F1D19', border: '#4A4640' },
};

const ICON_COLOR_DARK = '#33302B';  // slate-800, for light backgrounds
const ICON_COLOR_LIGHT = '#EDE9E0'; // slate-100, for dark backgrounds
const DARK_BACKGROUNDS: BoxColor[] = ['black'];

interface ColorBoxProps {
  /** Box width and height in pixels */
  size: number;
  color: BoxColor;
  /** Exact Lucide icon name, e.g. "Bell", "BookOpen", "GraduationCap". Omit to render a plain colored box. */
  iconName?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ColorBox({ size, color, iconName, className, style }: ColorBoxProps) {
  const { bg, border } = COLOR_VALUES[color];
  const iconColor = DARK_BACKGROUNDS.includes(color) ? ICON_COLOR_LIGHT : ICON_COLOR_DARK;

  // Scale icon to ~50% of box, corners to ~22% for a consistent pill-like radius
  const iconSize = Math.round(size * 0.55);
  const radius = Math.round(size * 0.22);

  // Dynamic Lucide lookup — falls back to a neutral placeholder if the name is wrong or omitted
  const Icon = iconName
    ? ((LucideIcons as Record<string, unknown>)[iconName] as LucideIcons.LucideIcon | undefined)
    : undefined;

  return (
    <div
      className={cn(className)}
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        border: `1.5px solid ${border}`,
        borderRadius: radius,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        ...style,
      }}
    >
      {Icon && <Icon size={iconSize} color={iconColor} strokeWidth={1.5} />}
    </div>
  );
}
