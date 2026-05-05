import { 
  Home, 
  MapPin, 
  Car, 
  Plane, 
  Leaf, 
  Utensils, 
  HelpCircle 
} from "lucide-react";
import { Category } from "@/types/expense";

interface CategoryIconProps {
  category: Category;
  className?: string;
  size?: number;
}

export const CategoryIcon = ({ category, className, size = 20 }: CategoryIconProps) => {
  switch (category) {
    case 'Room Rent':
      return <Home className={className} size={size} />;
    case 'Travel to Home':
      return <Plane className={className} size={size} />;
    case 'Daily Travelling':
      return <Car className={className} size={size} />;
    case 'Extra Travelling':
      return <MapPin className={className} size={size} />;
    case 'Vegetables':
      return <Leaf className={className} size={size} />;
    case 'Outside Food':
      return <Utensils className={className} size={size} />;
    default:
      return <HelpCircle className={className} size={size} />;
  }
};

export const CATEGORY_COLORS: Record<Category, string> = {
  'Room Rent': 'bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-400',
  'Travel to Home': 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  'Daily Travelling': 'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  'Extra Travelling': 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  'Vegetables': 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  'Outside Food': 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
};
