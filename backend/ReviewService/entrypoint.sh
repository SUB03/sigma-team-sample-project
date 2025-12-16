#!/bin/bash

# Выход при ошибке
set -e

echo "Waiting for PostgreSQL..."
while ! pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER > /dev/null 2>&1; do
  sleep 1
done
echo "PostgreSQL started"

echo "Running migrations..."
python manage.py makemigrations
python manage.py migrate

echo "Creating superuser..."
python manage.py shell << END
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', 'admin123')
    print('Superuser created')
else:
    print('Superuser already exists')
END

echo "Loading initial reviews..."
python manage.py loaddata review/fixtures/initial_reviews.json || echo "Reviews already loaded or error occurred"

echo "Collecting static files..."
python manage.py collectstatic --noinput

echo "Starting server..."
python manage.py runserver 0.0.0.0:8004
