

## Архитектура

Микросервисная архитектура с JWT авторизацией:
- **UserService** (порт 8001) - аутентификация и управление пользователями
- **CourseService** (порт 8002) - управление курсами (в разработке)
- **Frontend** (порт 80) - React + Vite клиент
- **PostgreSQL** (порт 5432) - база данных

## Быстрый старт

### Запуск с Docker Compose

```bash
# Клонировать репозиторий
git clone <repository-url>
cd sigma-team-sample-project

# Запустить все сервисы
docker-compose up -d

# Просмотр логов
docker-compose logs -f

# Остановка сервисов
docker-compose down

# Остановка с удалением volumes
docker-compose down -v
```

### Доступ к сервисам

- Frontend: http://localhost
- User Service API: http://localhost:8001
- PostgreSQL: localhost:5432

### API Endpoints

#### User Service (http://localhost:8001/user/)

**Регистрация**
```bash
POST /user/register/
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "securepass123"
}
```

**Вход**
```bash
POST /user/login/
{
  "username": "testuser",
  "password": "securepass123"
}
```

**Выход**
```bash
POST /user/logout/
Authorization: Bearer <access_token>
{
  "refresh": "<refresh_token>"
}
```

## Разработка

### Локальный запуск без Docker

#### Backend (UserService)

```bash
cd backend/UserService
python -m venv venv
source venv/bin/activate  # Linux/Mac
# или venv\Scripts\activate  # Windows

pip install -r requirements.txt

# Настроить переменные окружения
export DATABASE_URL="postgresql://user:password@localhost:5432/db"
export SECRET_KEY="your-secret-key"

python manage.py migrate
python manage.py runserver 8001
```

#### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Переменные окружения

### UserService

- `DEBUG` - режим отладки (True/False)
- `SECRET_KEY` - секретный ключ Django
- `DATABASE_URL` - URL подключения к PostgreSQL
- `ALLOWED_HOSTS` - разрешенные хосты
- `CORS_ALLOWED_ORIGINS` - разрешенные CORS origins

## Технологии

### Backend
- Django 5.0
- Django REST Framework
- djangorestframework-simplejwt
- PostgreSQL
- Gunicorn

### Frontend
- React 19
- TypeScript
- Vite
- Bootstrap

### Infrastructure
- Docker
- Docker Compose
- Nginx
- PostgreSQL 15

## Структура проекта

```
sigma-team-sample-project/
├── backend/
│   ├── UserService/         # Сервис пользователей
│   │   ├── user/           # Django приложение
│   │   ├── sigmabackend/   # Настройки проекта
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── CourseService/      # Сервис курсов (в разработке)
├── frontend/               # React приложение
│   ├── src/
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml      # Оркестрация сервисов
```

## JWT Авторизация

Все защищенные endpoints требуют JWT токен:

```bash
Authorization: Bearer <access_token>
```

Токены генерируются при регистрации/входе и содержат:
- `user_id` - ID пользователя
- `username` - имя пользователя
- `email` - email пользователя

## Разработка новых микросервисов

1. Создать новую директорию в `backend/`
2. Создать Django проект
3. Добавить Dockerfile
4. Добавить сервис в docker-compose.yml
5. Настроить JWT валидацию для межсервисной коммуникации
