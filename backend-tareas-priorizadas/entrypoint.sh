#!/bin/bash
set -e

echo "Esperando a PostgreSQL..."
while ! nc -z $DB_HOST $DB_PORT; do
  sleep 1
done

echo "PostgreSQL listo! Ejecutando migraciones..."
cd /app
alembic upgrade head

echo "Migraciones completadas. Levantando API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000