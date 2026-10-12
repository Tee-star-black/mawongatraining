# Mawonga Training

Existing website source imported from the supplied `mawongaaaa.zip` as the baseline for the website reconstruction.

## Source files

All 14 supplied files are preserved byte-for-byte. Download suffixes such as ` (19)` were removed from filenames; the wrapping ZIP folder was removed so `index.html` is at the repository root. Both `about.html` and `about-us.html` are retained because they are different source pages.

## Open in VS Code

```powershell
git clone https://github.com/Tee-star-black/mawongatraining.git
cd mawongatraining
code .
```

## Add the remaining images

Copy the original images folder into `images/` at the repository root, alongside `index.html`. Preserve filenames and case, including spaces, because the existing pages reference those exact paths.

```powershell
git add images
git commit -m "Add original website images"
git push origin main
```

## Current limitations

This is an import of the existing site, before the redesign. There is no Node project or `npm` script yet. VS Code Live Server can preview the homepage; links using clean paths such as `/clinical-training/` require server routing to the corresponding HTML files. The original hosting rewrite configuration was not included in the ZIP. The PHP endpoint requires a PHP server and its original runtime dependencies/configuration; importing it does not verify that submissions work.

Images have not yet been supplied. No production deployment is performed by this import.
