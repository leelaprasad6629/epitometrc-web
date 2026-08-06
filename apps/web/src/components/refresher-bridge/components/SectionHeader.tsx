import React from 'react';
import { Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  badge?: string;
  className?: string;
  children?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  badge,
  className,
  children,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6', className)}>
      <div>
        <div className="flex items-center gap-2 mb-1">
          {badge && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
              <Sparkles className="w-3 h-3 text-orange-500" />
              {badge}
            </span>
          )}
        </div>
        <h2 className="text-xl md:text-2xl font-bold tracking-tight text-slate-900 font-display">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-slate-500 mt-0.5 max-w-2xl font-sans">
            {subtitle}
          </p>
        )}
      </div>
      {children && <div className="flex items-center gap-2 shrink-0">{children}</div>}
    </div>
  );
};

export default SectionHeader;
