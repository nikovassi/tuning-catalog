import { RotateCcw } from 'lucide-react';
import { useId, useMemo } from 'react';
import { getProducts } from '../../lib/catalog';
import { cn } from '../../lib/cn';
import type { Product } from '../../types/catalog';
import {
  VEHICLE_LEVELS, hasVehicle, setVehicleLevel, vehicleLevelLabel, vehicleOptions, type VehicleLevel, type VehicleSelection,
} from '../../lib/vehicles';
import { Select } from '../ui/Select';

interface Props {
  value: VehicleSelection;
  onChange: (v: VehicleSelection) => void;
  products?: Product[];
  layout?: 'stack' | 'row';
  className?: string;
}

/** Каскаден избор Марка → Модел → Поколение → Двигател → Година. Нивата без данни се скриват. */
export function VehicleFinder({ value, onChange, products, layout = 'stack', className }: Props) {
  const id = useId();
  const source = products ?? getProducts();
  const opts = useMemo(() => vehicleOptions(source, value), [source, value]);

  const levels = VEHICLE_LEVELS.filter((lvl) => {
    if (lvl === 'make') return true;
    // показваме ниво, ако има опции или вече има избрана стойност
    return (opts[lvl] as unknown[]).length > 0 || value[lvl] !== undefined;
  });

  // скелетни (disabled) нива за ясна последователност преди избор на марка
  const pending: VehicleLevel[] = value.make ? [] : ['model', 'year'];

  return (
    <div className={cn(layout === 'row' ? 'grid gap-3 sm:grid-cols-2 lg:grid-flow-col lg:auto-cols-fr lg:grid-cols-none' : 'flex flex-col gap-3', className)}>
      {[...levels, ...pending.filter((p) => !levels.includes(p))].map((lvl) => {
        const options = opts[lvl] as (string | number)[];
        const disabled = !options.length;
        return (
          <div key={lvl} className="min-w-0">
            <label htmlFor={`${id}-${lvl}`} className="mb-1.5 block text-[12px] font-medium text-muted">{vehicleLevelLabel[lvl]}</label>
            <Select
              id={`${id}-${lvl}`}
              value={value[lvl] !== undefined ? String(value[lvl]) : ''}
              disabled={disabled}
              onChange={(e) => onChange(setVehicleLevel(value, lvl, e.target.value || undefined))}
            >
              <option value="">{disabled ? '—' : 'Всички'}</option>
              {options.map((o) => <option key={o} value={o}>{o}</option>)}
            </Select>
          </div>
        );
      })}
      {hasVehicle(value) && (
        <button
          type="button"
          onClick={() => onChange({})}
          className={cn('inline-flex items-center gap-1.5 self-start text-[13px] font-medium text-muted transition-colors hover:text-fg', layout === 'row' && 'lg:self-end lg:pb-3')}
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Изчисти автомобила
        </button>
      )}
    </div>
  );
}
