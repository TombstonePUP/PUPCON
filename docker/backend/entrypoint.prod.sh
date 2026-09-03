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
# echo "Linking storage..."
# php artisan storage:link || true

# Run Laravel migrations
# -----------------------------------------------------------
# Ensure the database schema is up to date.
# -----------------------------------------------------------
php artisan migrate --force

# Seed the database on first deployment
# -----------------------------------------------------------
# Only seed when the `roles` table is empty. This guards against
# re-seeding (and duplicating) data on every container restart, while
# ensuring a fresh database gets its initial/required records.
# -----------------------------------------------------------
roles_count=$(php artisan tinker --execute="echo \App\Models\Roles::count();")
if [ "$roles_count" = "0" ] || [ -z "$roles_count" ]; then
  echo "Database is empty; seeding initial data..."
  php artisan db:seed --force
else
  echo "Database already has data; skipping seed."
fi

# Clear and cache configurations
# -----------------------------------------------------------
# Improves performance by caching config and routes.
# -----------------------------------------------------------
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Run the default command
exec "$@"
