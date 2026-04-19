# Интеграции — план развития

## 1С (приоритет: высокий)
TODO: REST-адаптер для синхронизации номенклатуры
- Endpoint: /api/sync/1c (webhook от 1С)
- Синхронизировать: name, article, price, stock
- Запускать: по расписанию (cron) или по событию
- Env: SYNC_SECRET_KEY

## Telegram Bot (приоритет: средний)
TODO: уведомления менеджеру при новой записи/заказе
- Bot token: TELEGRAM_BOT_TOKEN
- Chat ID: TELEGRAM_CHAT_ID
- Триггеры: новая Booking, новый Order, заказ товара под заказ

## Яндекс Карты
TODO: заменить placeholder в /contacts на Yandex Maps API
- Env: YANDEX_MAPS_API_KEY
- Показывать оба адреса: магазин и сервис

## СМС-уведомления (приоритет: низкий)
TODO: SMS клиенту при подтверждении записи
- Провайдер: SMSC.ru или SMS.ru (популярны в РФ)
- Env: SMS_API_KEY

## .env.example
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
YANDEX_MAPS_API_KEY=
SMS_API_KEY=
SYNC_SECRET_KEY=