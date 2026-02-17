/**
 * Returns the correct asset path considering the basePath in production.
 * Use this for all static assets in /public folder.
 */
export function assetPath(path: string): string {
  const basePath = process.env.NODE_ENV === 'production' ? '/reservations' : '';
  // Ensure path starts with /
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${basePath}${normalizedPath}`;
}
