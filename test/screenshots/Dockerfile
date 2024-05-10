FROM node:18

# Get the latest version of Playwright
FROM mcr.microsoft.com/playwright:v1.44.0-jammy

# Set the working directory
WORKDIR /app

# Install dependencies
RUN npm install playwright @playwright/test jodit mime-types
