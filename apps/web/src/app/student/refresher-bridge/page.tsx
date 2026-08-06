"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Award,
  CalendarCheck,
  Compass,
  CheckCircle2,
  Sparkles,
  Search,
  RotateCcw,
} from 'lucide-react';
import { useRefresherBridge } from '@/components/refresher-bridge/hooks/useRefresherBridge';
import SectionHeader from '@/components/refresher-bridge/components/SectionHeader';
import ProgressCard from '@/components/refresher-bridge/components/ProgressCard';
import ProgressTracker from '@/components/refresher-bridge/components/ProgressTracker';
import SearchBar from '@/components/refresher-bridge/components/SearchBar';
import FilterDropdown from '@/components/refresher-bridge/components/FilterDropdown';
import MaterialCard from '@/components/refresher-bridge/components/MaterialCard';
import AssessmentCard from '@/components/refresher-bridge/components/AssessmentCard';
import GuidanceCard from '@/components/refresher-bridge/components/GuidanceCard';
import LearningPath from '@/components/refresher-bridge/components/LearningPath';
import RecommendationCard from '@/components/refresher-bridge/components/RecommendationCard';
import MaterialModal from '@/components/refresher-bridge/components/MaterialModal';
import QuizModal from '@/components/refresher-bridge/components/QuizModal';
import GuidanceModal from '@/components/refresher-bridge/components/GuidanceModal';

export default function RefresherBridgePage() {
  const {
    loading,
    data,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    subjectsList,
    filteredMaterials,
    filteredAssessments,
    filteredGuidanceSessions,
    selectedMaterial,
    setSelectedMaterial,
    selectedAssessment,
    setSelectedAssessment,
    selectedGuidance,
    setSelectedGuidance,
    toastMessage,
    handleUpdateMaterialStatus,
    handleSubmitQuizScore,
    handleToggleSessionRegistration,
    handleCompleteLearningStep,
    handleStartRecommendation,
  } = useRefresherBridge();

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (loading || !data) {
    return (
      <div className="space-y-6 pb-12 animate-pulse">
        {/* Skeleton Banner */}
        <div className="h-44 bg-slate-200 rounded-3xl w-full" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
          <div className="h-32 bg-slate-200 rounded-2xl" />
        </div>
        <div className="h-64 bg-slate-200 rounded-3xl" />
      </div>
    );
  }

  const { progress } = data;

  return (
    <div className="space-y-10 pb-16">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 text-xs font-semibold"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-orange-950 to-slate-900 text-white p-8 md:p-10 shadow-xl border border-orange-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold mb-3 border border-orange-500/30">
            <Sparkles className="w-3.5 h-3.5 text-orange-400" />
            <span>Prerequisite Foundation Module</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-display tracking-tight text-white mb-2">
            Refresher / Bridge Session
          </h1>
          <p className="text-sm md:text-base text-slate-300 font-sans leading-relaxed">
            Strengthen your fundamentals before moving to advanced learning. Complete introductory materials, evaluate your diagnostic readiness through quizzes, and join expert mentor guidance sessions.
          </p>
        </div>

        {/* Hero Quick Progress Counters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center gap-3 bg-slate-800/60 p-3.5 rounded-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-orange-500/20 text-orange-400">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Sessions Completed</p>
              <p className="text-lg font-bold font-display text-white">
                {progress.sessionsCompleted} / {progress.sessionsTotal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/60 p-3.5 rounded-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Assessments Passed</p>
              <p className="text-lg font-bold font-display text-white">
                {progress.assessmentsPassed} / {progress.assessmentsTotal}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-800/60 p-3.5 rounded-2xl backdrop-blur-sm border border-slate-700/50">
            <div className="p-2.5 rounded-xl bg-blue-500/20 text-blue-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold">Overall Progress</p>
              <p className="text-lg font-bold font-display text-orange-400">
                {progress.overallProgressPercent}%
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Overview Navigation Cards */}
      <section className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard
            title="Introductory Materials"
            value={`${progress.materialsCompleted}/${progress.materialsTotal}`}
            subtitle="Explore reference PDFs, video lectures, and revision notes."
            icon={BookOpen}
            accentColor="orange"
            actionText="View Materials"
            onClick={() => scrollToSection('sec-materials')}
            badge="10 Items"
          />

          <ProgressCard
            title="Assessments"
            value={`${progress.assessmentsPassed}/${progress.assessmentsTotal}`}
            subtitle="Take self-check diagnostic quizzes to validate readiness."
            icon={Award}
            accentColor="emerald"
            actionText="Take Quizzes"
            onClick={() => scrollToSection('sec-assessments')}
            badge="8 Quizzes"
          />

          <ProgressCard
            title="Guidance Sessions"
            value={`${progress.sessionsCompleted}/${progress.sessionsTotal}`}
            subtitle="Register & join online/offline sessions with tech mentors."
            icon={CalendarCheck}
            accentColor="blue"
            actionText="View Sessions"
            onClick={() => scrollToSection('sec-guidance')}
            badge="6 Mentors"
          />

          <ProgressCard
            title="Recommended Path"
            value={progress.currentStage.split(':')[0]}
            subtitle="Follow a structured step-by-step roadmap to unlock core courses."
            icon={Compass}
            accentColor="purple"
            actionText="View Roadmap"
            onClick={() => scrollToSection('sec-roadmap')}
            badge="5 Steps"
          />
        </div>
      </section>

      {/* 8. Student Progress Tracking Dashboard */}
      <section>
        <ProgressTracker progress={progress} />
      </section>

      {/* Search & Global Filter Bar */}
      <section className="bg-white p-4 md:p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <SearchBar
          value={filters.searchTerm}
          onChange={(val) => setFilters((prev) => ({ ...prev, searchTerm: val }))}
          className="flex-1"
        />

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <FilterDropdown
            label="Subject"
            value={filters.selectedSubject}
            options={subjectsList.map((s) => ({ label: s, value: s }))}
            onChange={(val) => setFilters((prev) => ({ ...prev, selectedSubject: val }))}
          />

          <FilterDropdown
            label="Resource Type"
            value={filters.selectedType}
            options={[
              { label: 'All Types', value: 'All' },
              { label: 'PDF Documents', value: 'PDF' },
              { label: 'Video Lectures', value: 'Video' },
              { label: 'Revision Notes', value: 'Notes' },
            ]}
            onChange={(val) => setFilters((prev) => ({ ...prev, selectedType: val }))}
          />

          {(filters.searchTerm || filters.selectedSubject !== 'All' || filters.selectedType !== 'All') && (
            <button
              onClick={() => setFilters({ searchTerm: '', selectedSubject: 'All', selectedType: 'All' })}
              className="px-3 py-2 text-xs font-bold text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </section>

      {/* 4. Introductory Materials Section */}
      <section id="sec-materials" className="space-y-4">
        <SectionHeader
          title="Introductory Materials"
          subtitle="Essential reading and video content to refresh core concepts before advanced coursework."
          badge={`${filteredMaterials.length} Available`}
        />

        {filteredMaterials.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredMaterials.map((material) => (
              <MaterialCard
                key={material.id}
                material={material}
                onOpen={(mat) => setSelectedMaterial(mat)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No materials found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No learning materials match your current search and filter criteria. Try adjusting the search term or subject dropdown.
            </p>
          </div>
        )}
      </section>

      {/* 5. Assessments Section */}
      <section id="sec-assessments" className="space-y-4">
        <SectionHeader
          title="Assessments & Diagnostic Quizzes"
          subtitle="Test your comprehension with quick multiple-choice assessments. Scores update your readiness metrics immediately."
          badge={`${filteredAssessments.length} Quizzes`}
        />

        {filteredAssessments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredAssessments.map((assessment) => (
              <AssessmentCard
                key={assessment.id}
                assessment={assessment}
                onTakeQuiz={(quiz) => setSelectedAssessment(quiz)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No assessments found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No diagnostic assessments match the selected search or subject filter.
            </p>
          </div>
        )}
      </section>

      {/* 6. Guidance Sessions Section */}
      <section id="sec-guidance" className="space-y-4">
        <SectionHeader
          title="Mentor Guidance Sessions"
          subtitle="Connect with industry mentors in live online masterclasses or campus offline workshops."
          badge={`${filteredGuidanceSessions.length} Sessions`}
        />

        {filteredGuidanceSessions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGuidanceSessions.map((session) => (
              <GuidanceCard
                key={session.id}
                session={session}
                onRegisterToggle={(sess) => handleToggleSessionRegistration(sess)}
                onViewDetails={(sess) => setSelectedGuidance(sess)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-10 border border-slate-200 text-center space-y-3">
            <Search className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-base font-bold text-slate-800">No guidance sessions found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              No mentor sessions match your current filter parameters.
            </p>
          </div>
        )}
      </section>

      {/* 7. Recommended Learning Path Roadmap */}
      <section id="sec-roadmap" className="space-y-4">
        <SectionHeader
          title="Recommended Prerequisite Learning Path"
          subtitle="A structured step-by-step roadmap enforcing prerequisite sequence before unlocking advanced core modules."
          badge="Prerequisite Roadmap"
        />

        <LearningPath
          steps={data.learningPath}
          onCompleteStep={(stepNum) => handleCompleteLearningStep(stepNum)}
          onActionClick={(step) => {
            if (step.resourceId) {
              const mat = data.materials.find((m) => m.id === step.resourceId);
              if (mat) setSelectedMaterial(mat);
            } else if (step.assessmentId) {
              const quiz = data.assessments.find((a) => a.id === step.assessmentId);
              if (quiz) setSelectedAssessment(quiz);
            }
          }}
        />
      </section>

      {/* 9. Recommended Content */}
      <section className="space-y-4">
        <SectionHeader
          title="Recommended For You"
          subtitle="Personalized recommendations based on incomplete prerequisites and pending assessments."
          badge="Smart Suggestions"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.recommendations.map((rec) => (
            <RecommendationCard
              key={rec.id}
              recommendation={rec}
              onStart={(r) => handleStartRecommendation(r)}
            />
          ))}
        </div>
      </section>

      {/* Modals */}
      <MaterialModal
        material={selectedMaterial}
        onClose={() => setSelectedMaterial(null)}
        onUpdateStatus={(id, status) => handleUpdateMaterialStatus(id, status)}
      />

      <QuizModal
        assessment={selectedAssessment}
        onClose={() => setSelectedAssessment(null)}
        onSubmitScore={(id, score) => handleSubmitQuizScore(id, score)}
      />

      <GuidanceModal
        session={selectedGuidance}
        onClose={() => setSelectedGuidance(null)}
        onRegisterToggle={(sess) => handleToggleSessionRegistration(sess)}
      />
    </div>
  );
}
