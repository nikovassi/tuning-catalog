import { Moon, Sun } from 'lucide-react';
import { useTheme } from '../lib/theme';

export function ThemeToggle({ className = '' }: { className?: string }) {
  const { theme, toggle } = useTheme();
  const dark = theme === 'dark';
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Включи светла тема' : 'Включи тъмна тема'}
      title={dark ? 'Светла тема' : 'Тъмна тема'}
      className={`relative grid h-10 w-10 place-items-center rounded-xl text-muted transition-colors hover:bg-surface-2 hover:text-fg ${className}`}
    >
      <Sun className={`h-[18px] w-[18px] transition-all duration-300 ${dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`} />
      <Moon className={`absolute h-[18px] w-[18px] transition-all duration-300 ${dark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`} />
    </button>
  );
}
