# Clinical photography

The site combines the original Mawonga workshop photographs with licensed clinical stock photographs. Stock models are not identified as Mawonga staff, attendees or partners. The images support clinical education, communication and professional collaboration.

| Asset family | Photographer | Source |
| --- | --- | --- |
| clinical-mentorship | RDNE Stock project | https://www.pexels.com/photo/medical-practitioners-having-a-discussion-6129589/ |
| clinical-team | RDNE Stock project | https://www.pexels.com/photo/medical-practitioners-having-a-discussion-6129646/ |
| patient-consultation | Antoni Shkraba | https://www.pexels.com/photo/woman-consulting-a-doctor-5215008/ |
| practice-team | Tima Miroshnichenko | https://www.pexels.com/photo/team-of-doctors-having-a-diagnostic-discussion-5452193/ |

Licence: https://www.pexels.com/license/ (reviewed 13 October 2026). Pexels permits free website use and modification; no endorsement by the pictured people is implied.

Each photograph is stored locally in 480px, 960px and 1920px WebP versions. Photos are resized and compressed; no generative edits were applied. Existing workshop photographs are retained as workshop-1.webp, workshop-2.webp and workshop-3.webp, with the supplied originals in images/.

## Supplied Mawonga artwork

The original images in images/ are now used on the appropriate pages. Resized WebP copies preserve the original composition:

| Supplied original | Optimised asset | Placement |
| --- | --- | --- |
| Clinical Training.png | mawonga-clinical.webp | Homepage, clinical programme and programme discovery |
| Bio-ethics.png | mawonga-ethics.webp | Ethics opening, programme discovery and outcomes |
| MawongaT.png | mawonga-brand.webp | About page brand signature |

The original mawonga logo.png remains the source of the existing shared logo.webp. IMAGE 1.jpeg, IMAGE 2.jpeg and IMAGE 3.jpeg remain visible as workshop-1.webp, workshop-2.webp and workshop-3.webp. The dummy placeholder is not published as page imagery. Supplied clinical and ethics artwork is described as illustration, rather than as a photograph of a Mawonga event.

Shared header/footer identity and favicon now use mawonga-primary-logo.webp, a 320px optimisation of the requested images/mawonga logo.png. The original is retained unchanged.

## Supplied MTImages prospectus set

The images uploaded to images/MTImages are used on the prospectus. Originals remain unchanged. Badges are displayed with object-fit: contain so that no part of the emblem is cropped; each appears in its matching directory tile and learning-stream header. Alt text is empty for repeated badges because the adjacent headings provide the same information.

| Original | Optimised asset | Learning stream |
| --- | --- | --- |
| nurseled.png | stream-practice.webp | Nurse-led practice |
| business and finance.png | stream-business.webp | Business & finance |
| marketing and outreach.png | stream-marketing.webp | Marketing & outreach |
| leadership.png | stream-leadership.webp | Leadership |
| digital health.png | stream-digital.webp | Digital health |
| quality and improvement.png | stream-me.webp | Quality improvement |
| prospectus.jpg | prospectus-learning-lab.webp | Main prospectus illustration |

Badges preserve their source dimensions and alpha channel, and load lazily. The main prospectus image is optimised to 1200px with priority loading. No generative image changes were applied.

## Transparent cutouts and stepped prospectus

Background extraction used the built-in image editing tool on the seven supplied MTImages files. Prompt set: remove only the gray/white backdrop and external floor shadow, preserve each complete emblem and its internal colours/details, retain opaque pale areas inside the emblem, and return genuine alpha transparency without redesign or added text. The original uploads and first optimised versions are unchanged.

Final project assets: assets/stream-practice-cutout.webp, stream-business-cutout.webp, stream-marketing-cutout.webp, stream-leadership-cutout.webp, stream-digital-cutout.webp, stream-me-cutout.webp and prospectus-shield-cutout.webp. The generated cutouts are resized and compressed as WebP while retaining alpha. The final assets are used by both navigation and the alternating step layout. The hero uses the prospectus cutout with CSS opacity and brightness over navy; no shading is baked into the asset.

## New homepage programme imagery

The supplied web-optimised images in images/mawonga-courses are connected directly to the homepage programme selector: clinical-training.webp → Clinical training; biomedical-practice.webp → Biomedical ethics; medical-entrepreneurship.webp → Medical entrepreneurship. The existing programme names are retained. Files are unchanged, loaded lazily and given their natural 1024 × 768 dimensions. Per-image focal positions keep their subjects visible in the panel crop. The preview server explicitly permits only these three nested image paths.
