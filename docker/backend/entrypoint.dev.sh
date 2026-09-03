#!/usr/bin/env sh
set -e

cd /var/www

echo "Starting Laravel development container..."

if [ -z "$APP_KEY" ]; then
  php artisan key:generate --force
fi

php artisan storage:link || true
php artisan migrate:fresh --seed || true
php artisan optimize:clear || true

exec "$@"
