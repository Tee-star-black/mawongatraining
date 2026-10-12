# SEO guide implementation

The supplied Mawonga Training SEO implementation document is written for WordPress, Gutenberg and Yoast or Rank Math. The supplied repository is HTML/PHP and contains none of that CMS infrastructure. Its content recommendations have therefore been translated into generated HTML rather than adding WordPress plugins.

## Implemented

- Unique page titles and descriptions, with automatic checks against the guide's 60/155 character targets. Several suggested titles were shortened because the source strings exceed those targets. These are editorial targets, not guarantees about how a search engine displays snippets.
- One H1 per content page and a consistent H2/H3 hierarchy.
- Course keywords in metadata and page copy, with dedicated programme pages.
- Medical aid claims, ICD-10 coding, submission deadlines and cash flow content on the medical entrepreneurship page. Copy describes training topics rather than guaranteeing fewer rejected claims.
- Revised contact copy based on the guide, using the existing office, telephone, email and WhatsApp details.
- Descriptive alt text for actual workshop photographs. The guide's flowchart alt text was not applied to photographs or nonexistent assets.
- EducationalOrganization and WebSite schema, page-specific WebPage data, breadcrumbs and Course schema on the three programme pages. The guide's single course schema is not injected site-wide.
- Consistent canonical URLs, including the correctly spelled medical entrepreneurship path and redirects from the legacy misspelling.
- Open Graph metadata, social preview imagery, favicon, robots file and sitemap.

## Information to confirm

The guide calls biomedical ethics training accredited. The supplied materials do not identify an accrediting body, registration number or approved programme, so this claim has not been published. Course prices and durations are carried over from the supplied prospectus; the catalogue tells visitors to confirm current fees and availability. Training dates, CPD points, certification promises and testimonials have not been invented.

Real workshop photos were preferred over the supplied illustrative training graphics. The five missing legacy image references were removed from rebuilt pages rather than replaced with unrelated images.

## Remaining operational steps

1. Review the design on desktop and mobile, particularly menu, programme selection and prospectus search.
2. Confirm course information, office hours and any accreditation evidence with Mawonga.
3. Test redirects and clean URLs on the selected production host. The Apache configuration has not yet been executed on that host.
4. Deploy to the live domain when ready.
5. Submit `https://mawongatraining.co.za/sitemap.xml` through the business's verified Google Search Console property after deployment. Submission has not been performed in this task.

SEO implementation does not guarantee rankings or a particular rich-result display.
