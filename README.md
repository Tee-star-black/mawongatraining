# Mawonga Training

A responsive rebuild of the Mawonga Training website, using the supplied website content, real workshop photographs and licensed clinical photography. An identity drawn from the logo’s blue, slate and orange with expansive photographic heroes, layered workshop compositions, photographic programme panels and a searchable course prospectus.

## Run locally

Requires Node.js 20 or later. No package installation is needed.

```powershell
git switch feat/mawonga-creative-motion
git pull origin feat/mawonga-creative-motion
npm run dev
```

Open **http://localhost:3000**. This preview resolves the clean page URLs and redirects legacy URLs; VS Code Live Server does not provide these routes.

## Edit and build

- `scripts/build.mjs`: page content, shared navigation, footer, metadata and schema.
- `content/courses.json`: the 15 existing prospectus courses, modules, activities, durations and indicative fees.
- `content/privacy.html`: preserved privacy, terms and professional disclaimer copy.
- `assets/site.css`: responsive design, focus styles and reduced-motion support.
- `assets/site.js`: mobile menu, keyboard-accessible programme selector, prospectus search/filter/reset, scroll reveals and motion controls.
- `assets/*-480.webp`, `*-960.webp`, `*-1920.webp`: responsive clinical photography. Source credits and licence links are in `docs/photography.md`.
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

Automated checks and 18 tests pass. A browser visual review on desktop and mobile is still required; browser automation was unavailable in this session. Typography uses Google Fonts with local system fallbacks.

## Creative direction and motion

The homepage follows purpose → programmes → courses by goal → learning in practice → facilitators → partners → enquiry. Each programme combines relevant clinical photography with a small custom SVG illustration. A pulse annotation in the hero and a connected learning path relate motion to the training content. Clinical and workshop photographs have separate captions; stock models are not described as Mawonga staff or workshop attendees.

Programme changes use a short entrance transition. Section reveals run once as content enters the viewport, and supported browsers fade between pages using native view transitions. Navigation is ordinary links; unsupported browsers use normal page loads. Mobile layouts stack programme buttons with full labels and at least 44px targets, and use a vertical learning path. Clinical images use responsive 480px, 960px and 1920px WebP sources, with priority loading for the main hero and lazy loading for secondary photos.

The footer provides a Pause motion / Enable motion control. Reduced-motion preferences disable animation and smooth scrolling automatically; settings can be overridden for the current page. Content remains available when JavaScript or IntersectionObserver is unavailable. No animation or UI dependency is required.

## Page identity and grouped browsing

Typography uses upright Schibsted Grotesk throughout, with Arial as a fallback. Logo-derived blue, slate and orange share a consistent identity; darker orange is used for readable text. Page openings differ by purpose: clinical skills and image-led field notes; ethics principles and patient communication; entrepreneurship and operating priorities; workshop-led About; a role-based partner directory; practical Contact details; a quiet legal reference page.

The prospectus groups all 15 courses into six learning streams, each with a heading, explanation and course count. The directory links focus a category and scroll to its visible group. Search matches course descriptions, modules and activities; empty groups disappear, matching counts update, and reset restores all groups. No-JavaScript browsing retains all six groups and 15 course accordions. Fees that are not supplied as a rand amount are labelled Fee on enquiry instead of presenting the original module count as a price.

## Learning lab and homepage carousel

The requested mawonga logo.png is used as the shared header/footer logo, favicon and organisation logo through an optimised WebP copy. Page headings are centred. The prospectus uses a laboratory-inspired illustration, a fine measurement grid, six learning stations and a short orientation guide. Every course explains why it matters using the existing description, topics and activities. This is a visual metaphor for course discovery, not a claim about laboratory facilities or accreditation.

The homepage information carousel uses CSS perspective, subtle pointer tilt and scroll snapping. Arrow buttons, track arrow keys and native touch scrolling move between the four information cards. Card links remain ordinary navigable links, and all information is available without JavaScript. Motion pause/reduced-motion preferences disable tilt and smooth scrolling; there is no forced automatic rotation.

## Mobile review

Phone overrides explicitly stack the prospectus opening and ethics outcomes after the later desktop rules. Mobile form fields use 16px text, navigation can scroll within short/dynamic viewports, footer links have 44px touch targets, long headings can wrap, and very narrow footers stack vertically. Touch devices use native carousel scrolling without hover tilt; a debounced scroll handler keeps its position indicator current where scrollend is unavailable.

Automated behaviour, asset and content checks pass. Desktop/mobile visual browser review and real-device testing remain outstanding because browser automation is unavailable in this environment. The source checks do not establish that every rendered viewport is free of overflow.

## Contrast and partner cleanup

Solid deep-blue and burnt-orange section backgrounds now contrast with light course-reading surfaces. Programme icons use thicker 4.5px strokes, stronger accents and larger sizes. The partner network contains Dr Mukudu & Partners and TeleDoctor SA only; the removed partner’s entry, links, metadata and dedicated/composite artwork are no longer published. Regression checks cover both branding absence and the removed image routes.
