FROM python:3.11-slim

WORKDIR /app

# Установка зависимостей системы
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Копирование requirements
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Копирование проекта
COPY . .

# Создание директории для static файлов
RUN mkdir -p /app/staticfiles

# Запуск сервера
CMD python manage.py makemigrations && \
    python manage.py migrate && \
    python manage.py collectstatic --noinput && \
    python manage.py runserver 0.0.0.0:8000
