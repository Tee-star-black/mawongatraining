export const pages = {
  '/': 'index.html', '/about/': 'about.html', '/clinical-training/': 'clinical-training.html',
  '/biomedical-ethics/': 'biomedical-ethics.html', '/medical-entrepreneurship/': 'medical-entreprenuership.html',
  '/course-prospectus/': 'course-prospectus.html', '/partners/': 'partners.html',
  '/contact-us/': 'contact-us.html', '/privacy-policy/': 'privacy-policy.html'
};
export const aliases = {
  '/index.html': '/', '/about.html': '/about/', '/about-us.html': '/about/', '/about-us/': '/about/',
  '/clinical-training.html': '/clinical-training/', '/biomedical-ethics.html': '/biomedical-ethics/',
  '/medical-entreprenuership.html': '/medical-entrepreneurship/', '/medical-entrepreneurship.html': '/medical-entrepreneurship/',
  '/medical-entreprenuership/': '/medical-entrepreneurship/', '/course-prospectus.html': '/course-prospectus/',
  '/partners.html': '/partners/', '/contact-us.html': '/contact-us/', '/privacy-policy.html': '/privacy-policy/'
};
export function route(pathname) {
  let path;
  try { path = decodeURIComponent(pathname); } catch { return null; }
  if (path.includes('\\') || path.includes('\0') || path.split('/').includes('..')) return null;
  if (aliases[path]) return { redirect: aliases[path] };
  if (pages[path]) return { file: pages[path] };
  if (!path.endsWith('/') && (pages[path + '/'] || aliases[path + '/'])) return { redirect: aliases[path + '/'] || path + '/' };
  if (/^\/images\/mawonga-courses\/(?:clinical-training|biomedical-practice|medical-entrepreneurship)\.webp$/.test(path)) return { file: path.slice(1) };
  if (/^\/(?:assets|images)\/[a-zA-Z0-9 _().&-]+\.(?:webp|png|jpe?g|svg|css|js)$/i.test(path)) return { file: path.slice(1) };
  if (['/robots.txt','/sitemap.xml','/google736522bf4b7fa0e6.html'].includes(path)) return { file: path.slice(1) };
  return null;
}
