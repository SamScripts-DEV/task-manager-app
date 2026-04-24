# Gestor de Tareas Priorizadas

Este es un proyecto Fullstack para la gestión de tareas priorizadas. Cuenta con una API desarrollada en **Python (FastAPI)**, un frontend construido con **Angular/Ionic**, y una base de datos **PostgreSQL**. Cuenta también con **pgAdmin** para administrar la base de datos visualmente.

A continuación, encontrarás todas las instrucciones necesarias para desplegar este proyecto, ya sea todo junto usando Docker Compose o cada servicio por separado.

---

## 📸 Vistazo a la Aplicación



<img width="235" height="479" alt="image" src="https://github.com/user-attachments/assets/a4090442-337a-49a7-be60-9a1675116c08" />

*Visualizador de tareas pendientes*

<img width="543" height="590" alt="image" src="https://github.com/user-attachments/assets/6ea1c423-4408-411e-bb9a-db44774d70bf" />

*Inicio de sesión.*

<img width="267" height="477" alt="image" src="https://github.com/user-attachments/assets/cd540a9e-3204-4ebb-bfe6-150c4245b4c0" />

*Si no tiene un usuario, puede registrarse*


---

## 🛠 Requisitos Previos

- [Docker](https://www.docker.com/products/docker-desktop) y [Docker Compose](https://docs.docker.com/compose/install/) (Recomendado para el despliegue automático).
- [Git](https://git-scm.com/).
- [Python 3.11+](https://www.python.org/downloads/) (Solo si deseas correr el backend por separado).
- [Node.js 18+](https://nodejs.org/) (Solo si deseas correr el frontend por separado).

---

## 🚀 Despliegue Rápido (Todo en uno con Docker Compose)

Esta es la forma más fácil y recomendada para levantar el entorno completo.

### 1. Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/gestor-de-tareas.git

cd gestor-de-tareas
```

### 2. Configurar Variables de Entorno
Copiar el archivo de ejemplo para crear tu propio archivo `.env` en la **raíz del proyecto**:
```bash
# En Windows (PowerShell):
Copy-Item .env.example -Destination .env

# En Linux/Mac:
cp .env.example .env
```
Abre el archivo `.env` raíz y modifica las contraseñas, usuarios o secretos si lo ves necesario. Estos valores configurarán tanto la base de datos como el backend y pgAdmin.

### 3. Levantar los Servicios
```bash
docker-compose up -d --build
```
*El parámetro `-d` levanta los contenedores en segundo plano. El parámetro `--build` garantiza que se creen las imágenes con tus últimos cambios.*

### ¿Cómo sé que está funcionando?
Una vez que el comando haya terminado, puedes verificar los siguientes servicios:
- **Frontend (Web App):** Accede a [http://localhost](http://localhost)
- **Backend (API Docs):** Accede a [http://localhost:8000/docs](http://localhost:8000/docs) (Aquí verás Swagger UI con todos tus endpoints).
- **Verificación de Salud (Healthcheck):** Accede a [http://localhost:8000/health](http://localhost:8000/health).
- **pgAdmin (Gestor DB):** Accede a [http://localhost:5055](http://localhost:5055). Usa los credenciales `PGADMIN_DEFAULT_EMAIL` y `PGADMIN_DEFAULT_PASSWORD` definidos en el `.env` para iniciar sesión.

---

## 💻 Ejecución por Separado (Para Desarrollo Local)

Si prefieres no usar Docker para el frontend o el backend y ejecutar el código fuente en tu máquina, sigue estos pasos:

### Levantar la Base de Datos solamente
Incluso sin querer usar Docker para la app, se recomienda usarlo para levantar la DB y pgAdmin:
```bash
docker-compose up -d db_task_manager pgadmin_task_manager
```

### Configuración del Backend (FastAPI)

1. Ve a la carpeta del backend:
   ```bash
   cd backend-tareas-priorizadas
   ```
2. Crea el archivo de variables de entorno propio del backend (tomándolo del example):
   ```bash
   Copy-Item .env.example -Destination .env  # O cp .env.example .env
   ```
   *Nota: En este `.env` local, la `DATABASE_URL` debe apuntar a `localhost:5434` (el puerto expuesto en el docker-compose).*
3. Crea y activa tu entorno virtual:
   ```bash
   python -m venv .venv
   # Windows:
   .venv\Scripts\activate
   # Linux/Mac:
   source .venv/bin/activate
   ```
4. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```
5. Ejecuta las migraciones de la DB (si aplica) y levanta el servidor:
   ```bash
   alembic upgrade head
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

### Configuración del Frontend (Angular/Ionic)

1. Ve a la carpeta del frontend:
   ```bash
   cd frontend-tareas-priorizadas
   ```
2. Instala las dependencias de Node:
   ```bash
   npm install
   ```
3. Levanta el servidor de desarrollo:
   ```bash
   npm start
   # O si usas ionic CLI: ionic serve
   ```
*Nota: Para desarrollo local, Angular utilizará el archivo `src/environments/environment.ts` (en lugar del `environment.prod.ts` que se usa en Docker). Asegúrate de que la API URL apunte a tu backend en `http://localhost:8000`.*

---

## ⚠️ Cosas a tomar en cuenta

- **Puertos:**
  - El Backend se expone siempre en el `:8000`.
  - El Frontend con Docker se expone en el puerto `:80` (HTTP estándar).
  - La base de datos dentro de Docker corre en el `5432`, pero está mapeada externamente al `5434` en tu computadora para evitar conflictos si ya tienes un PostgreSQL instalado.
  - pgAdmin se expone en el `:5055`.
- **Base de Datos persistente:** Los datos de PostgreSQL se guardan en la carpeta temporal `postgres_data` adjunta al proyecto. Si borras esta carpeta, **perderás todos los datos** y tu DB volverá a estado de fábrica.
- **Redes Internas en Docker:** El Backend se conecta a la base de datos usando la URL de red de los contenedores (`db_task_manager:5432`), pero el Frontend se conecta al Backend a través de tu localhost (`http://localhost:8000`) porque el frontend siempre corre en el navegador del usuario y asume tu máquina anfitriona como el origen.
- **Environment de Producción del Frontend:** Si el día de mañana despliegas este sistema en un servidor web real, debes modificar el `apiUrl` de `frontend-tareas-priorizadas/src/environments/environment.prod.ts` por el dominio público donde se alojará tu backend.

---

¡Listo para empezar a gestionar tus tareas!
