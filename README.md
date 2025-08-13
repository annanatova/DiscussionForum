# Discussion Forum

## Description
Discussion Forum is a web application developed with Angular for the frontend and a REST API backend connected to a MongoDB database. The project allows users to create and manage themes and posts, as well as have their own user profile with authentication.

Key features:
- Home page
- Create, read, edit and delete themes (CRUD operations)
- View details of each theme and post
- User registration and login
- User profile with the ability to update information
- Authentication and access protection for certain resources

## Installation

### Backend
1. Clone the backend repository (from the Angular course - Rest-api)
2. Install dependencies:
```bash
npm install
```

Start the server:
```bash
npm start
```

Frontend (Angular)
Clone the frontend repository
Install dependencies:
```bash
npm install
```

Start the Angular application:
```bash
ng serve
```

Open your browser at http://localhost:4200

## Technologies
Frontend: Angular
Backend: REST API (Node.js / Express)
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Project Structure

src/app

core – services, interceptors, and guards
features – feature modules including:
auth – login, register
home – home page
posts – post-related components
profile – user profile components
themes – themes-related components
models – TypeScript interfaces for users, themes, and posts
shared – shared components and pipes used across the app

## Usage
Navigate to the home page
Create new theme
Edit or delete existing themes (only by their author)
Register a new user and log in
View and update user profile information

## Author
Anna Natova

## License
This project is intended for educational purposes and personal development.