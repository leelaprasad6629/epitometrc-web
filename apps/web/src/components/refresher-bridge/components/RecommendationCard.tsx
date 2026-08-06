import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Clock, ArrowRight, HelpCircle, FileText, Video, BookOpen } from 'lucide-react';
import { Recommendation } from '../types/refresher';

interface RecommendationCardProps {
  recommendation: Recommendation;
  onStart: (recommendation: Recommendation) => void;
}

const getRecommendationIcon = (type: string) => {
  switch (type) {
    case 'Video':
      return Video;
    case 'PDF':
      return FileText;
    case 'Quiz':
      return HelpCircle;
    case 'Notes':
    default:
      return BookOpen;
  }
};

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onStart,
}) => {
  const Icon = getRecommendationIcon(recommendation.type);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Recommendation Reason Pill */}
        <div className="flex items-center gap-1.5 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200/60">
            <Sparkles className="w-3 h-3 text-orange-500" />
            {recommendation.reason}
          </span>
        </div>

        {/* Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className="p-2.5 rounded-xl bg-slate-100 text-slate-700 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors shrink-0">
            <Icon className="w-5 h-5" />
          </div>
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 font-display">
            {recommendation.title}
          </h4>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500 mb-3 font-sans">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            {recommendation.estimatedTime}
          </span>
          <span className="font-semibold text-slate-600 bg-slate-50 px-2 py-0.5 rounded">
            {recommendation.difficulty}
          </span>
        </div>

        <button
          onClick={() => onStart(recommendation)}
          className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm shadow-orange-500/20"
        >
          <span>Start Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
