# Finances Tracker

## Overview

The **Finances Tracker** is a full-stack application designed to manage personal finances. It provides users with the ability to:
- Track budgets and expenses by category.
- Add transactions with details like amount, category, date, and currency.
- View progress for budget utilization and visualize overspending.

The project includes APIs for managing budgets, transactions, and categories.

---

## Features

-  View transactions history.
- Set and track budgets for various categories.
- Visualize budget usage and identify overspending.
-  user-friendly interface.

---

## Prerequisites

To run this project, ensure you have the following installed:

- **Node.js** (v16 or later)
- **npm** (v7 or later) or **Yarn**
- **PostgreSQL** database
- **Git** (optional, for cloning the repository)

---

## Configuration

1. **Install backend dependencies:**

   ```bash
   cd Back-End
   npm install

2. **Install frontend dependencies:**

   ```bash
   cd Front-End
   npm install

3. **Create a .env file**
   Create a .env file in the backend directory and add your environment variables:
     
    ```bash
    DBURI=your_postgre_uri
    PORT=your_port
    APP_ID=your_ api_id
    

4. **Running the Application**
   - **Start the backend server:**
      ```bash
      cd Back-End
      npm start

   - **Start the frontend development server:**
      ```bash
      cd Front-End
      npm run dev


