import React from 'react';
import { X, CheckCircle2, FileText, Video, BookOpen, ExternalLink, Clock } from 'lucide-react';
import { IntroductoryMaterial } from '../types/refresher';
import { cn } from '@/lib/utils';

interface MaterialModalProps {
  material: IntroductoryMaterial | null;
  onClose: () => void;
  onUpdateStatus: (materialId: string, status: 'Not Started' | 'In Progress' | 'Completed') => void;
}

export const MaterialModal: React.FC<MaterialModalProps> = ({
  material,
  onClose,
  onUpdateStatus,
}) => {
  if (!material) return null;

  const isCompleted = material.status === 'Completed';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                {material.subject}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 text-slate-700">
                {material.type}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {material.duration}
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">{material.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          <p className="text-sm text-slate-600 leading-relaxed font-sans">{material.description}</p>

          {/* Media/Document Preview */}
          {material.type === 'Video' && material.videoUrl ? (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 shadow-md">
              <iframe
                src={material.videoUrl}
                title={material.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : material.type === 'Notes' && material.notesSnippet ? (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 text-sm font-sans space-y-3 leading-relaxed text-slate-800">
              <div className="flex items-center gap-2 text-purple-700 font-bold border-b border-slate-200 pb-2">
                <BookOpen className="w-4 h-4" />
                <span>Notes Preview & Summary</span>
              </div>
              <div className="whitespace-pre-line text-slate-700 font-mono text-xs bg-white p-4 rounded-xl border border-slate-200">
                {material.notesSnippet}
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-200 text-center flex flex-col items-center justify-center">
              <FileText className="w-12 h-12 text-red-500 mb-3" />
              <h5 className="text-base font-bold text-slate-900">PDF Learning Resource</h5>
              <p className="text-xs text-slate-500 mt-1 max-w-md">
                Click below to download or view the official reference PDF document for {material.title}.
              </p>
              {material.contentUrl && (
                <a
                  href={material.contentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all inline-flex items-center gap-2 shadow-sm"
                >
                  <span>Open PDF Reference</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Status:</span>
            <span
              className={cn(
                'px-2.5 py-0.5 rounded-full text-xs font-bold border',
                isCompleted
                  ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                  : 'bg-amber-100 text-amber-800 border-amber-200'
              )}
            >
              {material.status}
            </span>
          </div>

          <button
            onClick={() => {
              onUpdateStatus(material.id, isCompleted ? 'In Progress' : 'Completed');
            }}
            className={cn(
              'px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm',
              isCompleted
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            )}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Mark as In Progress' : 'Mark as Completed'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialModal;
