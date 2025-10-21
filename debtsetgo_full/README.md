# DebtSetGo – React + Node + MySQL (Demo)

## Run (Docker – no IDE required)
```bash
docker compose up --build
```
- Frontend: http://localhost:5173
- API: http://localhost:8080
- MySQL: localhost:3306 (user: debtuser / pass: debtpass)

## Schema
See `mysql_init.sql` (users, profiles, goals, goal_steps, budgets, transactions, smart_suggestions, achievements).

## Endpoints
- `POST /api/goals` – create a goal
- `GET  /api/goals/:id` – get goal + steps + completion
- `POST /api/budget/expense` – add expense
- `GET  /api/budget/:budgetId/suggestions` – list smart suggestions
