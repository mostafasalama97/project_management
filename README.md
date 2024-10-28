# Project Management App

A full-stack project management application with backend services and a React-based frontend. The backend manages tasks, projects, and user roles, while the frontend allows users to interact with and manage data based on role-based access.

---

## Table of Contents

1. [Design Choices](#design-choices)
2. [Installation Instructions](#installation-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
3. [Code Documentation](#code-documentation)

---

### Design Choices

This application was designed following a modular approach for ease of maintenance and scalability:

- **Backend**: Built with Node.js and Express, the backend uses REST APIs for data management. It includes:
  - **Role-based access control**: Ensuring restricted access based on user roles (Manager, Employee).
  - **Data models**: Sequelize ORM is used to define `User`, `Project`, and `Task` models, which enable data validation and complex relationships.
  - **Authentication**: JWT-based authentication is implemented for secure session management.
  
- **Frontend**: Developed with React, the frontend interacts with backend APIs for data operations.
  - **Role-sensitive UI**: Components and actions are conditionally rendered based on the user’s role.
  - **Routing and Protected Routes**: Used React Router for navigation and PrivateRoute utility for secure access to protected routes.

---

## Installation Instructions

Follow these steps to set up the backend and frontend locally.

### Backend Setup

1. **Navigate to the backend directory**:
   ```bash
   cd backend
    ```
   ### Backend Setup

2. **Install dependencies**:
   ```bash
   npm install
3. **Set up environment variables:**:
   - Create a .env file in the backend directory.
   - Refer to the .env.example provided to define variables like DB_HOST, DB_USER, DB_PASSWORD, etc.
4. **Set up environment variables:**:
```bash
   npm run dev
```
### Frontend Setup

1. **Navigate to the frontend directory**:
   ```bash
   cd frontend/
    ```
2. **Install dependencies**:
   ```bash
   npm install
3. **Set up environment variables:**:
   - Create a .env file in the backend directory.
   - Refer to the .env.example provided to define variables like REACT_APP_API_URL.
4. **Set up environment variables:**:
```bash
   npm start
```
