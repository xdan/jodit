FROM mcr.microsoft.com/playwright:v1.56.1-jammy

# Set the working directory
WORKDIR /app


# Install dependencies
RUN npm install playwright @playwright/test jodit mime-types

RUN mkdir -p /app/ajax/libs/js-beautify/1.14.4/
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify.min.js
RUN touch /app/ajax/libs/js-beautify/1.14.4/beautify-html.min.js