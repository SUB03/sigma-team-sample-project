# API Документация для Frontend разработчиков

## Архитектура микросервисов

Платформа состоит из 4 независимых микросервисов с общей JWT аутентификацией:

```
┌─────────────────┐
│    Frontend     │
│  (React/Vite)   │
│   localhost:80  │
└────────┬────────┘
         │
    ┌────┴──────────────────────┐
    │                           │
┌───▼───────┐ ┌──▼─────────┐ ┌──▼────────┐ ┌──▼────────┐
│   User    │ │   Course   │ │  Purchase │ │  Review   │
│  Service  │ │  Service   │ │  Service  │ │  Service  │
│  :8001    │ │   :8003    │ │   :8002   │ │  :8004    │
│           │ │            │ │           │ │           │
│ user_db   │ │ course_db  │ │purchase_db│ │ review_db │
└───┬───────┘ └────┬───────┘ └─────┬─────┘ └─────┬─────┘
    │              │               │             │
    └──────────────┴───────────────┴─────────────┘
                   │
         ┌─────────▼──────────┐
         │   PostgreSQL       │
         │   localhost:5433   │
         │  (4 databases)     │
         └────────────────────┘
```

### Сервисы:

1. **User Service** (http://localhost:8001) - управление пользователями и JWT аутентификация

   - База данных: `user_db`
   - Генерирует JWT токены с общим секретным ключом
   - Blacklist для токенов при logout

2. **Course Service** (http://localhost:8003) - управление курсами

   - База данных: `course_db`
   - Валидирует JWT токены от User Service
   - CRUD операции с курсами

3. **Purchase Service** (http://localhost:8002) - обработка покупок

   - База данных: `purchase_db`
   - Валидирует JWT токены от User Service
   - Связывается с Course Service для проверки курсов

4. **Review Service** (http://localhost:8004) - управление отзывами на курсы
   - База данных: `review_db`
   - Валидирует JWT токены от User Service
   - CRUD операции с отзывами

---

## 1. User Service API

**Base URL:** `http://localhost:8001/user/`

### 1.1. Регистрация

**POST** `/user/register/`

```javascript
const response = await fetch("http://localhost:8001/user/register/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "john_doe",
    email: "john@example.com",
    password: "Password123",
    photo: null, // опционально
    description: "About me", // опционально
    sex: "male", // опционально
    age: 25, // опционально
  }),
});

const data = await response.json();
// Response:
// {
//     "message": "Пользователь успешно зарегистрирован",
//     "user": { "id": 1, "username": "john_doe", "email": "john@example.com", ... },
//     "refresh": "eyJ0eXAiOiJKV1QiLCJhbGci...",
//     "access": "eyJ0eXAiOiJKV1QiLCJhbGci..."
// }

// Сохраните токены!
localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);
```

### 1.2. Вход

**POST** `/user/login/`

```javascript
const response = await fetch("http://localhost:8001/user/login/", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    username: "john_doe", // или email
    password: "Password123",
  }),
});

const data = await response.json();
// Сохраните токены
localStorage.setItem("access_token", data.access);
localStorage.setItem("refresh_token", data.refresh);
```

### 1.3. Выход

**POST** `/user/logout/`

**Важно:** Этот endpoint блокирует оба токена (access и refresh) для повышенной безопасности.

```javascript
await fetch("http://localhost:8001/user/logout/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    refresh: localStorage.getItem("refresh_token"),
  }),
});

// Response: { "message": "Выход выполнен успешно" }
// Status: 205 Reset Content

// Удалите токены
localStorage.removeItem("access_token");
localStorage.removeItem("refresh_token");
```

### 1.4. Получить профиль

**GET** `/user/profile/`

```javascript
const response = await fetch('http://localhost:8001/user/profile/', {
    headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
   Response:
// {
//     "id": 1,
//     "username": "john_doe",
//     "email": "john@example.com",
//     "photo": null,
//     "description": "About me",
//     "sex": "male",
//     "age": 25
// }
```

### 1.5. Обновить профиль

**PUT** `/user/profile/`

**Поддерживается частичное обновление (partial=True)**

```javascript
const response = await fetch("http://localhost:8001/user/profile/", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    email: "newemail@example.com", // опционально
    description: "New bio", // опционально
    photo: "https://...", // опционально
    sex: "female", // опционально
    age: 30, // опционально
  }),
});

const data = await response.json();
// Response: обновленные данные профиля
```

### 1.6. Получить список пользователей (Admin)

**GET** `/user/users/`

**Примечание:** Текущая реализация не требует аутентификации, но в production должна быть защищена.

```javascript
const response = await fetch("http://localhost:8001/user/users/");
const users = await response.json();
// Response: массив всех пользователей
```

### 1.7. Обновить токен

**POST** `/user/token/refresh/`

```javascript
const response = await fetch('http://localhost:8001/user/token/refresh/', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        refresh: localStorage.getItem('refresh_token')
    })
});

if (response.ok) {
    const data = await response.json();
    localStorage.setItem('access_token', data.access);
    // Response: { "access": "new_access_token..." }
} else {
    // Refresh токен истек - перенаправить на login
    localStorage.clear();
    window.location.href = '/login';
}
});

const data = await response.json();
localStorage.setItem('access_token', data.access);
```

---

## 2. Course Service API

**Base URL:** `http://localhost:8003/courses/`

### 2.1. Получить список курсов

**GET** `/courses/`

**Query параметры:**

- `search` - поиск по названию, описанию и категории
- `categories` - фильтр по нескольким категориям через запятую (Programming, Data Science, Design, Marketing, Business, Mathematics, Other)
- `difficulty` - Beginner, Intermediate, Advanced
- `min_price` - минимальная цена
- `max_price` - максимальная цена
- `is_limited` - true/false (ограниченное количество)
- `sort_by` - сортировка (price, -price, created_at, -created_at, popularity, -popularity)

```javascript
// Все курсы
const response = await fetch("http://localhost:8003/courses/");

// С поиском и фильтрами
const response = await fetch(
  "http://localhost:8003/courses/?search=python&categories=Programming,Data Science&difficulty=Beginner&max_price=5000&sort_by=-popularity"
);

const data = await response.json();
// {
//     "count": 10,
//     "courses": [
//         {
//             "id": 1,
//             "title": "Python для начинающих",
//             "description": "Изучите Python с нуля",
//             "price": "2999.00",
//             "difficulty_level": "Beginner",
//             "duration_hours": 40,
//             "popularity": 150,
//             "is_limited": false,
//             "quantity": null,
//             "category": "Programming",
//             "rating": 4.5,
//             "created_at": "2025-12-01T10:00:00Z",
//             "updated_at": "2025-12-10T15:30:00Z"
//         },
//         ...
//     ]
// }
```

### 2.2. Получить детали курса

**GET** `/courses/<course_id>/`

```javascript
const response = await fetch("http://localhost:8003/courses/1/");
const course = await response.json();
// { "id": 1, "title": "...", "description": "...", ... }
```

### 2.3. Популярные курсы

**GET** `/courses/popular/`

**Query параметры:**

- `limit` - количество курсов (по умолчанию 5)

```javascript
const response = await fetch("http://localhost:8003/courses/popular/?limit=5");
const data = await response.json();
// { "count": 5, "courses": [...] }
```

### 2.4. Создать курс (Требуется аутентификация)

**POST** `/courses/create/`

**Примечание:** В production должна быть проверка на роль админа.

```javascript
const response = await fetch("http://localhost:8003/courses/create/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Новый курс",
    description: "Описание курса",
    price: 4999.0,
    difficulty_level: "Intermediate", // Beginner, Intermediate, Advanced
    duration_hours: 30,
    category: "Programming", // Programming, Data Science, Design, Marketing, Business, Mathematics, Other
    is_limited: false,
    quantity: null, // null если не ограничен
    popularity: 0, // по умолчанию 0
  }),
});

const data = await response.json();
// Response:
// {
//     "message": "Курс успешно создан",
//     "course": { "id": 5, "title": "Новый курс", ... }
// }
```

### 2.5. Обновить курс (Требуется аутентификация)

**PUT/PATCH** `/courses/<course_id>/update/`

```javascript
// Полное обновление (PUT)
const response = await fetch("http://localhost:8003/courses/1/update/", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    title: "Обновленное название",
    description: "Новое описание",
    price: 5999.0,
    difficulty_level: "Advanced",
    duration_hours: 50,
    category: "Data Science",
    is_limited: true,
    quantity: 100,
    popularity: 250,
  }),
});

const data = await response.json();
// Response:
// {
//     "message": "Курс успешно обновлен",
//     "course": { ...updated course data... }
// }

// Частичное обновление (PATCH)
await fetch("http://localhost:8003/courses/1/update/", {
  method: "PATCH",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    price: 5999.0, // только цена
    popularity: 300, // и популярность
  }),
});
// Response: то же, что и для PUT
```

### 2.6. Удалить курс (Требуется аутентификация)

**DELETE** `/courses/<course_id>/delete/`

```javascript
const response = await fetch("http://localhost:8003/courses/1/delete/", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// Response:
// {
//     "message": "Курс \"Python для начинающих\" успешно удален"
// }
```

### 2.7. Получить список категорий

**GET** `/courses/categories/`

```javascript
const response = await fetch("http://localhost:8003/courses/categories/");
const data = await response.json();
// Response:
// {
//     "count": 7,
//     "categories": [
//         "Programming",
//         "Data Science",
//         "Design",
//         "Marketing",
//         "Business",
//         "Mathematics",
//         "Other"
//     ]
// }
```

**Примечание:** Возвращает только те категории, которые используются в существующих курсах.

---

## 3. Review Service API

**Base URL:** `http://localhost:8004/reviews/`

### 3.1. Получить отзывы курса

**GET** `/reviews/course/<course_id>/`

**Query параметры (пагинация):**
- `page` - номер страницы (по умолчанию 1)
- `page_size` - количество отзывов на странице (по умолчанию 10, макс 100)

```javascript
// Первая страница (10 отзывов)
const response = await fetch("http://localhost:8004/reviews/course/1/");

// Вторая страница
const response = await fetch("http://localhost:8004/reviews/course/1/?page=2");

// Кастомный размер страницы (20 отзывов на странице)
const response = await fetch("http://localhost:8004/reviews/course/1/?page_size=20");

const data = await response.json();
// Response:
// {
//     "count": 25,  // Всего отзывов
//     "next": "http://localhost:8004/reviews/course/1/?page=2",  // Следующая страница
//     "previous": null,  // Предыдущая страница
//     "results": [  // Отзывы на текущей странице
//         {
//             "id": 1,
//             "course_id": 1,
//             "user_id": 5,
//             "rating": 5,
//             "comment": "Отличный курс! Все понятно объяснено.",
//             "created_at": "2025-12-10T10:00:00Z",
//             "updated_at": "2025-12-10T10:00:00Z"
//         },
//         ...
//     ]
// }
```

### 3.2. Добавить отзыв к курсу (Требуется аутентификация)

**POST** `/reviews/course/<course_id>/add/`

```javascript
const response = await fetch("http://localhost:8004/reviews/course/1/add/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    rating: 5,
    comment: "Превосходный курс! Рекомендую всем начинающим.", // опционально
  }),
});

const data = await response.json();
// Response:
// {
//     "message": "Отзыв успешно добавлен",
//     "review": {
//         "id": 10,
//         "course": 1,
//         "user_id": 3,
//         "rating": 5,
//         "comment": "Превосходный курс! Рекомендую всем начинающим.",
//         "created_at": "2025-12-16T12:00:00Z"
//     }
// }
```

**Валидация:**

- `rating` - обязательное поле, целое число от 1 до 5
- `comment` - опциональное текстовое поле

**Ограничения:**

- Один пользователь может оставить только один отзыв на курс

### 3.3. Обновить отзыв (Требуется аутентификация)

**PUT** `/reviews/<review_id>/update/`

```javascript
const response = await fetch("http://localhost:8004/reviews/10/update/", {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    rating: 4,
    comment: "Обновил отзыв. Курс хороший, но есть моменты для улучшения.",
  }),
});

const data = await response.json();
// Response:
// {
//     "message": "Отзыв успешно обновлен",
//     "review": {
//         "id": 10,
//         "course_id": 1,
//         "user_id": 3,
//         "rating": 4,
//         "comment": "Обновил отзыв. Курс хороший, но есть моменты для улучшения.",
//         "created_at": "2025-12-16T12:00:00Z",
//         "updated_at": "2025-12-16T14:30:00Z"
//     }
// }
```

**Примечание:** Можно обновлять только свои отзывы.

### 3.4. Удалить отзыв (Требуется аутентификация)

**DELETE** `/reviews/<review_id>/delete/`

```javascript
const response = await fetch("http://localhost:8004/reviews/10/delete/", {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// Response:
// {
//     "message": "Отзыв успешно удален"
// }
```

**Примечание:** Можно удалять только свои отзывы.

### 3.5. Получить средний рейтинг курса

**GET** `/reviews/course/<course_id>/average/`

```javascript
const response = await fetch("http://localhost:8004/reviews/course/1/average/");
const data = await response.json();
// Response:
// {
//     "course_id": 1,
//     "average_rating": 4.5,
//     "reviews_count": 15
// }
```

**Примечание:** Если отзывов нет, `average_rating` будет 0.0

### 3.6. Мои отзывы (Требуется аутентификация)

**GET** `/reviews/my-reviews/`

**Query параметры (пагинация):**
- `page` - номер страницы (по умолчанию 1)
- `page_size` - количество отзывов на странице (по умолчанию 10, макс 100)

```javascript
const response = await fetch("http://localhost:8004/reviews/my-reviews/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// Response:
// {
//     "count": 5,  // Всего ваших отзывов
//     "next": null,  // Следующая страница (null если последняя)
//     "previous": null,  // Предыдущая страница
//     "results": [  // Отзывы на текущей странице
//         {
//             "id": 10,
//             "course_id": 1,
//             "user_id": 3,
//             "rating": 5,
//             "comment": "Отличный курс!",
//             "created_at": "2025-12-16T12:00:00Z",
//             "updated_at": "2025-12-16T12:00:00Z"
//         },
//         ...
//     ]
// }
```

---

## 4. Purchase Service API

**Base URL:** `http://localhost:8002/purchase/`

### 4.1. Купить курс

**POST** `/purchase/create/`

```javascript
const response = await fetch("http://localhost:8002/purchase/create/", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    course_id: 1,
    payment_method: "card", // опционально
  }),
});

const data = await response.json();
// {
//     "message": "Курс успешно куплен",
//     "purchase": {
//         "id": 1,
//         "user_id": 1,
//         "course_id": 1,
//         "price": "2999.00",
//         "status": "completed",
//         "purchase_date": "2025-12-14T10:00:00Z",
//         "payment_method": "card",
//         "transaction_id": null
//     }
// }
```

**Ошибки:**

- `400` - Вы уже купили этот курс
- `404` - Курс не найден
- `503` - Course Service недоступен

### 4.2. Мои покупки

**GET** `/purchase/my-purchases/`

```javascript
const response = await fetch("http://localhost:8002/purchase/my-purchases/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// {
//     "count": 3,
//     "purchases": [
//         {
//             "id": 1,
//             "user_id": 1,
//             "course_id": 1,
//             "price": "2999.00",
//             "status": "completed",
//             "purchase_date": "2025-12-14T10:00:00Z",
//             "payment_method": "card",
//             "transaction_id": null
//         },
//         ...
//     ]
// }
```

### 4.3. ID купленных курсов

**GET** `/purchase/my-courses/`

```javascript
const response = await fetch("http://localhost:8002/purchase/my-courses/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// {
//     "user_id": 1,
//     "purchased_course_ids": [1, 3, 7, 12]
// }
```

### 4.4. Проверить покупку

**GET** `/purchase/check/<course_id>/`

```javascript
const response = await fetch("http://localhost:8002/purchase/check/1/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// {
//     "user_id": 1,
//     "course_id": 1,
//     "has_purchased": true
// }
```

### 4.5. Все покупки (Требуется аутентификация)

**GET** `/purchase/all/`

**Примечание:** В production должна быть проверка на роль админа.

```javascript
const response = await fetch("http://localhost:8002/purchase/all/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});

const data = await response.json();
// Response:
// {
//     "count": 150,
//     "purchases": [
//         {
//             "id": 1,
//             "user_id": 5,
//             "course_id": 2,
//             "price": "2999.00",
//             "status": "completed",
//             "purchase_date": "2025-12-14T10:00:00Z",
//             "payment_method": "card",
//             "transaction_id": null
//         },
//         ...
//     ]
// }
```

---

## Типичные сценарии использования

### Сценарий 1: Регистрация и просмотр курсов

```javascript
// 1. Регистрация
const registerResponse = await fetch("http://localhost:8001/user/register/", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    username: "newuser",
    email: "user@example.com",
    password: "Pass123",
  }),
});
const { access, refresh } = await registerResponse.json();
localStorage.setItem("access_token", access);
localStorage.setItem("refresh_token", refresh);

// 2. Получить категории курсов
const categoriesResponse = await fetch(
  "http://localhost:8003/courses/categories/"
);
const { categories } = await categoriesResponse.json();

// 3. Получить список курсов с фильтрацией
const coursesResponse = await fetch(
  "http://localhost:8003/courses/?categories=Programming&difficulty=Beginner&sort_by=-popularity"
);
const { courses } = await coursesResponse.json();

// 4. Поиск курсов
const searchResponse = await fetch(
  "http://localhost:8003/courses/?search=python"
);
const searchResults = await searchResponse.json();

// 5. Просмотр деталей курса
const courseResponse = await fetch(
  `http://localhost:8003/courses/${courses[0].id}/`
);
const course = await courseResponse.json();

// 6. Получить отзывы курса
const reviewsResponse = await fetch(
  `http://localhost:8004/reviews/course/${courses[0].id}/`
);
const { reviews } = await reviewsResponse.json();

// 7. Получить средний рейтинг курса
const ratingResponse = await fetch(
  `http://localhost:8004/reviews/course/${courses[0].id}/average/`
);
const { average_rating } = await ratingResponse.json();
```

### Сценарий 2: Покупка курса

```javascript
// 1. Проверить, не куплен ли уже курс
const checkResponse = await fetch("http://localhost:8002/purchase/check/1/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});
const { has_purchased } = await checkResponse.json();

if (!has_purchased) {
  // 2. Купить курс
  const purchaseResponse = await fetch(
    "http://localhost:8002/purchase/create/",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id: 1 }),
    }
  );

  const result = await purchaseResponse.json();
  console.log(result.message); // "Курс успешно куплен"
}
```

### Сценарий 3: Личный кабинет

```javascript
// 1. Получить профиль пользователя
const profileResponse = await fetch("http://localhost:8001/user/profile/", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
  },
});
const profile = await profileResponse.json();

// 2. Получить купленные курсы
const purchasesResponse = await fetch(
  "http://localhost:8002/purchase/my-purchases/",
  {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  }
);
const { purchases } = await purchasesResponse.json();

// 3. Для каждой покупки получить данные курса
const coursesData = await Promise.all(
  purchases.map((purchase) =>
    fetch(`http://localhost:8003/courses/${purchase.course_id}/`).then((res) =>
      res.json()
    )
  )
);
```

---

## Обработка ошибок

### Обработка 401 Unauthorized (токен истек)

```javascript
async function fetchWithAuth(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  });

  // Если токен истек
  if (response.status === 401) {
    // Обновить токен
    const refreshResponse = await fetch(
      "http://localhost:8001/user/token/refresh/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh: localStorage.getItem("refresh_token"),
        }),
      }
    );

    if (refreshResponse.ok) {
      const { access } = await refreshResponse.json();
      localStorage.setItem("access_token", access);

      // Повторить запрос
      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${access}`,
        },
      });
    } else {
      // Refresh токен тоже истек - перенаправить на login
      localStorage.clear();
      window.location.href = "/login";
    }
  }

  return response;
}

// Использование
const response = await fetchWithAuth("http://localhost:8001/user/profile/");
```

### Общая обработка ошибок

```javascript
async function apiRequest(url, options = {}) {
  try {
    const response = await fetchWithAuth(url, options);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Ошибка запроса");
    }

    return await response.json();
  } catch (error) {
    console.error("API Error:", error);
    // Показать уведомление пользователю
    showNotification(error.message, "error");
    throw error;
  }
}
```

---

## JWT Аутентификация между микросервисами

### Как это работает:

1. **User Service** генерирует JWT токены при регистрации/логине
2. Токены подписываются общим секретным ключом `JWT_SECRET_KEY`
3. **Course Service** и **Purchase Service** валидируют эти токены используя **тот же секретный ключ**
4. Если подпись валидна → доступ разрешен

### Конфигурация:

Все сервисы используют **общий `JWT_SECRET_KEY`** в переменных окружения:

```
JWT_SECRET_KEY=shared-jwt-secret-key-for-all-services-change-in-production
```

### Настройки токенов:

```python
SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=15),   # 15 минут
    "REFRESH_TOKEN_LIFETIME": timedelta(days=30),     # 30 дней
    "SIGNING_KEY": os.environ.get('JWT_SECRET_KEY'),  # Общий ключ
    "ALGORITHM": "HS256",
}
```

## CORS и безопасность

- Все сервисы настроены на прием запросов с `http://localhost`, `http://localhost:80`, `http://localhost:3000`
- JWT токены живут: **access** - 15 минут, **refresh** - 30 дней
- При logout токен добавляется в blacklist (оба: access и refresh)
- Все микросервисы валидируют JWT токены с одним секретным ключом
- Храните токены в `localStorage` (для простоты) или `httpOnly cookies` (для безопасности)

---

## HTTP коды ответов

- `200 OK` - успешный запрос
- `201 Created` - ресурс создан
- `400 Bad Request` - ошибка валидации
- `401 Unauthorized` - требуется аутентификация / токен истек
- `403 Forbidden` - нет прав доступа
- `404 Not Found` - ресурс не найден
- `503 Service Unavailable` - микросервис недоступен

---

## Полезные хуки React

### useAuth Hook

```javascript
import { useState, useEffect } from "react";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://localhost:8001/user/profile/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await fetch("http://localhost:8001/user/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("access_token", data.access);
      localStorage.setItem("refresh_token", data.refresh);
      setUser(data.user);
      return true;
    }
    return false;
  };

  const logout = async () => {
    await fetch("http://localhost:8001/user/logout/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        refresh: localStorage.getItem("refresh_token"),
        access: localStorage.getItem("access_token"),
      }),
    });

    localStorage.clear();
    setUser(null);
  };

  return { user, loading, login, logout };
}
```

### useCourses Hook

```javascript
import { useState, useEffect } from "react";

export function useCourses(filters = {}) {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCourses();
    fetchCategories();
  }, [JSON.stringify(filters)]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const queryString = new URLSearchParams(filters).toString();
      const url = `http://localhost:8003/courses/${
        queryString ? "?" + queryString : ""
      }`;

      const response = await fetch(url);
      const data = await response.json();
      setCourses(data.courses);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("http://localhost:8003/courses/categories/");
      const data = await response.json();
      setCategories(data.categories);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
    }
  };

  return { courses, categories, loading, error, refetch: fetchCourses };
}

// Пример использования:
// const { courses, categories, loading } = useCourses({
//   search: 'python',
//   categories: 'Programming,Data Science',
//   difficulty: 'Beginner',
//   sort_by: '-popularity'
// });
```

### useReviews Hook

```javascript
import { useState, useEffect } from "react";

export function useReviews(courseId, pageSize = 10) {
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    count: 0,
    next: null,
    previous: null,
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (courseId) {
      fetchReviews(currentPage);
      fetchAverageRating();
    }
  }, [courseId, currentPage]);

  const fetchReviews = async (page = 1) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8004/reviews/course/${courseId}/?page=${page}&page_size=${pageSize}`
      );
      const data = await response.json();
      setReviews(data.results);
      setPagination({
        count: data.count,
        next: data.next,
        previous: data.previous,
      });
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAverageRating = async () => {
    try {
      const response = await fetch(
        `http://localhost:8004/reviews/course/${courseId}/average/`
      );
      const data = await response.json();
      setAverageRating(data.average_rating);
    } catch (error) {
      console.error("Failed to fetch average rating:", error);
    }
  };

  const addReview = async (rating, comment) => {
    try {
      const response = await fetch(
        `http://localhost:8004/reviews/course/${courseId}/add/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ rating, comment }),
        }
      );

      if (response.ok) {
        await fetchReviews(); // Обновить список отзывов
        await fetchAverageRating(); // Обновить средний рейтинг
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to add review:", error);
      return false;
    }
  };

  const nextPage = () => {
    if (pagination.next) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const previousPage = () => {
    if (pagination.previous) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  return {
    reviews,
    averageRating,
    loading,
    pagination,
    currentPage,
    addReview,
    nextPage,
    previousPage,
    goToPage,
    refetch: fetchReviews,
  };
}

// Пример использования с пагинацией:
// const { reviews, pagination, currentPage, nextPage, previousPage } = useReviews(1);
//
// <div>
//   {reviews.map(review => <ReviewCard key={review.id} review={review} />)}
//   <div className="pagination">
//     <button onClick={previousPage} disabled={!pagination.previous}>Previous</button>
//     <span>Page {currentPage} of {Math.ceil(pagination.count / 10)}</span>
//     <button onClick={nextPage} disabled={!pagination.next}>Next</button>
//   </div>
// </div>
```

### usePurchases Hook

```javascript
import { useState, useEffect } from "react";

export function usePurchases() {
  const [purchases, setPurchases] = useState([]);
  const [purchasedIds, setPurchasedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const [purchasesRes, idsRes] = await Promise.all([
        fetch("http://localhost:8002/purchase/my-purchases/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:8002/purchase/my-courses/", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const purchasesData = await purchasesRes.json();
      const idsData = await idsRes.json();

      setPurchases(purchasesData.purchases);
      setPurchasedIds(idsData.purchased_course_ids);
    } catch (error) {
      console.error("Failed to fetch purchases:", error);
    } finally {
      setLoading(false);
    }
  };

  const purchaseCourse = async (courseId) => {
    const response = await fetch("http://localhost:8002/purchase/create/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ course_id: courseId }),
    });

    if (response.ok) {
      await fetchPurchases(); // Обновить список
      return true;
    }
    return false;
  };

  const hasPurchased = (courseId) => purchasedIds.includes(courseId);

  return { purchases, purchasedIds, loading, purchaseCourse, hasPurchased };
}
```

---

## Запуск проекта

```bash
# Запустить все сервисы
docker-compose up -d

# Проверить статус
docker-compose ps

# Логи конкретного сервиса
docker-compose logs user-service
docker-compose logs course-service
docker-compose logs purchase-service
docker-compose logs review-service
```

**Адреса:**

- Frontend: http://localhost:80
- User Service: http://localhost:8001
- Purchase Service: http://localhost:8002
- Course Service: http://localhost:8003
- Review Service: http://localhost:8004
- PostgreSQL: localhost:5433 (external), 5432 (internal)

**Базы данных:**

- `user_db` - пользователи, JWT токены
- `course_db` - курсы
- `purchase_db` - покупки
- `review_db` - отзывы

---

## Поддержка

При возникновении проблем проверьте:

1. Запущены ли все контейнеры: `docker-compose ps`
2. Логи сервисов: `docker-compose logs <service-name>`
3. Правильность токенов в `localStorage`
4. CORS настройки в браузере
