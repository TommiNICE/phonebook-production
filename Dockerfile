# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20.11.1
FROM node:${NODE_VERSION}-slim as base

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"

# Install cron in the base image
RUN apt-get update && apt-get install -y --no-install-recommends cron && rm -rf /var/lib/apt/lists/*

# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3

# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY --link . .

# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Copy the database seed script into the final image
COPY databaseCleanUp.js /app/database.js

# Set up the cron job
# This example runs the script every day at midnight; adjust the schedule as needed
RUN echo "*/5 * * * * node /app/database.js >> /var/log/cron.log 2>&1" > /etc/cron.d/database_schedule

# Give execution rights on the cron job and apply it
RUN chmod 0644 /etc/cron.d/database_schedule && crontab /etc/cron.d/database_schedule

# Start cron and the main application
EXPOSE 3000
CMD cron && npm run start