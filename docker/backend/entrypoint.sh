#!/usr/bin/env bash
set -e

# Initialize storage directory if empty
# -----------------------------------------------------------
# If the storage directory is empty, copy the initial contents
# and set the correct permissions.
# -----------------------------------------------------------
if [ ! "$(ls -A /var/www/storage)" ]; then
  echo "Initializing storage directory..."
  cp -R /var/www/storage-init/. /var/www/storage
  chown -R www-data:www-data /var/www/storage
fi

# Remove storage-init directory
rm -rf /var/www/storage-init

# -----------------------------------------------------------
# Generate APP KEY if missing
# -----------------------------------------------------------
if ! php artisan key:generate --show | grep -q "base64"; then
  echo "Generating APP_KEY..."
  php artisan key:generate --force
fi

# -----------------------------------------------------------
# Create storage symlink
# -----------------------------------------------------------
echo "Linking storage..."
php artisan storage:link || true

# Run Laravel migrations
# -----------------------------------------------------------
# Ensure the database schema is up to date.
# -----------------------------------------------------------
php artisan migrate --force

# Clear and cache configurations
# -----------------------------------------------------------
# Improves performance by caching config and routes.
# -----------------------------------------------------------
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run the default command
exec "$@"
