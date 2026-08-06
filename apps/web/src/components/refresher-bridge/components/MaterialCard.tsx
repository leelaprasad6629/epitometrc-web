import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Video, BookOpen, Clock, CheckCircle2, PlayCircle, ArrowRight } from 'lucide-react';
import { IntroductoryMaterial } from '../types/refresher';
import { cn } from '@/lib/utils';

interface MaterialCardProps {
  material: IntroductoryMaterial;
  onOpen: (material: IntroductoryMaterial) => void;
}

export const MaterialCard: React.FC<MaterialCardProps> = ({ material, onOpen }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'PDF':
        return {
          icon: FileText,
          bg: 'bg-red-50 text-red-700 border-red-200',
          iconColor: 'text-red-500',
        };
      case 'Video':
        return {
          icon: Video,
          bg: 'bg-blue-50 text-blue-700 border-blue-200',
          iconColor: 'text-blue-500',
        };
      case 'Notes':
      default:
        return {
          icon: BookOpen,
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          iconColor: 'text-purple-500',
        };
    }
  };

  const typeConfig = getTypeBadge(material.type);
  const TypeIcon = typeConfig.icon;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Not Started':
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5">
            <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold border', typeConfig.bg)}>
              <TypeIcon className={cn('w-3.5 h-3.5', typeConfig.iconColor)} />
              {material.type}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
              {material.subject}
            </span>
          </div>
          <span className={cn('px-2.5 py-0.5 rounded-full text-[11px] font-bold border', getStatusBadge(material.status))}>
            {material.status}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-2 font-display">
          {material.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-sans">
          {material.description}
        </p>
      </div>

      <div>
        {/* Footer Meta Details */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 mb-4">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {material.duration}
          </span>
          <span className="font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
            {material.difficulty}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onOpen(material)}
          className={cn(
            'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm',
            material.status === 'Completed'
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
          )}
        >
          {material.status === 'Completed' ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Review Material</span>
            </>
          ) : material.status === 'In Progress' ? (
            <>
              <PlayCircle className="w-4 h-4" />
              <span>Continue Learning</span>
            </>
          ) : (
            <>
              <span>Start Learning</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

export default MaterialCard;
