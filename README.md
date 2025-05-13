# Role-Based Authentication App (Frontend)

A mobile-friendly web application with role-based authentication, built with React, Tailwind CSS, and React Toastify. Users sign in via Google OAuth, select a role (Admin/Guest), and access a dashboard with role-specific features (CRUD for Admins, read-only for Guests).

## Live Demo
- **URL**: https://role-based-frontend-plum.vercel.app
- **Test Accounts**:
  - Use any Gmail account for login.
  - New users: Select "Admin" or "Guest" role.
  - Existing Admin: `akmmishra1510@gmail.com` (role: admin).

## Features
- **Google OAuth**: Secure sign-in with Gmail.
- **Role Selection**: New users choose between Admin or Guest roles.
- **Dashboard**:
  - **Admin**: Create, read, update, delete forms (Name, Address, PIN, Phone Number).
  - **Guest**: View forms created by Admins.
- **UI/UX**: Clean, mobile-responsive design with Tailwind CSS and React Toastify notifications.
- **Logout**: Securely ends the session.

## Tech Stack
- **Frontend**: React, React Router, Tailwind CSS, React Toastify
- **Deployment**: Vercel
- **Backend API**: Node.js (see backend repo)

## Setup Instructions
1. **Clone the repo**:
   ```bash
   git clone https://github.com/<your-username>/role-based-frontend.git
   cd role-based-frontend
