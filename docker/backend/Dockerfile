FROM php:8.4-cli AS base
WORKDIR /var/www
RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev \
    libpq-dev libicu-dev \
    && docker-php-ext-install \
    pdo pdo_pgsql pgsql zip intl bcmath \
    && rm -rf /var/lib/apt/lists/*
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
COPY docker/backend/php.ini /usr/local/etc/php/conf.d/custom.ini

FROM base AS development
COPY composer.json composer.lock ./
RUN composer install \
    --no-scripts \
    --prefer-dist \
    --no-interaction
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=8000"]

FROM base AS vendor
WORKDIR /var/www
COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --prefer-dist \
    --no-interaction \
    --no-progress \
    --optimize-autoloader \
    --no-scripts
COPY . .
RUN composer dump-autoload --optimize

FROM php:8.4-fpm AS production
WORKDIR /var/www
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl libpq-dev libzip-dev libicu-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql zip intl bcmath opcache \
    && apt-get clean \
    && rm -rf /var/lib/apt/lists/*
COPY --from=vendor --chown=www-data:www-data /var/www /var/www
COPY docker/backend/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache
USER www-data
EXPOSE 9000
CMD ["php-fpm"]
