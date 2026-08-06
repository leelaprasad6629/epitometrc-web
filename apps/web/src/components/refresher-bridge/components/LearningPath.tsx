import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Lock, Play, Clock, ArrowDown, ChevronRight, Sparkles } from 'lucide-react';
import { LearningPathStep } from '../types/refresher';
import { cn } from '@/lib/utils';

interface LearningPathProps {
  steps: LearningPathStep[];
  onCompleteStep: (stepNumber: number) => void;
  onActionClick: (step: LearningPathStep) => void;
}

export const LearningPath: React.FC<LearningPathProps> = ({
  steps,
  onCompleteStep,
  onActionClick,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative">
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const isLast = idx === steps.length - 1;

          return (
            <div key={step.stepNumber} className="relative">
              {/* Connector Line */}
              {!isLast && (
                <div
                  className={cn(
                    'absolute left-6 top-12 bottom-0 w-0.5 z-0 transition-colors duration-500',
                    step.status === 'Completed' ? 'bg-orange-500' : 'bg-slate-200'
                  )}
                  style={{ height: 'calc(100% + 1.5rem)' }}
                />
              )}

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border transition-all bg-white hover:shadow-md">
                <div className="flex items-start md:items-center gap-4">
                  {/* Step Icon Badge */}
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-all font-display shadow-sm',
                      step.status === 'Completed'
                        ? 'bg-emerald-500 text-white shadow-emerald-500/20'
                        : step.status === 'In Progress'
                        ? 'bg-orange-500 text-white ring-4 ring-orange-100 shadow-orange-500/20'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    )}
                  >
                    {step.status === 'Completed' ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : step.status === 'Locked' ? (
                      <Lock className="w-5 h-5 text-slate-400" />
                    ) : (
                      <span>{step.stepNumber}</span>
                    )}
                  </div>

                  {/* Details */}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded-full text-[11px] font-bold border',
                          step.status === 'Completed'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : step.status === 'In Progress'
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-slate-100 text-slate-500 border-slate-200'
                        )}
                      >
                        {step.status}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {step.estimatedDuration}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 font-display">
                      {step.title}
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5 max-w-xl font-sans">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  {step.status === 'In Progress' && (
                    <button
                      onClick={() => onCompleteStep(step.stepNumber)}
                      className="px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold transition-all"
                    >
                      Mark Complete
                    </button>
                  )}

                  <button
                    onClick={() => onActionClick(step)}
                    disabled={!step.isUnlocked}
                    className={cn(
                      'px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm',
                      step.status === 'Completed'
                        ? 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                        : step.isUnlocked
                        ? 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                    )}
                  >
                    {!step.isUnlocked ? (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Locked</span>
                      </>
                    ) : step.status === 'Completed' ? (
                      <>
                        <span>Review</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </>
                    ) : (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Start Step</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LearningPath;
