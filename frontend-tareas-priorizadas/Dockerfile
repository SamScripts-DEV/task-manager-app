# Etapa 1: Construcción (Build)
FROM node:18-alpine AS build
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos dependencias limpias (npm ci es más rápido y seguro que npm install)
RUN npm ci

# Copiamos el resto del código fuente
COPY . .

# Ejecutamos el build de producción mapeando al entorno adecuado
RUN npm run build -- --configuration production

# Etapa 2: Servidor Web Ligero (Nginx)
FROM nginx:alpine

# Limpiamos el contenido por defecto de Nginx
RUN rm -rf /usr/share/nginx/html/*

# Copiamos los archivos generados en la Etapa 1 (Angular 17+ los deja en "www" por defecto para Ionic)
COPY --from=build /app/www /usr/share/nginx/html

# Copiamos nuestra configuración personalizada de Nginx para el ruteo de la SPA (Single Page Application)
COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

# Exponemos el puerto 80 del contenedor
EXPOSE 80

# Comando para iniciar Nginx
CMD ["nginx", "-g", "daemon off;"]
