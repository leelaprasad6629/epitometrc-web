import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, CalendarCheck, CheckCircle2, Flame, Layers } from 'lucide-react';
import { StudentProgress } from '../types/refresher';

interface ProgressTrackerProps {
  progress: StudentProgress;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  const percent = Math.min(100, Math.max(0, progress.overallProgressPercent));
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
      {/* Background Glow Overlay */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Circular Ring & Hero Stat */}
        <div className="lg:col-span-5 flex items-center gap-5 border-b lg:border-b-0 lg:border-r border-slate-700/60 pb-6 lg:pb-0 lg:pr-6">
          <div className="relative flex items-center justify-center shrink-0">
            <svg className="w-28 h-28 transform -rotate-90">
              <circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-slate-700/60"
                strokeWidth="9"
                fill="transparent"
              />
              <motion.circle
                cx="56"
                cy="56"
                r={radius}
                className="stroke-orange-500"
                strokeWidth="9"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-2xl font-extrabold font-display">{percent}%</span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Overall</span>
            </div>
          </div>

          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-2 border border-orange-500/30">
              <Flame className="w-3.5 h-3.5 text-orange-400" />
              <span>{progress.streakDays} Day Learning Streak</span>
            </div>
            <h3 className="text-lg font-bold text-white">Student Progress Dashboard</h3>
            <p className="text-xs text-slate-300 mt-1">
              Current Stage: <span className="text-orange-400 font-semibold">{progress.currentStage}</span>
            </p>
          </div>
        </div>

        {/* Right Stats Breakdown */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
              <BookOpen className="w-4 h-4 text-orange-400" />
              <span>Materials</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-display">
                {progress.materialsCompleted} <span className="text-xs text-slate-400 font-normal">/ {progress.materialsTotal}</span>
              </span>
              <span className="text-xs font-bold text-orange-400">
                {Math.round((progress.materialsCompleted / (progress.materialsTotal || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-orange-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(progress.materialsCompleted / (progress.materialsTotal || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
              <Award className="w-4 h-4 text-emerald-400" />
              <span>Assessments</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-display">
                {progress.assessmentsPassed} <span className="text-xs text-slate-400 font-normal">/ {progress.assessmentsTotal}</span>
              </span>
              <span className="text-xs font-bold text-emerald-400">
                {Math.round((progress.assessmentsPassed / (progress.assessmentsTotal || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(progress.assessmentsPassed / (progress.assessmentsTotal || 1)) * 100}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold mb-2">
              <CalendarCheck className="w-4 h-4 text-blue-400" />
              <span>Guidance Sessions</span>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-bold font-display">
                {progress.sessionsCompleted} <span className="text-xs text-slate-400 font-normal">/ {progress.sessionsTotal}</span>
              </span>
              <span className="text-xs font-bold text-blue-400">
                {Math.round((progress.sessionsCompleted / (progress.sessionsTotal || 1)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden mt-2">
              <div
                className="bg-blue-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${(progress.sessionsCompleted / (progress.sessionsTotal || 1)) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
