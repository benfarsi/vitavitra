import {
  Droplets,
  Scissors,
  Sparkles,
  Waves,
  Leaf,
  Car,
  Home,
  LayoutGrid,
  CalendarDays,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Phone,
  Mail,
  Pencil,
  LogOut,
  Plus,
  FileText,
  Clock,
  ClipboardList,
  ArrowLeft,
  X,
} from 'lucide-react-native';
import { Colors } from '../constants/theme';

const ICON_MAP: Record<string, any> = {
  Droplets,
  Scissors,
  Sparkles,
  Waves,
  Leaf,
  Car,
  Home,
  LayoutGrid,
  CalendarDays,
  User,
  ChevronLeft,
  ChevronRight,
  Check,
  MapPin,
  Phone,
  Mail,
  Pencil,
  LogOut,
  Plus,
  FileText,
  Clock,
  ClipboardList,
  ArrowLeft,
  X,
};

interface ServiceIconProps {
  name: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
}

export default function ServiceIcon({ name, size = 22, color = Colors.navy, strokeWidth = 1.75 }: ServiceIconProps) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} strokeWidth={strokeWidth} />;
}

export { ICON_MAP };
