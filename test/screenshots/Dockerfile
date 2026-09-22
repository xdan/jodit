FROM mcr.microsoft.com/playwright:v1.63.0-jammy

# Set the working directory
WORKDIR /app


# Install dependencies
# Pin Playwright to the same version as the base image so the bundled browser
# binaries always match (an unpinned install silently jumps to the latest
# release and breaks against the older image).
#
# Do NOT add `jodit` here. The editor under test is served from the mounted
# ./build directory (see test/screenshots/index.html), nothing in the harness
# imports the package, and installing it made every release depend on npm
# having finished processing the *previous* one: right after a publish the
# registry answers 404 for the new tarball for several minutes, the image
# build failed, and the release was blocked by its own predecessor.
RUN npm install playwright@1.63.0 @playwright/test@1.63.0 mime-types

RUN mkdir -p /app/ajax/libs/js-beautify/1.14.4/
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify.min.js
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify-html.min.js
