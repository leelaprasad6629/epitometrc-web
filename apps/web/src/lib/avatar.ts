export function getAvatarColor(name: string = "") {
  const colors = [
    "#f97316", // Orange
    "#3b82f6", // Blue
    "#10b981", // Emerald
    "#6366f1", // Indigo
    "#8b5cf6", // Violet
    "#ec4899", // Pink
    "#06b6d4", // Cyan
  ];
  let hash = 0;
  const cleanName = name || "User";
  for (let i = 0; i < cleanName.length; i++) {
    hash = cleanName.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

export function getInitials(name: string = "") {
  const cleanName = (name || "User").trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length === 1) {
    return parts[0].substring(0, 2).toUpperCase();
  }
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function getInitialsAvatarDataUrl(name: string) {
  const initials = getInitials(name);
  const color = getAvatarColor(name);
  
  // Clean SVG string
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><rect width="100%" height="100%" fill="${color}"/><text x="50%" y="54%" font-size="38" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="bold" fill="#ffffff" dominant-baseline="middle" text-anchor="middle">${initials}</text></svg>`;
  
  const base64Svg = typeof window !== 'undefined'
    ? window.btoa(unescape(encodeURIComponent(svg)))
    : Buffer.from(svg).toString("base64");
    
  return `data:image/svg+xml;base64,${base64Svg}`;
}

export function getAvatarUrl(name: string, profileImage?: string | null) {
  if (profileImage && !profileImage.includes("unsplash.com") && profileImage.trim() !== "") {
    return profileImage;
  }
  return getInitialsAvatarDataUrl(name);
}

export function compressAndCropImage(file: File, maxWidth: number = 300, maxHeight: number = 300): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("File must be an image."));
      return;
    }
    const maxSizeBytes = 5 * 1024 * 1024; // 5MB limit
    if (file.size > maxSizeBytes) {
      reject(new Error("Image size must be less than 5MB."));
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to get canvas context."));
          return;
        }

        const size = Math.min(img.width, img.height);
        const sourceX = (img.width - size) / 2;
        const sourceY = (img.height - size) / 2;

        canvas.width = maxWidth;
        canvas.height = maxHeight;

        ctx.drawImage(
          img,
          sourceX,
          sourceY,
          size,
          size,
          0,
          0,
          maxWidth,
          maxHeight
        );

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.75);
        resolve(compressedBase64);
      };
      img.onerror = () => {
        reject(new Error("Failed to load image element."));
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      reject(new Error("Failed to read file."));
    };
    reader.readAsDataURL(file);
  });
}
