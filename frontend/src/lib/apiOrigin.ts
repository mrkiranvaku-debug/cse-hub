// Uploaded files (resource files, thumbnails, banner images) are served by the
// Spring Boot backend at /uploads/**, not by the Vite dev server. Any relative
// "/uploads/..." path returned by the API needs to be resolved against the
// backend's origin (e.g. http://localhost:8080), not the frontend's.

const API_BASE = import.meta.env.VITE_API_URL || "";
const API_ORIGIN = API_BASE.replace(/\/api\/?$/, "");

/** Resolves a possibly-relative "/uploads/..." path to an absolute backend URL. Leaves absolute URLs untouched. */
export function resolveFileUrl(path?: string | null): string | undefined {
  if (!path) return undefined;
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith("/") ? "" : "/"}${path}`;
}

export function formatFileSize(bytes?: number | null): string {
  if (bytes === undefined || bytes === null) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
