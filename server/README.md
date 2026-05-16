# Order App Server

Express backend for the coffee order app.

## Setup

```bash
npm install
npm run db:setup
npm run dev
```

The server runs on `http://localhost:4000` by default.

Environment variables are defined in `.env`.

## Database

The PostgreSQL connection uses these `.env` values:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_SSL`

Database scripts:

- `npm run db:create`
- `npm run db:migrate`
- `npm run db:seed`
- `npm run db:setup`

## Endpoints

- `GET /health`
- `GET /api/menus`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/:orderId`
- `PATCH /api/orders/:orderId/status`
- `GET /api/admin/inventory`
- `PATCH /api/admin/inventory/:menuId`
