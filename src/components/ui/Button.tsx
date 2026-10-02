import { forwardRef, type AnchorHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Link, type LinkProps } from 'react-router-dom';
import { cn } from '../../lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'inverse-outline';
type Size = 'sm' | 'md' | 'lg' | 'icon';

const base =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium select-none transition-[background-color,border-color,color,box-shadow,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50';

const variants: Record<Variant, string> = {
  primary: 'bg-inverse text-inverse-fg hover:bg-inverse/90 shadow-card',
  accent: 'bg-accent text-accent-fg hover:bg-accent/90 shadow-card',
  secondary: 'border border-line-strong bg-surface text-fg hover:border-fg/40 hover:bg-surface-2',
  ghost: 'text-fg hover:bg-surface-2',
  'inverse-outline': 'border border-white/25 text-white hover:bg-white/10',
};

const sizes: Record<Size, string> = {
  sm: 'h-9 rounded-lg px-3 text-sm',
  md: 'h-11 rounded-xl px-4 text-[15px]',
  lg: 'h-12 rounded-xl px-6 text-[15px]',
  icon: 'h-10 w-10 rounded-xl',
};

interface Common {
  variant?: Variant;
  size?: Size;
  className?: string;
  children?: ReactNode;
}

export const buttonClass = (variant: Variant = 'primary', size: Size = 'md', className?: string) =>
  cn(base, variants[variant], sizes[size], className);

export const Button = forwardRef<HTMLButtonElement, Common & ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ variant, size, className, type = 'button', ...rest }, ref) => (
    <button ref={ref} type={type} className={buttonClass(variant, size, className)} {...rest} />
  ),
);
Button.displayName = 'Button';

export function ButtonLink({ variant, size, className, ...rest }: Common & LinkProps) {
  return <Link className={buttonClass(variant, size, className)} {...rest} />;
}

export function ButtonAnchor({ variant, size, className, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonClass(variant, size, className)} {...rest} />;
}
