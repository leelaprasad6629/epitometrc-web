"use client";

import { motion } from "framer-motion";
import { Users, Search, Plus, Trash2, ShieldAlert } from "lucide-react";
import Button from "@/components/common/Button";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const users = [
    { id: 1, name: "Alex Thompson", email: "alex.t@epitome.com", role: "Student", status: "Active" },
    { id: 2, name: "Marcus Thorne", email: "m.thorne@epitome.com", role: "Employee", status: "Active" },
    { id: 3, name: "Sarah Jennings", email: "s.jennings@epitome.com", role: "Admin", status: "Active" },
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
            Manage Users
          </h1>
          <p className="text-slate-500 text-sm">
            Control user login access, verify security credentials, and modify role parameters.
          </p>
        </div>
        <Button variant="primary" size="sm" className="h-9 px-4 rounded-xl font-bold shrink-0 self-start sm:self-auto">
          <Plus className="mr-1 h-4 w-4" /> Add User
        </Button>
      </div>

      <div className="flex items-center gap-3 w-full max-w-md bg-white p-1 rounded-xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search users, email patterns, roles..."
            className="pl-10 h-10 border-0 focus:ring-0 w-full bg-transparent"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                <th className="py-2.5">User</th>
                <th className="py-2.5">Email</th>
                <th className="py-2.5">Role</th>
                <th className="py-2.5">Status</th>
                <th className="py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3 font-bold text-[#0b172a]">{u.name}</td>
                  <td className="py-3">{u.email}</td>
                  <td className="py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wider ${
                      u.role === "Admin"
                        ? "bg-purple-50 text-purple-600 border-purple-100"
                        : u.role === "Employee"
                        ? "bg-blue-50 text-blue-600 border-blue-100"
                        : "bg-orange-50 text-orange-600 border-orange-100"
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3">
                    <span className="inline-flex px-2 py-0.5 rounded text-[9px] font-bold bg-green-50 text-green-600 border border-green-100 uppercase tracking-wider">
                      {u.status}
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
