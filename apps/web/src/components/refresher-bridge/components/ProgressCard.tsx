import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProgressCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor?: 'orange' | 'blue' | 'emerald' | 'purple';
  onClick?: () => void;
  actionText?: string;
  badge?: string;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accentColor = 'orange',
  onClick,
  actionText = 'View Section',
  badge,
}) => {
  const colorStyles = {
    orange: {
      bg: 'bg-orange-500/10',
      iconText: 'text-orange-600',
      border: 'border-orange-100 hover:border-orange-300',
      badge: 'bg-orange-100 text-orange-700',
      btn: 'text-orange-600 hover:text-orange-700',
    },
    blue: {
      bg: 'bg-blue-500/10',
      iconText: 'text-blue-600',
      border: 'border-blue-100 hover:border-blue-300',
      badge: 'bg-blue-100 text-blue-700',
      btn: 'text-blue-600 hover:text-blue-700',
    },
    emerald: {
      bg: 'bg-emerald-500/10',
      iconText: 'text-emerald-600',
      border: 'border-emerald-100 hover:border-emerald-300',
      badge: 'bg-emerald-100 text-emerald-700',
      btn: 'text-emerald-600 hover:text-emerald-700',
    },
    purple: {
      bg: 'bg-purple-500/10',
      iconText: 'text-purple-600',
      border: 'border-purple-100 hover:border-purple-300',
      badge: 'bg-purple-100 text-purple-700',
      btn: 'text-purple-600 hover:text-purple-700',
    },
  }[accentColor];

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={cn(
        'group relative bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between',
        colorStyles.border
      )}
    >
      <div>
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className={cn('p-3 rounded-xl', colorStyles.bg)}>
            <Icon className={cn('w-6 h-6', colorStyles.iconText)} />
          </div>
          {badge && (
            <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-semibold', colorStyles.badge)}>
              {badge}
            </span>
          )}
        </div>
        <h3 className="text-base font-bold text-slate-800 group-hover:text-slate-900 transition-colors">
          {title}
        </h3>
        <p className="text-2xl md:text-3xl font-extrabold text-slate-900 mt-1 font-display tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2">
            {subtitle}
          </p>
        )}
      </div>

      {onClick && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className={cn('text-xs font-bold flex items-center gap-1', colorStyles.btn)}>
            {actionText}
          </span>
          <ArrowUpRight className={cn('w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5', colorStyles.btn)} />
        </div>
      )}
    </motion.div>
  );
};

export default ProgressCard;
