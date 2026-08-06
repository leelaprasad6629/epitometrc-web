import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, Clock, Award, CheckCircle2, AlertCircle, Play, RotateCcw, Eye } from 'lucide-react';
import { Assessment } from '../types/refresher';
import { cn } from '@/lib/utils';

interface AssessmentCardProps {
  assessment: Assessment;
  onTakeQuiz: (assessment: Assessment) => void;
}

export const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onTakeQuiz }) => {
  const getStatusBadge = () => {
    if (assessment.status === 'Passed') {
      return {
        text: 'Passed',
        bg: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        icon: CheckCircle2,
      };
    }
    if (assessment.status === 'Failed') {
      return {
        text: 'Failed',
        bg: 'bg-red-100 text-red-800 border-red-200',
        icon: AlertCircle,
      };
    }
    if (assessment.status === 'In Progress') {
      return {
        text: 'In Progress',
        bg: 'bg-amber-100 text-amber-800 border-amber-200',
        icon: Clock,
      };
    }
    return {
      text: 'Not Attempted',
      bg: 'bg-slate-100 text-slate-700 border-slate-200',
      icon: HelpCircle,
    };
  };

  const statusInfo = getStatusBadge();
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Top Section */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            {assessment.subject}
          </span>
          <span className={cn('inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border', statusInfo.bg)}>
            <StatusIcon className="w-3 h-3" />
            {statusInfo.text}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-3 font-display">
          {assessment.title}
        </h4>

        {/* Previous Score Banner */}
        {assessment.lastScore !== undefined && (
          <div
            className={cn(
              'rounded-xl p-3 mb-4 flex items-center justify-between border text-xs font-semibold',
              assessment.lastScore >= assessment.passingPercentage
                ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                : 'bg-red-50 text-red-900 border-red-200'
            )}
          >
            <span>Previous Score:</span>
            <span className="text-sm font-extrabold font-display">{assessment.lastScore}%</span>
          </div>
        )}

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{assessment.questionsCount} Questions</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{assessment.estimatedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Pass: {assessment.passingPercentage}%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Attempts: {assessment.attemptsRemaining}/{assessment.maxAttempts}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div>
        {assessment.status === 'Passed' ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onTakeQuiz(assessment)}
              className="flex-1 py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Review Results</span>
            </button>
            {assessment.attemptsRemaining > 0 && (
              <button
                onClick={() => onTakeQuiz(assessment)}
                className="py-2.5 px-3 bg-orange-50 hover:bg-orange-100 text-orange-700 rounded-xl text-xs font-bold transition-all border border-orange-200"
              >
                Retake
              </button>
            )}
          </div>
        ) : assessment.status === 'In Progress' ? (
          <button
            onClick={() => onTakeQuiz(assessment)}
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-500/20"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Continue Assessment</span>
          </button>
        ) : (
          <button
            onClick={() => onTakeQuiz(assessment)}
            disabled={assessment.attemptsRemaining <= 0}
            className={cn(
              'w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-sm',
              assessment.attemptsRemaining > 0
                ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            )}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>{assessment.attemptsRemaining > 0 ? 'Start Assessment' : 'No Attempts Remaining'}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
};

export default AssessmentCard;
