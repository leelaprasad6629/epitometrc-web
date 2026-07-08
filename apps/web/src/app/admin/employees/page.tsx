"use client";

import { motion } from "framer-motion";
import { Briefcase, Search, Plus, Trash2 } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function AdminEmployeesPage() {
  const employees = [
    { id: 1, name: "Marcus Thorne", department: "Recruitment", openJobs: 8, status: "Active" },
    { id: 2, name: "Sarah Jenkins", department: "Consulting", openJobs: 3, status: "Active" },
  ];

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
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          <Plus className="mr-1 h-4 w-4" /> Add Employee
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md bg-white p-1 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search employees, department..."
            className="pl-10 h-10 border-0 focus:ring-0 w-full bg-transparent"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-2.5">Name</th>
                <th className="py-2.5">Department</th>
                <th className="py-2.5">Open Jobs</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {employees.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-bold text-[#0b172a]">{e.name}</td>
                  <td className="py-3 text-slate-400">{e.department}</td>
                  <td className="py-3">{e.openJobs} active listings</td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                      {e.status}
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button className="text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="h-4.5 w-4.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
