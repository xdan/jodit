FROM node:20

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.48.0-jammy

# Set the working directory
WORKDIR /app

# Install dependencies
RUN npm install playwright @playwright/test jodit mime-types
