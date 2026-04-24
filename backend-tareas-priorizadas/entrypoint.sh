#!/bin/bash
set -e

echo "Esperando a PostgreSQL..."
while ! python -c "
import socket, sys
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.settimeout(2)
result = s.connect_ex(('$DB_HOST', $DB_PORT))
s.close()
sys.exit(0 if result == 0 else 1)
" 2>/dev/null; do
  echo "PostgreSQL no disponible, reintentando..."
  sleep 2
done

echo "PostgreSQL listo! Ejecutando migraciones..."
alembic upgrade head

echo "Migraciones completadas. Levantando API..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000