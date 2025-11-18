-- ===========================================================
-- DebtSetGo Database Schema (MySQL)
-- ===========================================================

CREATE DATABASE IF NOT EXISTS debtsetgo CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE debtsetgo;

-- ===========================================================
-- USERS & PROFILE (User Management + Membership + Tax/What-if helpers)
-- ===========================================================
CREATE TABLE IF NOT EXISTS users (
    user_id         INT AUTO_INCREMENT PRIMARY KEY,
    email           VARCHAR(100) NOT NULL UNIQUE,
    full_name       VARCHAR(100) NOT NULL,
    -- used by auth.js (password_hash)
    password_hash   VARCHAR(255) NULL,
    -- used by membership.js
    is_member       TINYINT(1) NOT NULL DEFAULT 0,
    membership_plan VARCHAR(50) DEFAULT NULL,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS profiles (
    profile_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id           INT NOT NULL UNIQUE,
    -- used by profile.js
    age               INT NULL,
    address           VARCHAR(255) NULL,
    state             VARCHAR(50),
    -- used by tax.js, investments.js, whatif.js, credit.js
    income_monthly    DECIMAL(10,2) DEFAULT 0.00,
    credit_card_owned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS achievements (
    achievement_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    description    TEXT,
    earned_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================
-- GOAL PLANNER (AI Goal Planner)
-- ===========================================================
CREATE TABLE IF NOT EXISTS goals (
    goal_id        INT AUTO_INCREMENT PRIMARY KEY,
    user_id        INT NOT NULL,
    name           VARCHAR(100) NOT NULL,
    target_amount  DECIMAL(12,2) NOT NULL,
    target_date    DATE NOT NULL,
    status         ENUM('ACTIVE','COMPLETED','CANCELLED') DEFAULT 'ACTIVE',
    created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS goal_steps (
    step_id        INT AUTO_INCREMENT PRIMARY KEY,
    goal_id        INT NOT NULL,
    description    VARCHAR(255) NOT NULL,
    due_date       DATE NOT NULL,
    completed_at   DATETIME NULL,
    FOREIGN KEY (goal_id) REFERENCES goals(goal_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================
-- BUDGET TRACKER + SMART PAYMENT SUGGESTIONS
-- ===========================================================
CREATE TABLE IF NOT EXISTS budgets (
    budget_id     INT AUTO_INCREMENT PRIMARY KEY,
    user_id       INT NOT NULL,
    month         TINYINT NOT NULL,
    year          SMALLINT NOT NULL,
    total_spent   DECIMAL(12,2) DEFAULT 0.00,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE,
    -- used by budget.js: one budget per user per month/year
    UNIQUE KEY unique_budget_per_month (user_id, month, year)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS transactions (
    txn_id        INT AUTO_INCREMENT PRIMARY KEY,
    budget_id     INT NOT NULL,
    category      VARCHAR(100),
    amount        DECIMAL(12,2) NOT NULL,
    txn_date      DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(budget_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS smart_suggestions (
    suggestion_id INT AUTO_INCREMENT PRIMARY KEY,
    budget_id     INT NOT NULL,
    message       VARCHAR(255) NOT NULL,
    created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(budget_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================
-- COMMUNITY FORUM (forum.js)
-- ===========================================================
CREATE TABLE IF NOT EXISTS forum_messages (
    id          INT AUTO_INCREMENT PRIMARY KEY,
    user_id     INT NOT NULL,
    content     TEXT NOT NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id)
        ON DELETE CASCADE
) ENGINE=InnoDB;

-- ===========================================================
-- INDEXES
-- ===========================================================
CREATE INDEX idx_user_email     ON users(email);
CREATE INDEX idx_goal_user      ON goals(user_id);
CREATE INDEX idx_budget_user    ON budgets(user_id);
CREATE INDEX idx_txn_budget     ON transactions(budget_id);
CREATE INDEX idx_profile_user   ON profiles(user_id);
CREATE INDEX idx_forum_user     ON forum_messages(user_id);
