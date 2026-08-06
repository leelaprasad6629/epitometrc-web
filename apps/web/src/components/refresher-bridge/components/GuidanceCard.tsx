import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Video, MapPin, UserCheck, CheckCircle2, Info, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { GuidanceSession } from '../types/refresher';
import { cn } from '@/lib/utils';

interface GuidanceCardProps {
  session: GuidanceSession;
  onRegisterToggle: (session: GuidanceSession) => void;
  onViewDetails: (session: GuidanceSession) => void;
}

export const GuidanceCard: React.FC<GuidanceCardProps> = ({
  session,
  onRegisterToggle,
  onViewDetails,
}) => {
  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Mentor Info Header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border-2 border-orange-100 bg-slate-100">
            <Image
              src={session.mentorAvatar}
              alt={session.mentorName}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h5 className="text-xs font-bold text-slate-900 truncate">{session.mentorName}</h5>
            <p className="text-[11px] text-slate-500 truncate">{session.mentorTitle}</p>
          </div>
          <span
            className={cn(
              'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shrink-0',
              session.mode === 'Online'
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            )}
          >
            {session.mode === 'Online' ? <Video className="w-3 h-3 text-emerald-600" /> : <MapPin className="w-3 h-3 text-indigo-600" />}
            {session.mode}
          </span>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2 mb-3 font-display">
          {session.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-4 leading-relaxed font-sans">
          {session.description}
        </p>

        {/* Timing Details */}
        <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl mb-4 border border-slate-100 font-sans">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{session.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{session.time} ({session.duration})</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500">
            {session.mode === 'Online' ? (
              <Video className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <span className="truncate">{session.locationOrLink}</span>
          </div>
        </div>
      </div>

      {/* Footer Action Buttons */}
      <div className="flex items-center gap-2 pt-2">
        <button
          onClick={() => onRegisterToggle(session)}
          className={cn(
            'flex-1 py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm',
            session.isRegistered
              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
              : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
          )}
        >
          {session.isRegistered ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              <span>Registered</span>
            </>
          ) : (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Register</span>
            </>
          )}
        </button>

        {session.isRegistered && session.mode === 'Online' && (
          <a
            href={session.locationOrLink}
            target="_blank"
            rel="noopener noreferrer"
            className="py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 shadow-sm"
          >
            <span>Join</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        )}

        <button
          onClick={() => onViewDetails(session)}
          className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
          title="View Details"
        >
          <Info className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
};

export default GuidanceCard;
