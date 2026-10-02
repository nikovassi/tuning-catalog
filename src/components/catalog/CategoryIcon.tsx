import {
  Activity, ArrowDownUp, Armchair, Car, CircleDot, Disc3, Filter, Gauge, Grid3x3, Lightbulb, Package, Pipette, Snowflake, Spline, Wind,
  type LucideIcon, type LucideProps,
} from 'lucide-react';

const icons: Record<string, LucideIcon> = {
  Activity, ArrowDownUp, Armchair, Car, CircleDot, Disc3, Filter, Gauge, Grid3x3, Lightbulb, Package, Pipette, Snowflake, Spline, Wind,
};

export function CategoryIcon({ name, ...props }: { name: string } & LucideProps) {
  const Icon = icons[name] ?? Package;
  return <Icon aria-hidden strokeWidth={1.5} {...props} />;
}
