FROM php:8.2-cli

# Install system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    git \
    unzip \
    libsqlite3-dev \
    && docker-php-ext-install pdo pdo_sqlite

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy application files
COPY . .

# Copy environment example to .env
RUN cp .env.example .env

# Install php dependencies
RUN composer install --no-interaction --no-plugins --no-scripts

# Create SQLite database
RUN mkdir -p database && touch database/database.sqlite

# Generate Laravel application key
RUN php artisan key:generate

# Expose port
EXPOSE 10000

# Run migrations
RUN php artisan migrate --force

# Start Laravel serve
CMD ["php", "artisan", "serve", "--host=0.0.0.0", "--port=10000"]
