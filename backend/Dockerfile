FROM php:8.3-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    linux-headers \
    libpng-dev \
    libxml2-dev \
    zip \
    unzip \
    git \
    curl \
    libpq-dev \
    oniguruma-dev \
    libzip-dev \
    icu-dev

# Install PHP extensions
RUN docker-php-ext-install pdo_pgsql mbstring exif pcntl bcmath gd zip intl

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy existing application directory contents
COPY . /var/www

# Argument to control dev dependencies
ARG INSTALL_DEV=false

# Install dependencies
RUN if [ "$INSTALL_DEV" = "true" ] ; then \
    composer install --optimize-autoloader ; \
    else \
    composer install --no-dev --optimize-autoloader ; \
    fi

# Set permissions
RUN chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000
CMD ["php-fpm"]
