# Review Service

Микросервис для управления отзывами на курсы.

## Endpoints

### Базовый URL
`http://localhost:8004/reviews/`

### API Endpoints

#### 1. Получить отзывы курса
```
GET /reviews/course/<course_id>/
```
Получить все отзывы для конкретного курса (публичный endpoint).

#### 2. Добавить отзыв
```
POST /reviews/course/<course_id>/add/
```
Добавить отзыв к курсу (требуется аутентификация).

**Body:**
```json
{
    "rating": 5,
    "comment": "Отличный курс!"
}
```

#### 3. Обновить отзыв
```
PUT /reviews/<review_id>/update/
```
Обновить свой отзыв (требуется аутентификация).

#### 4. Удалить отзыв
```
DELETE /reviews/<review_id>/delete/
```
Удалить свой отзыв (требуется аутентификация).

#### 5. Средний рейтинг курса
```
GET /reviews/course/<course_id>/average/
```
Получить средний рейтинг курса (публичный endpoint).

#### 6. Мои отзывы
```
GET /reviews/my-reviews/
```
Получить все отзывы текущего пользователя (требуется аутентификация).

## Модель данных

### Review
- `id` - уникальный идентификатор
- `course_id` - ID курса (связь с Course Service)
- `user_id` - ID пользователя (связь с User Service)
- `rating` - рейтинг от 1 до 5
- `comment` - текст отзыва (опционально)
- `created_at` - дата создания
- `updated_at` - дата обновления

**Ограничения:**
- Один пользователь может оставить только один отзыв на курс (unique_together)
- Рейтинг должен быть от 1 до 5

## Аутентификация

Использует JWT токены с общим секретным ключом для всех микросервисов.

## Переменные окружения

- `DEBUG` - режим отладки
- `SECRET_KEY` - секретный ключ Django
- `JWT_SECRET_KEY` - общий секретный ключ для JWT (должен совпадать с другими сервисами)
- `DB_NAME` - имя базы данных (review_db)
- `DB_USER` - пользователь БД
- `DB_PASSWORD` - пароль БД
- `DB_HOST` - хост БД
- `DB_PORT` - порт БД

## Запуск

### Локально
```bash
python manage.py migrate
python manage.py runserver 8004
```

### Docker
```bash
docker-compose up review-service
```

## Суперпользователь

- Username: `admin`
- Password: `admin123`
