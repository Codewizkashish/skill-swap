# Skill Swap Platform

A modern, responsive web application built with Next.js that allows users to exchange skills with each other. Users can create profiles, browse others' skills, request skill swaps, and rate their experiences.

## Features

- **User Authentication**: Registration and login with NextAuth.js
- **Profile Management**: Create and edit profiles with skills, availability, and privacy settings
- **Skill Browsing**: Search and browse user profiles by skills
- **Swap Requests**: Request skill exchanges with other users
- **Swap Management**: Accept, reject, or delete swap requests
- **Rating System**: Rate and review completed swaps
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: Enhanced UX with GSAP animations
- **Dark Mode**: Beautiful dark theme throughout the application

## Tech Stack

- **Framework**: Next.js 14 with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS
- **Animations**: GSAP (GreenSock)
- **Password Hashing**: bcryptjs

## Prerequisites

Before running this application, make sure you have the following installed:

- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

## Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd skill-swap-platform
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env.local` file in the root directory (already included) and configure:
   ```
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here-change-this-in-production
   MONGODB_URI=mongodb://localhost:27017/skill-swap-platform
   ```

4. **Start MongoDB**:
   - If using local MongoDB, start the MongoDB service
   - If using MongoDB Atlas, ensure your cluster is running and update the MONGODB_URI

5. **Seed the database** (optional but recommended):
   ```bash
   npm run seed
   ```
   This will populate the database with sample users and data.

6. **Run the development server**:
   ```bash
   npm run dev
   ```

7. **Open your browser** and navigate to `http://localhost:3000`

## Sample Login Credentials

After running the seed script, you can use these credentials to test the application:

- **Email**: alice@example.com, **Password**: password123
- **Email**: bob@example.com, **Password**: password123
- **Email**: carol@example.com, **Password**: password123
- **Email**: david@example.com, **Password**: password123
- **Email**: emma@example.com, **Password**: password123
- **Email**: frank@example.com, **Password**: password123

## Project Structure

```
skill-swap-platform/
├── components/          # Reusable UI components
│   ├── Layout.tsx      # Main layout component
│   └── UserCard.tsx    # User profile card component
├── lib/                # Utility functions
│   └── mongodb.ts      # MongoDB connection utility
├── models/             # Mongoose models
│   ├── User.ts         # User model
│   ├── Swap.ts         # Swap model
│   └── Rating.ts       # Rating model
├── pages/              # Next.js pages
│   ├── api/            # API routes
│   │   ├── auth/       # Authentication endpoints
│   │   ├── users/      # User management endpoints
│   │   ├── swaps/      # Swap management endpoints
│   │   └── ratings/    # Rating endpoints
│   ├── profile/        # User profile pages
│   ├── swap/           # Swap detail pages
│   ├── index.tsx       # Home page
│   ├── login.tsx       # Login/Register page
│   ├── edit-profile.tsx # Profile editing page
│   └── swaps.tsx       # Swap management page
├── scripts/            # Utility scripts
│   └── seed.ts         # Database seeding script
├── styles/             # Global styles
│   └── globals.css     # Global CSS with Tailwind
├── types/              # TypeScript type definitions
│   └── global.d.ts     # Global type definitions
└── next.config.js      # Next.js configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in user
- `POST /api/auth/signout` - Sign out user

### Users
- `GET /api/users` - Get all users (with search and pagination)
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user profile

### Swaps
- `GET /api/swaps` - Get user's swaps
- `POST /api/swaps` - Create new swap request
- `GET /api/swaps/[id]` - Get swap by ID
- `PUT /api/swaps/[id]` - Update swap status
- `DELETE /api/swaps/[id]` - Delete swap

### Ratings
- `POST /api/ratings` - Submit rating for completed swap

## Features Overview

### User Management
- User registration with email validation
- Secure password hashing with bcryptjs
- Profile creation with skills, location, and availability
- Profile privacy settings (public/private)
- Profile photo support via URL

### Skill Matching
- Browse all public user profiles
- Search users by skill name
- Pagination for large user lists
- Skill categorization (offered vs wanted)

### Swap System
- Request skill swaps with custom messages
- Accept, reject, or delete swap requests
- Track swap status (pending, accepted, rejected, completed)
- Swap history and management

### Rating System
- Rate completed swaps (1-5 stars)
- Leave detailed feedback
- User rating aggregation
- Rating history tracking

### UI/UX Features
- Responsive design for all screen sizes
- Dark mode theme
- Smooth GSAP animations
- Loading states and error handling
- Form validation
- Modal dialogs for interactions

## Development

To contribute to this project:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/new-feature`
3. **Make your changes** and add tests if applicable
4. **Commit your changes**: `git commit -m "Add new feature"`
5. **Push to the branch**: `git push origin feature/new-feature`
6. **Create a Pull Request**

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seed` - Seed database with sample data

## Environment Variables

- `NEXTAUTH_URL` - Base URL for NextAuth.js
- `NEXTAUTH_SECRET` - Secret key for NextAuth.js sessions
- `MONGODB_URI` - MongoDB connection string

## Deployment

For production deployment:

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Set production environment variables**:
   - Update `NEXTAUTH_SECRET` with a secure random string
   - Update `NEXTAUTH_URL` with your production URL
   - Update `MONGODB_URI` with your production MongoDB connection

3. **Deploy to your preferred platform** (Vercel, Netlify, etc.)

## License

This project is licensed under the MIT License.

## Support

For support or questions, please create an issue in the repository.