import React from 'react';
import { X, Calendar, Clock, Video, MapPin, CheckCircle2, UserCheck, ExternalLink, Users } from 'lucide-react';
import Image from 'next/image';
import { GuidanceSession } from '../types/refresher';
import { cn } from '@/lib/utils';

interface GuidanceModalProps {
  session: GuidanceSession | null;
  onClose: () => void;
  onRegisterToggle: (session: GuidanceSession) => void;
}

export const GuidanceModal: React.FC<GuidanceModalProps> = ({
  session,
  onClose,
  onRegisterToggle,
}) => {
  if (!session) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 border-2 border-orange-200 bg-slate-100">
              <Image
                src={session.mentorAvatar}
                alt={session.mentorName}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200 inline-block mb-1">
                {session.subject}
              </span>
              <h3 className="text-lg font-bold text-slate-900 font-display">{session.mentorName}</h3>
              <p className="text-xs text-slate-500">{session.mentorTitle}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5 font-sans">
          <div>
            <h4 className="text-xl font-bold text-slate-900 mb-2 font-display">{session.title}</h4>
            <p className="text-sm text-slate-600 leading-relaxed">{session.description}</p>
          </div>

          {/* Session Overview Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3 text-xs text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="flex items-center gap-2 font-semibold">
                <Calendar className="w-4 h-4 text-orange-500" />
                Date & Time:
              </span>
              <span className="font-bold text-slate-900">{session.date} • {session.time}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="flex items-center gap-2 font-semibold">
                <Clock className="w-4 h-4 text-orange-500" />
                Duration:
              </span>
              <span className="font-bold text-slate-900">{session.duration}</span>
            </div>

            <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
              <span className="flex items-center gap-2 font-semibold">
                {session.mode === 'Online' ? <Video className="w-4 h-4 text-emerald-600" /> : <MapPin className="w-4 h-4 text-indigo-600" />}
                Mode & Location:
              </span>
              <span className="font-bold text-slate-900">{session.mode} ({session.locationOrLink})</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-2 font-semibold">
                <Users className="w-4 h-4 text-blue-500" />
                Registered Students:
              </span>
              <span className="font-bold text-slate-900">{session.registeredCount} Students Enrolled</span>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          {session.isRegistered && session.mode === 'Online' ? (
            <a
              href={session.locationOrLink}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5 shadow-sm"
            >
              <span>Join Meeting</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-slate-500">
              {session.isRegistered ? 'You are registered for this session.' : 'Register to secure your slot.'}
            </span>
          )}

          <button
            onClick={() => onRegisterToggle(session)}
            className={cn(
              'px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm',
              session.isRegistered
                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
            )}
          >
            {session.isRegistered ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>Registered</span>
              </>
            ) : (
              <>
                <UserCheck className="w-4 h-4" />
                <span>Register Now</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuidanceModal;
