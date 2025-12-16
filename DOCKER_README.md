

## Архитектура

Микросервисная архитектура с JWT авторизацией:
- **UserService** (порт 8001) - аутентификация и управление пользователями
- **PurchaseService** (порт 8002) - управление покупками курсов
- **CourseService** (порт 8003) - управление курсами
- **Frontend** (порт 80) - React + Vite клиент
- **PostgreSQL** (порт 5433) - база данных (3 отдельные БД для каждого сервиса)

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
- Purchase Service API: http://localhost:8002
- Course Service API: http://localhost:8003
- PostgreSQL: localhost:5433

### Тестовые данные

После запуска автоматически создаются:
- **Суперпользователь**: username: `admin`, password: `admin123`
- **10 курсов** в разных категориях (programming, data_science, mathematics)

### API Endpoints

Полная документация API доступна в файле [FRONTEND_API_DOCS.md](FRONTEND_API_DOCS.md)

#### User Service (http://localhost:8001/user/)

- `POST /user/register/` - Регистрация нового пользователя
- `POST /user/login/` - Вход (получение JWT токенов)
- `POST /user/logout/` - Выход (блокировка refresh токена)
- `POST /user/token/refresh/` - Обновление access токена
- `GET /user/profile/` - Получить профиль текущего пользователя (требует авторизацию)
- `GET /user/users/` - Получить список всех пользователей (требует авторизацию)

#### Course Service (http://localhost:8003/courses/)

- `GET /courses/` - Список курсов с фильтрацией и поиском
- `GET /courses/popular/` - Популярные курсы
- `GET /courses/categories/` - Список доступных категорий
- `GET /courses/<id>/` - Детали курса
- `POST /courses/create/` - Создать курс (требует авторизацию)
- `PUT/PATCH /courses/<id>/update/` - Обновить курс (требует авторизацию)
- `DELETE /courses/<id>/delete/` - Удалить курс (требует авторизацию)

#### Purchase Service (http://localhost:8002/purchase/)

- `POST /purchase/create/` - Купить курс (требует авторизацию)
- `GET /purchase/my-purchases/` - Мои покупки (требует авторизацию)
- `GET /purchase/my-courses/` - ID моих купленных курсов (требует авторизацию)
- `GET /purchase/check/<course_id>/` - Проверить покупку курса (требует авторизацию)
- `GET /purchase/all/` - Все покупки (требует авторизацию)

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

### Все Backend сервисы

- `DEBUG` - режим отладки (True/False)
- `SECRET_KEY` - секретный ключ Django
- `JWT_SECRET_KEY` - **ВАЖНО**: общий секретный ключ для JWT (должен совпадать для всех сервисов)
- `DB_NAME` - имя базы данных (user_db, course_db, purchase_db)
- `DB_USER` - пользователь БД
- `DB_PASSWORD` - пароль БД
- `DB_HOST` - хост БД
- `DB_PORT` - порт БД
- `ALLOWED_HOSTS` - разрешенные хосты
- `CORS_ALLOW_ALL_ORIGINS` - разрешить все CORS origins (True для разработки)

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
│   ├── UserService/             # Сервис пользователей
│   │   ├── user/               # Django приложение
│   │   ├── sigmabackend/       # Настройки проекта
│   │   ├── entrypoint.sh       # Скрипт инициализации
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   ├── CourseService/          # Сервис курсов
│   │   ├── courses/            # Django приложение
│   │   │   ├── fixtures/       # Начальные данные (10 курсов)
│   │   │   ├── models.py
│   │   │   ├── views.py
│   │   │   └── serializers.py
│   │   ├── sigmabackend/       # Настройки проекта
│   │   ├── entrypoint.sh       # Скрипт инициализации
│   │   ├── Dockerfile
│   │   └── requirements.txt
│   └── PurchaseService/        # Сервис покупок
│       ├── purchase/           # Django приложение
│       ├── purchase_service/   # Настройки проекта
│       ├── entrypoint.sh       # Скрипт инициализации
│       ├── Dockerfile
│       └── requirements.txt
├── docker-init/
│   └── init-databases.sh       # Автоматическое создание БД
├── frontend/                   # React приложение
│   ├── src/
│   ├── Dockerfile
│   └── package.json
├── docker-compose.yml          # Оркестрация сервисов
└── FRONTEND_API_DOCS.md        # Полная документация API
```

## JWT Авторизация

### Как работает

Все микросервисы используют **общий секретный ключ** (`JWT_SECRET_KEY`) для валидации JWT токенов:

1. User Service генерирует токены при регистрации/входе
2. Course и Purchase Service валидируют эти токены используя тот же секретный ключ
3. Токены содержат: `user_id`, `username`, `email`

### Использование токенов

Все защищенные endpoints требуют JWT токен:

```bash
Authorization: Bearer <access_token>
```

### Жизненный цикл токенов

- **Access Token**: 15 минут - используется для запросов
- **Refresh Token**: 30 дней - используется для обновления access token

### Обновление токена

Когда access token истекает:

```bash
POST /user/token/refresh/
{
  "refresh": "<refresh_token>"
}
```

### Публичные endpoints (не требуют авторизацию)

- `POST /user/register/`
- `POST /user/login/`
- `GET /courses/`
- `GET /courses/<id>/`
- `GET /courses/popular/`
- `GET /courses/categories/`

## Особенности реализации

### Автоматическая инициализация

При первом запуске контейнеров:

1. **Создаются 3 базы данных**: `user_db`, `course_db`, `purchase_db`
2. **Выполняются миграции** для всех сервисов
3. **Создается суперпользователь**: admin/admin123 (для User и Course Service)
4. **Загружаются fixtures**: 10 курсов в разных категориях

### Поиск и фильтрация курсов

Course Service поддерживает:
- **Поиск** по названию, описанию и категории (`?search=python`)
- **Фильтры**: категория, сложность, цена, ограниченное количество
- **Сортировка**: по цене, дате создания, популярности

### Межсервисная коммуникация

Purchase Service взаимодействует с Course Service через HTTP:
- Проверяет существование курса перед покупкой
- Все запросы защищены через JWT

## Разработка новых микросервисов

1. Создать новую директорию в `backend/`
2. Создать Django проект с DRF
3. Настроить SIMPLE_JWT с общим `JWT_SECRET_KEY`
4. Создать entrypoint.sh для автоматической инициализации
5. Добавить Dockerfile
6. Добавить сервис в docker-compose.yml
7. Добавить БД в init-databases.sh
8. Обновить FRONTEND_API_DOCS.md
