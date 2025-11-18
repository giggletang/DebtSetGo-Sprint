# DebtSetGo – Full-Stack Personal Finance Platform  
React + Node.js (Express) + MySQL + Docker

# 🚀 Quick Start with Docker
Run the full stack (frontend + backend + MySQL) with one command:

## Run (Docker – no IDE required)
```bash
docker compose up --build
```
- Frontend: http://localhost:80
- API: http://localhost:8080
- MySQL: localhost:3306 (user: debtuser / pass: debtpass)

## Schema
See `mysql_init.sql` (users, profiles, achievements, goals, goal_steps, budgets, transactions, smart_suggestions, forum_messages).

## Endpoints
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Authenticate and return user info
- `GET /api/profile/:userId` – Fetch profile for a user
- `POST /api/profile/update` – Update profile (age, address, income, etc.)
- `GET /api/achievements/:userId` - Get all achievements for a user
- `POST /api/achievements/add` - Add a new achievement
- `POST /api/membership/upgrade` - Upgrade to premium membership
- `POST /api/membership/downgrade` - Downgrade from membership
- `POST /api/tax/calc` - Calculate tax estimate using state + income
- `POST /api/investments/plan` - Generate investment suggestions
- `POST /api/whatif/analyze` - Run scenario simulations (income changes, expenses, risk)
- `POST /api/goals` – create a goal
- `GET  /api/goals/:goalid` – Fetch goal details & step
- `POST /api/goal-steps` - Add a new step to a goal
- `POST /api/goal-steps/complete/:stepId` - Mark a step as complete
- `POST /api/budget/create` - Create/get a monthly budget
- `GET /api/budget/:userId/:month/:year` - Fetch a specific budget with summary
- `POST /api/budget/expense` – add expense
- `GET  /api/budget/:budgetId/suggestions` – list smart suggestions
- `POST /api/forum/post` - Post a message
- `GET /api/forum/all` - Get all messages
