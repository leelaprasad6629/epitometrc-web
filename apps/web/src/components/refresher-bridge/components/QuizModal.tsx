import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Clock, RotateCcw, ArrowRight, ArrowLeft } from 'lucide-react';
import { Assessment } from '../types/refresher';
import { cn } from '@/lib/utils';

interface QuizModalProps {
  assessment: Assessment | null;
  onClose: () => void;
  onSubmitScore: (assessmentId: string, scorePercent: number) => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({
  assessment,
  onClose,
  onSubmitScore,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  if (!assessment) return null;

  const questions = assessment.questions || [];
  const currentQ = questions[currentQuestionIndex];

  const handleOptionSelect = (qId: string, optIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIndex }));
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const scorePct = Math.round((correctCount / (questions.length || 1)) * 100);
    setFinalScore(scorePct);
    setIsSubmitted(true);
    onSubmitScore(assessment.id, scorePct);
  };

  const isPassed = finalScore !== null && finalScore >= assessment.passingPercentage;

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
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                {assessment.subject}
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {assessment.estimatedTime}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Pass mark: {assessment.passingPercentage}%
              </span>
            </div>
            <h3 className="text-xl font-bold text-slate-900 font-display">{assessment.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quiz Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Submitted Result Scorecard Banner */}
          {isSubmitted && finalScore !== null && (
            <div
              className={cn(
                'rounded-2xl p-5 border text-center space-y-2',
                isPassed ? 'bg-emerald-50 border-emerald-200 text-emerald-950' : 'bg-red-50 border-red-200 text-red-950'
              )}
            >
              <div className="inline-flex p-3 rounded-full bg-white shadow-sm mb-1">
                {isPassed ? <CheckCircle2 className="w-8 h-8 text-emerald-600" /> : <XCircle className="w-8 h-8 text-red-600" />}
              </div>
              <h4 className="text-xl font-bold font-display">
                {isPassed ? 'Assessment Passed! 🎉' : 'Assessment Needs Improvement'}
              </h4>
              <p className="text-3xl font-extrabold font-display">
                {finalScore}%
              </p>
              <p className="text-xs font-sans text-slate-600">
                {isPassed
                  ? `Congratulations! You scored above the required ${assessment.passingPercentage}% threshold.`
                  : `Passing threshold is ${assessment.passingPercentage}%. Review the explanations below and try again.`}
              </p>
            </div>
          )}

          {/* Question Stepper */}
          {currentQ && (
            <div className="space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{Object.keys(selectedAnswers).length} Answered</span>
              </div>

              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-orange-500 h-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>

              <h4 className="text-base font-bold text-slate-900 leading-snug font-display">
                {currentQ.question}
              </h4>

              {/* Options list */}
              <div className="space-y-2.5 pt-2">
                {currentQ.options.map((option, optIdx) => {
                  const isSelected = selectedAnswers[currentQ.id] === optIdx;
                  const isCorrect = currentQ.correctAnswerIndex === optIdx;

                  let optionStyle = 'border-slate-200 bg-white hover:border-slate-300 text-slate-800';

                  if (isSubmitted) {
                    if (isCorrect) {
                      optionStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-semibold';
                    } else if (isSelected && !isCorrect) {
                      optionStyle = 'border-red-500 bg-red-50 text-red-950';
                    } else {
                      optionStyle = 'border-slate-200 bg-slate-50 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyle = 'border-orange-500 bg-orange-50 text-orange-950 ring-2 ring-orange-500/20 font-semibold';
                  }

                  return (
                    <button
                      key={optIdx}
                      onClick={() => handleOptionSelect(currentQ.id, optIdx)}
                      disabled={isSubmitted}
                      className={cn(
                        'w-full text-left p-4 rounded-xl border text-xs md:text-sm transition-all flex items-center justify-between gap-3 shadow-sm',
                        optionStyle
                      )}
                    >
                      <span className="flex-1">{option}</span>
                      {isSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                      {isSubmitted && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Answer Explanation */}
              {isSubmitted && currentQ.explanation && (
                <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 leading-relaxed font-sans">
                  <span className="font-bold block mb-1">Explanation:</span>
                  {currentQ.explanation}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Controls */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-4">
          <button
            onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestionIndex === 0}
            className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {!isSubmitted ? (
            currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={calculateResults}
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
              >
                <span>Submit Quiz</span>
                <CheckCircle2 className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(questions.length - 1, prev + 1))}
                className="px-5 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1"
              >
                <span>Next Question</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )
          ) : (
            <div className="flex items-center gap-2">
              {currentQuestionIndex < questions.length - 1 && (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all flex items-center gap-1"
                >
                  <span>Next Question</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {assessment.attemptsRemaining > 0 && (
                <button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setCurrentQuestionIndex(0);
                    setFinalScore(null);
                  }}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-sm transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retake Quiz</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;
