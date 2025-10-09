export default function sanitizeFilename(s, fallback = 'project') {
  if (!s) return fallback;
  return s.replace(/[^a-z0-9\-_. ]/gi, '').replace(/\s+/g, '_');
}
