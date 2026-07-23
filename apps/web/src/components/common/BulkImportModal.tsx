"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  Play, 
  History,
  Info 
} from "lucide-react";
import Button from "@/components/common/Button";

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  entityRole: "Student" | "Employee";
  onImportComplete: () => void;
}

interface ParsedRow {
  rowNumber: number;
  data: {
    name: string;
    email: string;
    contactNumber: string;
    status?: string;
  };
  errors: { field: string; message: string }[];
  isValid: boolean;
}

interface ImportHistoryItem {
  timestamp: string;
  processed: number;
  success: number;
  skipped: number;
  failed: number;
  status: "Success" | "Partial Success" | "Failed";
}

export default function BulkImportModal({
  isOpen,
  onClose,
  entityRole,
  onImportComplete
}: BulkImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [importing, setImporting] = useState(false);
  const [resultSummary, setResultSummary] = useState<{
    total: number;
    success: number;
    skipped: number;
    failed: number;
  } | null>(null);
  const [skipErrors, setSkipErrors] = useState(true);
  const [importHistory, setImportHistory] = useState<ImportHistoryItem[]>([]);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Generate CSV Templates
  const downloadTemplate = () => {
    let csvContent = "";
    if (entityRole === "Student") {
      csvContent = "name,email,contactNumber\nAlex Mercer,alex@epitome.com,+91 99999 88888\nSarah Connor,sarah@epitome.com,+91 77777 66666";
    } else {
      csvContent = "name,email,contactNumber\nJohn Staff,john.staff@epitome.com,+91 88888 77777\nJane Worker,jane.worker@epitome.com,+91 66666 55555";
    }
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `epitome_${entityRole.toLowerCase()}_template.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Simple Parser and Validator
  const handleCSVData = (text: string) => {
    const lines = text.split(/\r?\n/);
    if (lines.length <= 1) return;

    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const emailIndex = headers.indexOf("email");
    const nameIndex = headers.indexOf("name");
    const contactIndex = headers.indexOf("contactnumber");

    const tempRows: ParsedRow[] = [];
    const emailSet = new Set<string>();

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const columns = line.split(",").map(c => c.trim());
      const rowEmail = columns[emailIndex] || "";
      const rowName = columns[nameIndex] || "";
      const rowContact = columns[contactIndex] || "";

      const rowErrors: { field: string; message: string }[] = [];

      // Validations
      if (!rowName) {
        rowErrors.push({ field: "name", message: "Name is required" });
      }
      if (!rowEmail) {
        rowErrors.push({ field: "email", message: "Email is required" });
      } else if (!/\S+@\S+\.\S+/.test(rowEmail)) {
        rowErrors.push({ field: "email", message: "Invalid email format" });
      } else if (emailSet.has(rowEmail)) {
        rowErrors.push({ field: "email", message: "Duplicate email in CSV sheet" });
      } else {
        emailSet.add(rowEmail);
      }

      if (rowContact && !/^\+?[0-9\s-]{10,15}$/.test(rowContact)) {
        rowErrors.push({ field: "contactNumber", message: "Contact must be a 10-15 digit number" });
      }

      tempRows.push({
        rowNumber: i + 1,
        data: {
          name: rowName,
          email: rowEmail,
          contactNumber: rowContact
        },
        errors: rowErrors,
        isValid: rowErrors.length === 0
      });
    }

    setParsedRows(tempRows);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.name.endsWith(".csv")) {
        setFile(droppedFile);
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            handleCSVData(event.target.result as string);
          }
        };
        reader.readAsText(droppedFile);
      } else {
        alert("Only CSV files are accepted.");
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          handleCSVData(event.target.result as string);
        }
      };
      reader.readAsText(selectedFile);
    }
  };

  // Perform Server Import
  const handleConfirmImport = async () => {
    const validRows = parsedRows.filter(r => r.isValid);
    const invalidRows = parsedRows.filter(r => !r.isValid);

    if (!skipErrors && invalidRows.length > 0) {
      alert("Please fix all errors or switch to 'Skip invalid rows' option.");
      return;
    }

    if (validRows.length === 0) {
      alert("No valid rows to import.");
      return;
    }

    setImporting(true);

    try {
      const response = await fetch("/api/admin/users/bulk-import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: entityRole,
          users: validRows.map(r => r.data)
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        const summary = {
          total: parsedRows.length,
          success: data.importedCount,
          skipped: parsedRows.length - data.importedCount - invalidRows.length,
          failed: invalidRows.length
        };
        setResultSummary(summary);
        
        // Add to history
        setImportHistory(prev => [
          {
            timestamp: new Date().toLocaleString(),
            processed: summary.total,
            success: summary.success,
            skipped: summary.skipped,
            failed: summary.failed,
            status: summary.failed > 0 ? "Partial Success" : "Success"
          },
          ...prev
        ]);
        
        onImportComplete();
      } else {
        alert(data.error || "Failed to process import on server.");
      }
    } catch (err) {
      console.error(err);
      alert("Network error processing import.");
    } finally {
      setImporting(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setParsedRows([]);
    setResultSummary(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b172a]/40 backdrop-blur-sm p-4 animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-6 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-orange-50 flex items-center justify-center border border-orange-100">
              <Upload className="h-4.5 w-4.5 text-orange-500" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[#0b172a]">
                Bulk Import {entityRole}s
              </h3>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">CSV Upload Portal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Success/Summary State */}
        {resultSummary ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-100">
              <CheckCircle className="h-6 w-6 text-emerald-500 shrink-0" />
              <div>
                <h4 className="font-bold text-slate-900 text-xs">Import Complete</h4>
                <p className="text-[10px] text-slate-500 font-medium">Successfully processed record sheet.</p>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 text-center font-sans text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Total Rows</p>
                <p className="text-base font-black text-slate-800">{resultSummary.total}</p>
              </div>
              <div className="bg-green-50/50 p-3.5 rounded-2xl border border-green-100/50">
                <p className="text-green-500 text-[10px] font-bold uppercase tracking-wider">Success</p>
                <p className="text-base font-black text-green-600">{resultSummary.success}</p>
              </div>
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">Skipped</p>
                <p className="text-base font-black text-slate-500">{resultSummary.skipped}</p>
              </div>
              <div className="bg-red-50/50 p-3.5 rounded-2xl border border-red-100/50">
                <p className="text-red-500 text-[10px] font-bold uppercase tracking-wider">Failed</p>
                <p className="text-base font-black text-red-600">{resultSummary.failed}</p>
              </div>
            </div>

            {/* Error logs download if failed exists */}
            {resultSummary.failed > 0 && (
              <div className="p-4 rounded-2xl border border-red-100 bg-red-50/20 text-xs space-y-3">
                <div className="flex gap-2 items-start text-red-600 font-bold">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0" />
                  <span>Some records could not be validated.</span>
                </div>
                <button
                  onClick={() => {
                    const failedRows = parsedRows.filter(r => !r.isValid);
                    const csvContent = "rowNumber,email,errors\n" + failedRows.map(r => `Row ${r.rowNumber},${r.data.email},"${r.errors.map(e => e.message).join("; ")}"`).join("\n");
                    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.setAttribute("download", `import_errors_${entityRole.toLowerCase()}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="h-9 px-4 rounded-xl bg-white border border-red-200 hover:border-red-300 text-red-600 font-bold flex items-center gap-1.5 transition-all shadow-sm"
                >
                  <Download className="h-4 w-4" /> Download Error Log
                </button>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button onClick={handleReset} className="h-10 rounded-xl px-4 font-bold text-xs" variant="outline">
                Import Another File
              </Button>
              <Button onClick={onClose} className="h-10 rounded-xl px-5 font-bold text-xs">
                Done
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Template Download Area */}
            <div className="flex justify-between items-center p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs font-semibold">
              <div className="flex items-center gap-2.5">
                <FileText className="h-5 w-5 text-slate-400" />
                <div>
                  <p className="text-slate-800 text-[11px] font-bold">Download sample spreadsheet</p>
                  <p className="text-[10px] text-slate-400 font-medium">Pre-formatted columns structure template</p>
                </div>
              </div>
              <button
                onClick={downloadTemplate}
                className="h-8 px-3 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-white text-slate-700 font-bold transition-all flex items-center gap-1"
              >
                <Download className="h-3.5 w-3.5" /> Template
              </button>
            </div>

            {/* Drag & Drop Upload Zone */}
            {!file ? (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-3xl p-10 text-center cursor-pointer transition-all ${
                  dragActive
                    ? "border-orange-500 bg-orange-50/20"
                    : "border-slate-200 hover:border-slate-300 bg-slate-50/20"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <div className="space-y-3 font-sans text-xs">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                    <Upload className="h-5 w-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-slate-700">Drag & drop CSV file or browse</p>
                    <p className="text-slate-400 text-[10px] font-semibold">Supported formats: CSV (up to 5MB)</p>
                  </div>
                </div>
              </div>
            ) : (
              /* Data Preview & validation state */
              <div className="space-y-4 font-sans text-xs">
                <div className="flex justify-between items-center p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-orange-500" />
                    <span className="font-bold text-slate-700">{file.name}</span>
                  </div>
                  <button onClick={handleReset} className="text-[10px] font-bold text-red-500 hover:text-red-700">
                    Remove
                  </button>
                </div>

                {/* Validation summary bar */}
                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  <span>Preview Data ({parsedRows.length} total rows)</span>
                  <div className="flex gap-3">
                    <span className="text-green-600">Valid: {parsedRows.filter(r => r.isValid).length}</span>
                    <span className="text-red-500">Invalid: {parsedRows.filter(r => !r.isValid).length}</span>
                  </div>
                </div>

                {/* Preview Table */}
                <div className="border border-slate-100 rounded-2xl overflow-hidden max-h-[160px] overflow-y-auto">
                  <table className="w-full text-left font-sans text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-slate-50 text-slate-400 uppercase tracking-wider font-bold border-b border-slate-100">
                        <th className="p-2.5">Row</th>
                        <th className="p-2.5">Name</th>
                        <th className="p-2.5">Email</th>
                        <th className="p-2.5">Contact Number</th>
                        <th className="p-2.5">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50 font-semibold text-slate-600">
                      {parsedRows.slice(0, 10).map((row, idx) => (
                        <tr key={idx} className={row.isValid ? "" : "bg-red-50/20"}>
                          <td className="p-2.5">{row.rowNumber}</td>
                          <td className="p-2.5">{row.data.name || "-"}</td>
                          <td className="p-2.5">{row.data.email || "-"}</td>
                          <td className="p-2.5">{row.data.contactNumber || "-"}</td>
                          <td className="p-2.5">
                            {row.isValid ? (
                              <span className="text-green-600 flex items-center gap-1"><CheckCircle className="h-3 w-3" /> Valid</span>
                            ) : (
                              <span className="text-red-500 flex items-center gap-1" title={row.errors.map(e => e.message).join(", ")}>
                                <AlertCircle className="h-3 w-3" /> Invalid
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Error checklist reporting panel */}
                {parsedRows.filter(r => !r.isValid).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Validation Errors Checklist</p>
                    <div className="max-h-[100px] overflow-y-auto border border-red-100 bg-red-50/10 rounded-2xl p-3 text-[10px] font-semibold text-slate-600 space-y-1.5 pr-1">
                      {parsedRows.filter(r => !r.isValid).map((row, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <span className="text-red-500 font-black">Row {row.rowNumber}:</span>
                          <span className="text-slate-600">{row.errors.map(e => `[${e.field}] ${e.message}`).join(", ")}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action controls */}
                <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl border border-slate-100 text-[10.5px] font-semibold text-slate-500">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={skipErrors}
                      onChange={(e) => setSkipErrors(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    <span>Skip invalid rows and import valid ones</span>
                  </label>
                  <span className="text-[10px] text-slate-400">Errors can be exported in summary log</span>
                </div>
              </div>
            )}

            {/* History Section */}
            {importHistory.length > 0 && !file && (
              <div className="space-y-3 font-sans text-xs border-t border-slate-100 pt-5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <History className="h-4 w-4 text-slate-400" /> Recent Upload Logs
                </h4>
                <div className="divide-y divide-slate-50 max-h-[120px] overflow-y-auto">
                  {importHistory.map((item, idx) => (
                    <div key={idx} className="py-2.5 flex justify-between items-center text-[10.5px] font-semibold text-slate-600">
                      <div>
                        <p className="text-slate-800 font-bold">{item.timestamp}</p>
                        <p className="text-[9.5px] text-slate-400 font-medium">Processed: {item.processed} • Success: {item.success} • Fail: {item.failed}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                        item.status === "Success"
                          ? "bg-green-50 text-green-600 border border-green-100"
                          : "bg-orange-50 text-orange-600 border border-orange-100"
                      }`}>
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal Controls */}
            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <Button onClick={onClose} variant="outline" className="h-10 rounded-xl px-4 font-bold text-xs">
                Cancel
              </Button>
              <Button
                disabled={!file || importing}
                onClick={handleConfirmImport}
                className="h-10 rounded-xl px-5 font-bold text-xs shadow-md shadow-orange-500/10"
              >
                {importing ? "Importing..." : "Confirm Import"}
              </Button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
