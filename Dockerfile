FROM php:8.3-fpm

RUN apt-get update && apt-get install -y \
  git curl zip unzip libpq-dev libzip-dev libpng-dev libjpeg-dev

RUN docker-php-ext-install pdo pdo_pgsql zip gd opcache


COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader --ignore-platform-reqs

COPY . .
RUN composer dump-autoload --optimize

# Fix permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache \
  && chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache