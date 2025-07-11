#!/bin/sh

# Exit on any error
set -e

echo "Starting CodePal Backend Service..."

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Generate Prisma client (in case it's not already generated)
echo "Generating Prisma client..."
npx prisma generate

# Seed database if needed (only in development)
if [ "$NODE_ENV" = "development" ]; then
  echo "Seeding database..."
  npx prisma db seed
fi

# Start the application
echo "Starting application..."
exec node dist/main.js
