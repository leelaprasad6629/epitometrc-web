"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BookOpen, Search, Plus, Trash2 } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Software Engineering");
  const [newDescription, setNewDescription] = useState("");
  const [newDuration, setNewDuration] = useState("12 Weeks");
  const [newModules, setNewModules] = useState("8");
  const [adding, setAdding] = useState(false);

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setAdding(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          category: newCategory,
          description: newDescription,
          duration: newDuration,
          modules: newModules,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCourses((prev) => [data.course, ...prev]);
        setNewTitle("");
        setNewDescription("");
        setShowAddModal(false);
      } else {
        alert(data.error || "Failed to create course");
      }
    } catch {
      alert("Failed to create course due to a network error.");
    } finally {
      setAdding(false);
    }
  };

  const loadCourses = (query = "") => {
    fetch(`/api/admin/courses?search=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setCourses(payload.courses);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadCourses(search);
  }, [search]);

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm("Are you sure you want to delete this course? This will remove all associated user enrollments!")) return;

    try {
      const res = await fetch(`/api/admin/courses?courseId=${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCourses((prev) => prev.filter((c) => c.id !== courseId));
      } else {
        alert(data.error || "Failed to delete course");
      }
    } catch {
      alert("Failed to delete course due to a network error.");
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 font-sans"
    >
      <div className="flex flex-col gap-1 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-[#0b172a] sm:text-3xl">
            Manage Courses
          </h1>
          <p className="text-slate-500 text-sm">
            Control curriculum delivery, adjust pricing structures, and view course metrics.
          </p>
        </div>
        <Button onClick={() => setShowAddModal(true)} variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          <Plus className="mr-1 h-4 w-4" /> Add Course
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md bg-white p-1 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search courses..."
            className="pl-10 h-10 border-0 focus:ring-0 w-full bg-transparent"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-2.5">Course</th>
                <th className="py-2.5">Category</th>
                <th className="py-2.5">Enrollment</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {courses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No courses found matching search criteria.
                  </td>
                </tr>
              ) : (
                courses.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-[#0b172a]">{c.title}</td>
                    <td className="py-3 text-slate-400">{c.category}</td>
                    <td className="py-3">{c.enrollment} enrolled</td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteCourse(c.id)}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-4.5 w-4.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Course Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b172a]/40 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-2xl border border-slate-100 p-6 shadow-xl space-y-4"
          >
            <h3 className="font-display text-base font-bold text-slate-900">
              Create New Course Curriculum
            </h3>

            <form onSubmit={handleCreateCourse} className="space-y-3.5 text-left">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Course Title</label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Next.js App Router Masterclass"
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white"
                >
                  <option value="Software Engineering">Software Engineering</option>
                  <option value="Cloud Computing & DevOps">Cloud Computing & DevOps</option>
                  <option value="Product Strategy">Product Strategy</option>
                  <option value="IT Services Management">IT Services Management</option>
                  <option value="Corporate Training">Corporate Training</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Duration</label>
                  <input
                    type="text"
                    required
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    placeholder="e.g. 12 Weeks"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Modules Count</label>
                  <input
                    type="number"
                    required
                    value={newModules}
                    onChange={(e) => setNewModules(e.target.value)}
                    placeholder="e.g. 8"
                    className="w-full h-9 px-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Summarize course goals and targeting syllabus skills..."
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-200 text-xs font-semibold text-slate-655 focus:outline-none bg-white resize-none"
                />
              </div>

              <div className="flex gap-2.5 justify-end pt-3 border-t border-slate-50">
                <Button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  variant="outline"
                  className="h-9 px-4 rounded-xl font-bold border-slate-200 hover:bg-slate-50 text-slate-700 text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={adding}
                  variant="primary"
                  className="h-9 px-4 rounded-xl font-bold bg-[#0b172a] hover:bg-slate-800 text-white text-xs disabled:opacity-50"
                >
                  {adding ? "Creating..." : "Create Course"}
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
