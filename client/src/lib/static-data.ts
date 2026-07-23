/**
 * Static content paths for GitHub Pages (and local static builds).
 * Paths are rooted at Vite's BASE_URL (default `/` for root hosting).
 */

/** Pure helpers — take explicit base so unit tests drive the same code as production. */
export function resolveDataUrl(
  name: "profile" | "projects" | "services" | "features",
  base: string,
): string {
  const normalized = base.endsWith("/") ? base : `${base}/`;
  return `${normalized}data/${name}.json`;
}

export function resolveAssetUrl(
  path: string | undefined | null,
  base: string,
): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("data:")) return path;
  const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
  if (path.startsWith("/")) {
    return `${normalizedBase}${path}`;
  }
  return `${normalizedBase}/${path}`;
}

export function dataUrl(
  name: "profile" | "projects" | "services" | "features",
): string {
  return resolveDataUrl(name, import.meta.env.BASE_URL || "/");
}

/** Prefix site-relative asset paths (e.g. /uploads/...) with the Vite base. */
export function assetUrl(path: string | undefined | null): string {
  return resolveAssetUrl(path, import.meta.env.BASE_URL || "/");
}
