# Stage 1: Build
FROM node:20-alpine AS build

WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm ci

# Копируем все файлы проекта
COPY . .

# Собираем production build
RUN npm run build

# Stage 2: Production
FROM nginx:alpine

# Копируем собранные файлы из stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Копируем конфигурацию nginx для SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
