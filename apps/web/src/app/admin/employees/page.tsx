"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Search, Plus, Trash2, Upload } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";
import BulkImportModal from "@/components/common/BulkImportModal";

export default function AdminEmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showImportModal, setShowImportModal] = useState(false);

  // Add Employee Modal States
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newRole, setNewRole] = useState("Employee");
  const [addError, setAddError] = useState("");
  const [addLoading, setAddLoading] = useState(false);

  const handleAddEmployee = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddError("");
    setAddLoading(true);

    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName, email: newEmail, password: newPassword, role: newRole }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to create employee");
      }

      setShowAddModal(false);
      setNewName("");
      setNewEmail("");
      setNewPassword("");
      setNewRole("Employee");
      loadEmployees(search);
    } catch (err: any) {
      setAddError(err.message || "Failed to add employee");
    } finally {
      setAddLoading(false);
    }
  };

  const loadEmployees = (query = "") => {
    fetch(`/api/admin/users?role=Employee&search=${encodeURIComponent(query)}`)
      .then((res) => res.json())
      .then((payload) => {
        if (payload.success) {
          setEmployees(payload.users);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadEmployees(search);
  }, [search]);

  const handleDeleteEmployee = async (userId: string) => {
    if (!confirm("Are you sure you want to delete this employee account?")) return;

    try {
      const res = await fetch(`/api/admin/users?userId=${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setEmployees((prev) => prev.filter((e) => e.id !== userId));
      } else {
        alert(data.error || "Failed to delete employee");
      }
    } catch {
      alert("Failed to delete employee due to a network error.");
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
            Manage Employees
          </h1>
          <p className="text-slate-500 text-sm">
            Oversee staff profiles, assign departments, and track active deliverables.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-auto">
          <Button
            onClick={() => setShowImportModal(true)}
            variant="outline"
            size="sm"
            className="h-9 px-3 rounded-xl font-bold flex items-center gap-1.5"
          >
            <Upload className="h-4 w-4 text-slate-500" /> Import CSV
          </Button>
          <Button 
            onClick={() => setShowAddModal(true)}
            variant="primary" 
            size="sm" 
            className="h-9 px-4 rounded-xl font-bold"
          >
            <Plus className="mr-1 h-4 w-4" /> Add Employee
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md bg-white p-1 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search employees..."
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
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {employees.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-slate-400">
                    No employees found matching search criteria.
                  </td>
                </tr>
              ) : (
                employees.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 font-bold text-[#0b172a]">{e.name}</td>
                    <td className="py-3 text-slate-400">{e.email}</td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-wider">
                        {e.role}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                        {e.status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => handleDeleteEmployee(e.id)}
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

      <BulkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        entityRole="Employee"
        onImportComplete={() => loadEmployees(search)}
      />

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl relative space-y-5">
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-slate-800">Add Staff Member</h3>
              <p className="text-[11px] text-slate-500">Create a new corporate account with temporary login credentials.</p>
            </div>

            {addError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-semibold text-red-600">
                {addError}
              </div>
            )}

            <form onSubmit={handleAddEmployee} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Full Name</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Email Address</label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. j.doe@epitometrc.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Temporary Password</label>
                <Input
                  type="text"
                  required
                  placeholder="e.g. TempPass123!"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 rounded-xl border-slate-200 focus:border-orange-500 focus:ring-orange-500/10 w-full font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-700 uppercase tracking-wider block">Assign Role</label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold focus:border-orange-500 focus:outline-none focus:ring-orange-500/10 w-full"
                >
                  <option value="Employee">Employee</option>
                  <option value="Intern">Intern</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="h-9 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <Button
                  type="submit"
                  disabled={addLoading}
                  className="h-9 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {addLoading ? "Creating..." : "Create Account"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </motion.div>
  );
}
