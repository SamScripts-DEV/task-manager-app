# 📌 Gestor de Tareas Priorizadas (Backend API)

API REST moderna y escalable desarrollada con **FastAPI** y **PostgreSQL** para la gestión de tareas. Su característica principal es un **sistema de prioridad automático** que califica y ordena las tareas basándose en su urgencia (fecha de vencimiento), importancia y esfuerzo requerido.

## ✨ Características (MVP)

- 🚀 **FastAPI**: Alto rendimiento, asíncrono y documentación automática (Swagger/OpenAPI).
- 🐘 **PostgreSQL + SQLAlchemy**: Base de datos robusta con ORM moderno (SQLAlchemy 2.0).
- 🔄 **Alembic**: Migraciones de base de datos versionadas.
- 🔐 **Autenticación JWT**: Seguridad robusta con contraseñas hasheadas (`argon2-cffi`).
- 🧠 **Algoritmo de Prioridad Inteligente**: Calcula un puntaje de prioridad (0-100) combinando fecha límite, importancia y estimación de esfuerzo.
- 🐳 **Docker-Ready**: Preparado para despliegue con `Dockerfile` y scripts de inicialización.

## 🛠️ Tecnologías Utilizadas

- **Python 3.11+**
- **FastAPI** (Web Framework)
- **PostgreSQL** (Base de Datos)
- **SQLAlchemy** (ORM)
- **Alembic** (Migraciones)
- **Pydantic V2** (Validación de Datos)
- **PyJWT & Argon2** (Autenticación)
- **Docker** (Contenedorización)

## 🗂️ Estructura del Proyecto

```text
backend-tareas-priorizadas/
├── app/
│   ├── routers/       # Endpoints (users, tasks)
│   ├── services/      # Lógica de negocio y base de datos (CRUD)
│   ├── auth.py        # Configuración JWT y hashing
│   ├── config.py      # Variables de entorno (Pydantic Settings)
│   ├── database.py    # Conexión DB y Session maker
│   ├── main.py        # Aplicación FastAPI
│   ├── models.py      # Modelos SQLAlchemy
│   ├── priority.py    # Algoritmo heurístico
│   └── schemas.py     # Modelos Pydantic (Validación)
├── migrations/        # Versiones de base de datos
├── config/            # Configuraciones adicionales (ej. db)
├── docker-compose.yml # Orquestación local 
├── Dockerfile         # Imagen API
├── entrypoint.sh      # Script de inicio (corre migraciones y uvicorn)
├── .env               # Variables de entorno
├── requirements.txt   # Dependencias de Python
└── .gitignore
```

## 🚀 Despliegue con Docker (Recomendado)

La forma más rápida de levantar el entorno completo (API + PostgreSQL).

1. **Clonar repositorio y preparar `.env`**
   Asegúrate de configurar correctamente tu archivo `.env` en la raíz (ej: `DATABASE_URL=postgresql://task_user:task_pass@db:5432/task_db`).

2. **Levantar los contenedores:**
   ```bash
   docker-compose up -d --build
   ```

La API estará disponible en `http://localhost:8000`.

## 💻 Desarrollo Local (Sin Docker)

### Requisitos previos
- Python 3.11+
- PostgreSQL instalado y corriendo localmente.

### Pasos:

1. **Crear y activar entorno virtual:**
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/Mac:
   source .venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar Base de Datos:**
   Crea el archivo `.env` con las credenciales de tu DB local:
   ```env
   DATABASE_URL=postgresql://tu_usuario:tu_password@localhost:5432/tu_db
   JWT_SECRET=tu_secreto_super_seguro
   JWT_ALGORITHM=HS256
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

4. **Ejecutar migraciones (Crear las tablas):**
   ```bash
   alembic upgrade head
   ```

5. **Levantar el servidor web:**
   ```bash
   uvicorn app.main:app --reload
   ```

## 📖 Documentación de la API (Swagger UI)

Una vez levantado el servidor, la documentación interactiva está disponible en:

👉 **[http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)**

### Flujo Básico de Uso:

1. **POST `/users/signup`**: Registra un nuevo usuario (requiere email y contraseña).
2. **POST `/users/login`**: Inicia sesión. Retorna un `access_token` JWT.
   *(En Swagger UI, usa el botón "Authorize" en la parte superior e ingresa este token).*
3. **POST `/tasks`**: Crea una nueva tarea (define `importance`, `effort`, y `due_date`).
4. **GET `/tasks`**: Lista tus tareas. El algoritmo `priority_score` las ordenará devolviendo las más urgentes primero.

## 🧠 Algoritmo de Prioridad (`app/priority.py`)

Las tareas reciben un puntaje de `0` a `100` basado en:
- **Urgencia:** Si el `due_date` es cercano (ej: vence hoy = mayor puntaje, vence en 2 semanas = menor puntaje).
- **Importancia (1-5):** Multiplicador directo (escala lineal).
- **Esfuerzo (1-5):** Prioridad inversamente proporcional al esfuerzo (tareas de esfuerzo `1` ganan más puntos para invitar a despachar "quick wins").