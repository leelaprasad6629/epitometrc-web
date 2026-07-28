"use client";

import React, { useEffect, useState, useRef } from "react";
import { FileText, Video, Upload, Download, Eye, RefreshCw, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export interface ResumeFileMetadata {
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  mimeType?: string;
}

export interface VideoResumeFileMetadata {
  userId: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  uploadedAt: string;
  duration?: string;
  mimeType?: string;
}

function formatBytes(bytes: number, decimals = 1) {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ResumeMediaManager() {
  // Document Resume state
  const [docResume, setDocResume] = useState<ResumeFileMetadata | null>(null);
  const [loadingDoc, setLoadingDoc] = useState(true);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [docError, setDocError] = useState<string | null>(null);
  const [docSuccess, setDocSuccess] = useState<string | null>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Video Resume state
  const [videoResume, setVideoResume] = useState<VideoResumeFileMetadata | null>(null);
  const [loadingVideo, setLoadingVideo] = useState(true);
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [videoError, setVideoError] = useState<string | null>(null);
  const [videoSuccess, setVideoSuccess] = useState<string | null>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  // Fetch initial resume metadata
  useEffect(() => {
    async function fetchDocResume() {
      try {
        const res = await fetch("/api/student/resume");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.resumeFile) {
            setDocResume(data.resumeFile);
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch document resume:", err);
      } finally {
        setLoadingDoc(false);
      }
    }

    async function fetchVideoResume() {
      try {
        const res = await fetch("/api/student/video-resume");
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.videoResumeFile) {
            setVideoResume(data.videoResumeFile);
          }
        }
      } catch (err: unknown) {
        console.error("Failed to fetch video resume:", err);
      } finally {
        setLoadingVideo(false);
      }
    }

    fetchDocResume();
    fetchVideoResume();
  }, []);

  // Handle Document Resume Upload
  const handleDocUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setDocError(null);
    setDocSuccess(null);

    // Validate type
    const validExts = [".pdf", ".doc", ".docx"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validExts.includes(ext)) {
      setDocError("Invalid file type. Please upload a PDF, DOC, or DOCX document.");
      if (docInputRef.current) docInputRef.current.value = "";
      return;
    }

    // Validate size (10 MB)
    const maxDocSize = 10 * 1024 * 1024;
    if (file.size > maxDocSize) {
      setDocError(`File size exceeds 10 MB limit (${formatBytes(file.size)}).`);
      if (docInputRef.current) docInputRef.current.value = "";
      return;
    }

    setUploadingDoc(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/student/resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDocResume(data.resumeFile);
        setDocSuccess(docResume ? "Resume replaced successfully!" : "Resume uploaded successfully!");
        setTimeout(() => setDocSuccess(null), 4000);
      } else {
        setDocError(data.error || "Failed to upload document resume.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setDocError("Upload failed due to a network error: " + errorMsg);
    } finally {
      setUploadingDoc(false);
      if (docInputRef.current) docInputRef.current.value = "";
    }
  };

  // Handle Video Resume Upload
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoError(null);
    setVideoSuccess(null);

    // Validate type
    const validVideoExts = [".mp4", ".mov", ".webm"];
    const ext = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();
    if (!validVideoExts.includes(ext)) {
      setVideoError("Invalid video format. Please upload an MP4, MOV, or WEBM video file.");
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    // Validate size (100 MB)
    const maxVideoSize = 100 * 1024 * 1024;
    if (file.size > maxVideoSize) {
      setVideoError(`Video file size exceeds 100 MB limit (${formatBytes(file.size)}).`);
      if (videoInputRef.current) videoInputRef.current.value = "";
      return;
    }

    setUploadingVideo(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/student/video-resume", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setVideoResume(data.videoResumeFile);
        setVideoSuccess(videoResume ? "Video resume replaced successfully!" : "Video resume uploaded successfully!");
        setTimeout(() => setVideoSuccess(null), 4000);
      } else {
        setVideoError(data.error || "Failed to upload video resume.");
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      setVideoError("Upload failed due to a network error: " + errorMsg);
    } finally {
      setUploadingVideo(false);
      if (videoInputRef.current) videoInputRef.current.value = "";
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full my-6">
      {/* 1. Document Resume Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Document Resume</h3>
                <p className="text-xs text-slate-500 font-medium">Supported: PDF, DOC, DOCX (Max 10 MB)</p>
              </div>
            </div>

            <input
              type="file"
              ref={docInputRef}
              accept=".pdf,.doc,.docx"
              onChange={handleDocUpload}
              className="hidden"
            />
          </div>

          {/* Notifications */}
          {docSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              {docSuccess}
            </div>
          )}
          {docError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              {docError}
            </div>
          )}

          {/* Document Content */}
          <div className="py-5">
            {loadingDoc ? (
              <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-xs font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-orange-500" /> Loading resume details...
              </div>
            ) : docResume ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-white rounded-lg border border-slate-200 shrink-0 text-orange-600 font-bold text-xs uppercase">
                      {docResume.fileName.substring(docResume.fileName.lastIndexOf(".") + 1) || "DOC"}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate" title={docResume.fileName}>
                        {docResume.fileName}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                        <span>{formatBytes(docResume.fileSize)}</span>
                        <span>•</span>
                        <span>Uploaded {formatDate(docResume.uploadedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60 mt-1">
                  <a
                    href={docResume.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <Eye className="h-3.5 w-3.5" /> View Resume
                  </a>

                  <a
                    href={docResume.fileUrl}
                    download={docResume.fileName}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download
                  </a>

                  <button
                    disabled={uploadingDoc}
                    onClick={() => docInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-orange-50 border border-orange-200 hover:bg-orange-100 text-orange-700 text-xs font-bold transition-all shadow-2xs ml-auto disabled:opacity-50"
                  >
                    {uploadingDoc ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {uploadingDoc ? "Replacing..." : "Replace Resume"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <Upload className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-3">No document resume uploaded yet</p>
                <button
                  disabled={uploadingDoc}
                  onClick={() => docInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                >
                  {uploadingDoc ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingDoc ? "Uploading..." : "Upload Resume"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Video Resume Section */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <Video className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Video Resume</h3>
                <p className="text-xs text-slate-500 font-medium">Supported: MP4, MOV, WEBM (Max 100 MB)</p>
              </div>
            </div>

            <input
              type="file"
              ref={videoInputRef}
              accept=".mp4,.mov,.webm"
              onChange={handleVideoUpload}
              className="hidden"
            />
          </div>

          {/* Notifications */}
          {videoSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
              {videoSuccess}
            </div>
          )}
          {videoError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
              {videoError}
            </div>
          )}

          {/* Video Content */}
          <div className="py-5">
            {loadingVideo ? (
              <div className="flex items-center justify-center py-8 text-slate-400 gap-2 text-xs font-medium">
                <Loader2 className="h-4 w-4 animate-spin text-indigo-500" /> Loading video details...
              </div>
            ) : videoResume ? (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-3">
                <div className="w-full">
                  <video
                    src={videoResume.fileUrl}
                    controls
                    autoPlay={false}
                    preload="metadata"
                    className="w-full max-h-56 rounded-lg bg-slate-950 border border-slate-800 shadow-xs"
                  />
                </div>

                <div className="flex items-center justify-between min-w-0">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-800 text-sm truncate" title={videoResume.fileName}>
                      {videoResume.fileName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-medium mt-0.5">
                      <span>{formatBytes(videoResume.fileSize)}</span>
                      <span>•</span>
                      <span>Uploaded {formatDate(videoResume.uploadedAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 mt-1">
                  <a
                    href={videoResume.fileUrl}
                    download={videoResume.fileName}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition-all shadow-2xs"
                  >
                    <Download className="h-3.5 w-3.5" /> Download Video
                  </a>

                  <button
                    disabled={uploadingVideo}
                    onClick={() => videoInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 text-xs font-bold transition-all shadow-2xs ml-auto disabled:opacity-50"
                  >
                    {uploadingVideo ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="h-3.5 w-3.5" />
                    )}
                    {uploadingVideo ? "Replacing..." : "Replace Video"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center flex flex-col items-center justify-center bg-slate-50/50 hover:bg-slate-50 transition-colors">
                <Video className="h-8 w-8 text-slate-400 mb-2" />
                <p className="text-xs text-slate-600 font-medium mb-3">No video resume uploaded yet</p>
                <button
                  disabled={uploadingVideo}
                  onClick={() => videoInputRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-all shadow-xs disabled:opacity-50"
                >
                  {uploadingVideo ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                  {uploadingVideo ? "Uploading..." : "Upload Video Resume"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
