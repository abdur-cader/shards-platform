import {
  Github,
  CalendarDays,
  Edit,
  Heart,
  Bookmark,
  Share2,
} from "lucide-react";

export const Icons = {
  github: Github,
  calendar: CalendarDays,
  edit: Edit,
  heart: Heart,
  bookmark: Bookmark,
  share2: Share2,
  // Add more icons as needed
};

export type IconName = keyof typeof Icons;

interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
}

export function Icon({ name, ...props }: IconProps) {
  const LucideIcon = Icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  return <LucideIcon {...props} />;
}
