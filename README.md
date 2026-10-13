# Mawonga Training

A responsive rebuild of the Mawonga Training website, using the supplied website content and real workshop photographs. Blue, warm white and orange styling with clinical line illustrations, workshop field notes, programme discovery and a searchable course prospectus.

## Run locally

Requires Node.js 20 or later. No package installation is needed.

```powershell
git pull origin main
npm run dev
```

Open **http://localhost:3000**. This preview resolves the clean page URLs and redirects legacy URLs; VS Code Live Server does not provide these routes.

## Edit and build

- `scripts/build.mjs`: page content, shared navigation, footer, metadata and schema.
- `content/courses.json`: the 15 existing prospectus courses, modules, activities, durations and indicative fees.
- `content/privacy.html`: preserved privacy, terms and professional disclaimer copy.
- `assets/site.css`: responsive design, focus styles and reduced-motion support.
- `assets/site.js`: mobile menu, keyboard-accessible programme selector, prospectus search/filter/reset, scroll reveals and motion controls.
- `assets/workshop-*.webp`: optimised copies of the three supplied workshop photos. Original images remain in `images/`.

```powershell
npm run build
npm run check
npm test
```

The build writes HTML files, `sitemap.xml` and `robots.txt` to the repository root. Edit source files and rebuild rather than editing generated pages directly. Course information remains available without JavaScript; interactive filtering is a progressive enhancement.

## Pages and hosting

Home, about, clinical training, biomedical ethics, medical entrepreneurship, prospectus, partners, contact and privacy pages are rebuilt. The misspelled `/medical-entreprenuership/` route and `/about-us/` are retained as redirects to their canonical routes.

`.htaccess` supplies Apache clean URLs and permanent redirects. Apache must enable `mod_rewrite` and allow this configuration. Other hosts require equivalent routing; a bare static upload without routing will not resolve the clean URLs. Production Apache behaviour still needs verification on the actual host.

Contact actions open the existing telephone, email and WhatsApp channels. No contact submission backend, payment flow or learner portal is introduced. The supplied `api.php` remains unchanged and is not executed or exposed as source by the Node preview. Its runtime and mail behaviour have not been verified.

This repository change does not deploy the live domain. It also does not submit a sitemap to Search Console.

## SEO and verification

See `docs/seo-implementation.md` for the supplied SEO guide review and implementation decisions. Automated checks cover page links and fragments, asset existence, metadata, JSON-LD, course count and sitemap coverage. Tests cover route handling, legacy redirects, images, restricted runtime files and browser interaction logic.

Automated checks and 12 tests pass. A browser visual review on desktop and mobile is still required; browser automation was unavailable in this session. Typography uses Google Fonts with local system fallbacks.

## Creative direction and motion

The homepage follows purpose → programmes → courses by goal → learning in practice → facilitators → partners → enquiry. Clinical care, ethical judgement and practice growth each have a custom SVG illustration. A pulse line in the workshop photograph and a connected learning path relate the motion to the training content.

Programme changes use a short entrance transition. Section reveals run once as content enters the viewport, and supported browsers fade between pages using native view transitions. Navigation is ordinary links; unsupported browsers use normal page loads. Mobile layouts stack programme buttons with full labels and at least 44px targets, and turn the learning path vertical.

The footer provides a Pause motion / Enable motion control. Reduced-motion preferences disable animation and smooth scrolling automatically; settings can be overridden for the current page. Content remains available when JavaScript or IntersectionObserver is unavailable. No animation or UI dependency is required.
