# Todo Application

A full-stack todo management system with role-based authentication, built with React.js, Tailwind CSS, Node.js, Express, and MongoDB.

## Features

- **User Authentication**
  - Secure registration with email validation and password hashing
  - JWT-based login and session management
  - Password security using bcrypt

- **Role-Based Access Control**
  - Two user roles: "user" (default) and "admin"
  - Permission-based access to features and data
  - Protected routes based on authentication and role

- **Todo Management**
  - Create todos with title, description, due date, and category
  - View, edit, and delete todos based on user permissions
  - Data association between users and their todos

- **Admin Features**
  - Admin dashboard to view all users and todos
  - Ability to manage any user's todos
  - User role management capabilities

## Tech Stack

### Frontend
- React.js
- Tailwind CSS
- React Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
## Project Structure

```
/
├── client/                 # Frontend application
│   ├── node_modules/       # Frontend dependencies
│   ├── public/             # Static public assets
│   ├── src/                # Source code
│   │   ├── assets/         # Images, fonts, etc.
│   │   ├── components/     # Reusable UI components
│   │   │   ├── Button.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── TodoCard.jsx
│   │   │   └── TodoForm.jsx
│   │   ├── context/        # React Context providers
│   │   │   ├── AdminContext.jsx
│   │   │   ├── AuthContext.jsx
│   │   │   └── TodoContext.jsx
│   │   └── pages/          # Page components
│   │       ├── AdminDashboard.jsx
│   │       ├── Auth.jsx
│   │       ├── Login.jsx
│   │       ├── Register.jsx
│   │       ├── TodoList.jsx
│   │       └── App.jsx     # Main application component
│   ├── index.css           # Global CSS styles
│   ├── main.jsx            # Application entry point
│   ├── .gitignore          # Git ignore file
│   ├── eslint.config.js    # ESLint configuration
│   ├── index.html          # HTML entry point
│   ├── package-lock.json   # Dependency lock file
│   ├── package.json        # Frontend package configuration
│   ├── README.md           # Frontend documentation
│   ├── tailwind.config.js  # Tailwind CSS configuration
│   └── vite.config.js      # Vite bundler configuration
│
└── server/                 # Backend server
    ├── db/                 # Database-related files
    ├── models/             # Data models
    │   ├── Todo.js         # Todo model
    │   └── User.js         # User model
    ├── node_modules/       # Backend dependencies
    ├── middleware/         # Express middleware
    ├── routes/             # API routes
    │   ├── adminRoutes.js  # Admin-specific routes
    │   ├── authRoutes.js   # Authentication routes
    │   ├── todoRoutes.js   # Todo CRUD routes
    │   └── userRoutes.js   # User-related routes
    ├── app.js              # Express application setup
    ├── package-lock.json   # Dependency lock file
    ├── package.json        # Backend package configuration
    └── .gitignore          # Git ignore file
```
## Installation and Setup

### Prerequisites
- Node.js (v14.x or later)
- npm or yarn
- MongoDB

### Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Install nodemon for development:
   ```bash
   npm install -g nodemon
   # or as a dev dependency
   npm install --save-dev nodemon
   ```

4. Create a `.env` file with the following variables:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/todo-app
   JWT_SECRET=your_jwt_secret_key
   ```

5. Start the server with nodemon:
   ```bash
   # If installed globally
   nodemon app.js
   
   # If installed as dev dependency
   npx nodemon app.js
   
   # Or using the script from package.json
   npm run dev
   ```

### Frontend Setup
1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the backend URL:
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the React development server:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and receive JWT

### Todos
- `GET /api/todos` - Get todos (user: own todos, admin: all todos)
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo

### Admin Routes
- `GET /api/admin/users` - Get all users (admin only)
- `GET /api/admin/todos` - Get all todos (admin only)
- `PATCH /api/admin/users/:id/role` - Update user role (admin only)

## Usage

After starting both servers:
1. Register a new account
2. Login with your credentials
3. Create, view, edit, and delete todos
4. Admin users can access the admin dashboard to manage all todos and users

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
