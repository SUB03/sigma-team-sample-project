# User Service API Documentation

## Base URL
```
http://localhost:8001/user/
```

## Endpoints

### 1. Регистрация пользователя
**POST** `/user/register/`

Создание нового пользователя с автоматической выдачей JWT токенов.

**Request Body:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "photo": null,
  "description": "О себе",
  "sex": "male",
  "age": 25
}
```

**Required Fields:**
- `username`: уникальное значение
- `email`: уникальное значение
- `password`: минимум 8 символов

**Optional Fields:**
- `photo`: файл изображения (ImageField)
- `description`: текстовое описание профиля
- `sex`: пол пользователя (строка)
- `age`: возраст (положительное целое число)

**Validation:**
- `password`: минимум 8 символов, должен содержать хотя бы одну цифру
- `username`: уникальное значение
- `email`: уникальное значение
- `age`: должно быть положительным целым числом

**Response (201 Created):**
```json
{
  "message": "Пользователь успешно зарегистрирован",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "photo": null,
    "description": "О себе",
    "sex": "male",
    "age": 25
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ошибка валидации данных",
  "details": {
    "username": ["A user with that username already exists."],
    "password": ["Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру."]
  }
}
```

---

### 2. Вход (Login)
**POST** `/user/login/`

Аутентификация пользователя по username (или email) и паролю.

**Request Body:**
```json
{
  "username": "testuser",
  "password": "password123"
}
```

**Note:** В поле `username` можно передать как username, так и email.

**Response (200 OK):**
```json
{
  "message": "Вход выполнен успешно",
  "user": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "photo": null,
    "description": "О себе",
    "sex": "male",
    "age": 25
  },
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

**Error Response (401 Unauthorized):**
```json
{
  "error": "Неверные учетные данные"
}
```

---

### 3. Выход (Logout)
**POST** `/user/logout/`

**Authentication:** Required (JWT Access Token)

Добавление refresh токена в черный список (blacklist).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

**Response (205 Reset Content):**
```json
{
  "message": "Выход выполнен успешно"
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ошибка при выходе",
  "details": "Token is blacklisted"
}
```

---

### 4. Профиль пользователя

#### 4.1. Получение профиля
**GET** `/user/profile/`

**Authentication:** Required (JWT Access Token)

Получение информации о текущем пользователе по токену.

**Headers:**
```
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "testuser",
  "email": "test@example.com",
  "photo": "http://localhost:8001/media/user_photos/photo.jpg",
  "description": "О себе",
  "sex": "male",
  "age": 25
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

#### 4.2. Обновление профиля
**PUT** `/user/profile/`

**Authentication:** Required (JWT Access Token)

Обновление информации профиля текущего пользователя. Поддерживает частичное обновление (partial update).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body (все поля опциональны):**
```json
{
  "username": "newusername",
  "email": "newemail@example.com",
  "password": "newpassword123",
  "photo": "<file>",
  "description": "Новое описание профиля",
  "sex": "female",
  "age": 30
}
```

**Available Fields:**
- `username`: имя пользователя
- `email`: email адрес
- `password`: пароль
- `photo`: фото профиля (файл изображения)
- `description`: описание профиля
- `sex`: пол
- `age`: возраст

**Validation:**
- `password`: если указан, минимум 8 символов, должен содержать хотя бы одну цифру
- `username`: если указан, должен быть уникальным
- `email`: если указан, должен быть уникальным
- `age`: должно быть положительным целым числом

**Response (200 OK):**
```json
{
  "id": 1,
  "username": "newusername",
  "email": "newemail@example.com",
  "photo": "http://localhost:8001/media/user_photos/new_photo.jpg",
  "description": "Новое описание профиля",
  "sex": "female",
  "age": 30
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ошибка валидации данных",
  "details": {
    "username": ["A user with that username already exists."],
    "password": ["Пароль должен быть не менее 8 символов и содержать хотя бы одну цифру."]
  }
}
```

**Error Response (401 Unauthorized):**
```json
{
  "detail": "Authentication credentials were not provided."
}
```

**Usage Example:**
```javascript
// Обновить только email
const response = await fetch('http://localhost:8001/user/profile/', {
    method: 'PUT',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        email: 'newemail@example.com'
    })
});
const updatedProfile = await response.json();
```

```bash
# cURL: Обновить username и email
curl -X PUT http://localhost:8001/user/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"username":"newname","email":"newemail@example.com"}'
```

---

### 5. Список пользователей
**GET** `/user/users/`

**Authentication:** Optional (currently disabled)

Получение списка всех зарегистрированных пользователей.

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "username": "user1",
    "email": "user1@example.com",
    "photo": "http://localhost:8001/media/user_photos/user1.jpg",
    "description": "Описание пользователя 1",
    "sex": "male",
    "age": 25
  },
  {
    "id": 2,
    "username": "user2",
    "email": "user2@example.com",
    "photo": null,
    "description": null,
    "sex": "female",
    "age": 28
  }
]
```

---

### 6. Обновление токена
**POST** `/user/refresh/`

Получение нового access токена используя refresh токен.

**Request Body:**
```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

**Response (200 OK):**
```json
{
  "access": "eyJ0eXAiOiJKV1QiLCJhbGci..."
}
```

**Error Response (400 Bad Request):**
```json
{
  "error": "Ошибка при обновлении токена",
  "details": "Token is invalid or expired"
}
```

---

## JWT Token Payload

Access и Refresh токены содержат следующую информацию:

```json
{
  "token_type": "access",
  "exp": 1702327200,
  "iat": 1702240800,
  "jti": "abc123...",
  "user_id": 1,
  "username": "testuser",
  "email": "test@example.com"
}
```

## Token Lifetime

- **Access Token**: 30 дней
- **Refresh Token**: 60 дней

## Common HTTP Status Codes

- `200 OK` - Успешный запрос
- `201 Created` - Ресурс успешно создан
- `205 Reset Content` - Успешный logout
- `400 Bad Request` - Ошибка валидации данных
- `401 Unauthorized` - Неверные учетные данные или отсутствует токен
- `403 Forbidden` - Нет прав доступа

## Error Response Format

Все ошибки возвращаются в следующем формате:

```json
{
  "error": "Краткое описание ошибки",
  "details": "Подробная информация или объект с деталями"
}
```

## Usage Examples

### JavaScript/Fetch

```javascript
// Регистрация
const response = await fetch('http://localhost:8001/user/register/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    })
});
const data = await response.json();

// Сохранить токены
localStorage.setItem('access_token', data.access);
localStorage.setItem('refresh_token', data.refresh);

// Защищенный запрос
const profileResponse = await fetch('http://localhost:8001/user/profile/', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
    }
});
const profile = await profileResponse.json();
```

### cURL

```bash
# Регистрация
curl -X POST http://localhost:8001/user/register/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Вход
curl -X POST http://localhost:8001/user/login/ \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'

# Получить профиль
curl -X GET http://localhost:8001/user/profile/ \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"

# Обновить токен
curl -X POST http://localhost:8001/user/refresh/ \
  -H "Content-Type: application/json" \
  -d '{"refresh":"YOUR_REFRESH_TOKEN"}'
```

## Authentication Flow

1. **Регистрация/Вход** → Получение `access` и `refresh` токенов
2. **Сохранение токенов** → В localStorage или cookie
3. **Защищенные запросы** → Добавление заголовка `Authorization: Bearer <access_token>`
4. **Обновление токена** → Когда `access` истекает, использовать `refresh` для получения нового
5. **Выход** → Отправить `refresh` токен в `/logout/` для добавления в blacklist

## CORS Configuration

API настроен на прием запросов с:
- `http://localhost`
- `http://localhost:3000`
- `http://localhost:80`
- `http://127.0.0.1`

## Security Notes

- Пароли хешируются с помощью Django `AbstractBaseUser.set_password()`
- JWT токены содержат user_id, username и email в payload
- Refresh токены добавляются в blacklist при logout
- Access токены не могут быть отозваны до истечения срока действия

## Future Enhancements

- [ ] Восстановление пароля
- [ ] Email верификация
- [ ] OAuth2 интеграция
- [ ] Обновление профиля пользователя
- [ ] Смена пароля
- [ ] 2FA аутентификация
