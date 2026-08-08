/**
 * Shared utility for secure file upload validation including magic bytes verification
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Map of allowed extensions and their respective signatures (magic bytes)
const SIGNATURES: Record<string, { mimeTypes: string[]; magic: (buf: Buffer) => boolean }> = {
  ".pdf": {
    mimeTypes: ["application/pdf"],
    magic: (buf: Buffer) => buf.length >= 4 && buf.toString("hex", 0, 4) === "25504446", // %PDF
  },
  ".png": {
    mimeTypes: ["image/png"],
    magic: (buf: Buffer) => buf.length >= 8 && buf.toString("hex", 0, 8) === "89504e470d0a1a0a",
  },
  ".jpg": {
    mimeTypes: ["image/jpeg", "image/pjpeg"],
    magic: (buf: Buffer) => buf.length >= 3 && buf.toString("hex", 0, 3) === "ffd8ff",
  },
  ".jpeg": {
    mimeTypes: ["image/jpeg", "image/pjpeg"],
    magic: (buf: Buffer) => buf.length >= 3 && buf.toString("hex", 0, 3) === "ffd8ff",
  },
  ".gif": {
    mimeTypes: ["image/gif"],
    magic: (buf: Buffer) => buf.length >= 6 && (buf.toString("ascii", 0, 6).startsWith("GIF87a") || buf.toString("ascii", 0, 6).startsWith("GIF89a")),
  },
  ".doc": {
    mimeTypes: ["application/msword"],
    magic: (buf: Buffer) => buf.length >= 8 && buf.toString("hex", 0, 8) === "d0cf11e0a1b11ae1",
  },
  ".docx": {
    mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    magic: (buf: Buffer) => buf.length >= 4 && buf.toString("hex", 0, 4) === "504b0304", // PK.. (ZIP container)
  },
  ".mp4": {
    mimeTypes: ["video/mp4"],
    magic: (buf: Buffer) => buf.length >= 8 && buf.toString("hex", 4, 8) === "66747970", // ftyp
  },
  ".mov": {
    mimeTypes: ["video/quicktime"],
    magic: (buf: Buffer) => buf.length >= 8 && (buf.toString("hex", 4, 8) === "66747970" || buf.toString("hex", 4, 8) === "6d6f6f76"), // ftyp or moov
  },
  ".webm": {
    mimeTypes: ["video/webm"],
    magic: (buf: Buffer) => buf.length >= 4 && buf.toString("hex", 0, 4) === "1a45dfa3", // EBML
  },
};

export function validateFileContent(
  buffer: Buffer,
  fileName: string,
  declaredMimeType?: string,
  allowedExtensions?: string[],
  maxSize?: number
): ValidationResult {
  // 1. Check size limit
  if (maxSize && buffer.length > maxSize) {
    return {
      isValid: false,
      error: `File size exceeds the limit of ${(maxSize / (1024 * 1024)).toFixed(1)} MB.`,
    };
  }

  // 2. Extract and check extension
  const ext = fileName.substring(fileName.lastIndexOf(".")).toLowerCase();
  if (!ext || ext === fileName) {
    return {
      isValid: false,
      error: "File has no valid extension.",
    };
  }

  if (allowedExtensions && !allowedExtensions.map(e => e.toLowerCase()).includes(ext)) {
    return {
      isValid: false,
      error: `File extension ${ext} is not allowed.`,
    };
  }

  const spec = SIGNATURES[ext];
  if (!spec) {
    return {
      isValid: false,
      error: `File extension ${ext} is not supported.`,
    };
  }

  // 3. Verify MIME type match if provided (and not octet-stream generic)
  if (declaredMimeType && declaredMimeType !== "application/octet-stream" && declaredMimeType !== "") {
    if (!spec.mimeTypes.includes(declaredMimeType.toLowerCase())) {
      return {
        isValid: false,
        error: `MIME type mismatch: extension ${ext} does not match declared MIME type ${declaredMimeType}.`,
      };
    }
  }

  // 4. Magic bytes verification (Content Signature Scan)
  if (!spec.magic(buffer)) {
    return {
      isValid: false,
      error: `Content signature validation failed: The file contents do not match a valid ${ext.substring(1).toUpperCase()} file format.`,
    };
  }

  // 5. Malware scanning (Future integration hook placeholder as requested by user audit rules)
  // In a future phase, a scanner like ClamAV or VirusTotal API can be integrated here.
  // console.log("[Security Scan] Malware scanner status: OK (deferred/passive)");

  return { isValid: true };
}
