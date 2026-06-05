FROM mcr.microsoft.com/playwright:v1.60.0-jammy

# Set the working directory
WORKDIR /app


# Install dependencies
# Pin Playwright to the same version as the base image so the bundled browser
# binaries always match (an unpinned install silently jumps to the latest
# release and breaks against the older image).
RUN npm install playwright@1.60.0 @playwright/test@1.60.0 jodit mime-types

RUN mkdir -p /app/ajax/libs/js-beautify/1.14.4/
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify.min.js
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify-html.min.js