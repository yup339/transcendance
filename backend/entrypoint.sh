#!/bin/sh

echo "Waiting for PostgreSQL to be ready..."
while ! nc -z database 5432; do
  sleep 1
done
echo "PostgreSQL is ready!"

python manage.py migrate
python manage.py runserver 0.0.0.0:8000
