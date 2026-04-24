# Etapa 1: Construcción (Build)
FROM node:22-alpine AS build
WORKDIR /app


COPY package*.json ./


RUN npm install


COPY . .


RUN npm run build -- --configuration production


FROM nginx:alpine


RUN rm -rf /usr/share/nginx/html/*


COPY --from=build /app/www /usr/share/nginx/html


COPY nginx-custom.conf /etc/nginx/conf.d/default.conf

EXPOSE 80


CMD ["nginx", "-g", "daemon off;"]
