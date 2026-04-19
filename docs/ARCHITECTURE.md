# Архитектура сайта ТРАК

## Страницы
/                        Главная
/catalog                 Каталог запчастей (поиск + фильтр по марке)
/catalog/[brand]         Каталог по марке (vaz / gaz / uaz / kamaz)
/catalog/[brand]/[slug]  Карточка товара
/service                 Все услуги автосервиса
/service/[slug]          Детальная страница услуги
/booking                 Онлайн-запись в сервис
/about                   О компании
/portfolio               Выполненные работы
/articles                Блог
/articles/[slug]         Статья
/reviews                 Отзывы
/contacts                Контакты + карта
/account                 Личный кабинет (авторизован)
/account/orders          История заказов
/account/bookings        Мои записи в сервис
/cart                    Корзина
/checkout                Оформление заказа
/admin                   Панель управления (role: admin)

## API Routes
POST /api/booking         Создать запись в сервис
GET  /api/products        Список товаров (query: brand, category, search)
GET  /api/products/[id]   Карточка товара
POST /api/cart            Обновить корзину
POST /api/auth/[...nextauth]  Авторизация

## Prisma модели
Product:  id, name, article, brand, category, price, stock, imageUrl
Booking:  id, name, phone, carBrand, carYear, service, date, time, status
Review:   id, author, carBrand, text, rating, approved
Article:  id, title, slug, content, preview, publishedAt
User:     id, name, phone, email, role, createdAt
Order:    id, userId, items, total, status, createdAt

## Глобальный стейт (Zustand)
- useCartStore: items[], addItem, removeItem, clearCart
- useGarageStore: selectedBrand, selectedModel, selectedYear