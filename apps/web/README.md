# 🚀 Tech Tips & Tricks Hub

A full-stack social platform for sharing tech tips, tricks, and tutorials. Built with **Next.js 14**, **Express**, **MongoDB**, and **Socket.io** for real-time features.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=flat-square&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=flat-square&logo=socket.io)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Installation](#installation)
- [Architecture](#-architecture)
- [API Documentation](#-api-documentation)
- [Key Features Explained](#-key-features-explained)
- [Development Workflow](#-development-workflow)
- [Deployment](#-deployment)
- [Contributing](#-contributing)

---

## ✨ Features

### 🔐 Authentication & Authorization

- **NextAuth.js** integration with Google OAuth
- JWT-based authentication with secure cookie storage
- Role-based access control (User/Admin)
- Password reset via email

### 📝 Posts & Content

- Create, edit, and delete tech tips/posts
- Rich text editor with markdown support
- Image upload via Cloudinary
- Draft system with localStorage persistence
- Post categories and tags
- Premium/locked content for subscribers
- Upvote/Downvote system
- Save posts for later

### 💬 Real-time Features

- **Live Chat** with Socket.io
- Real-time notifications
- Typing indicators
- Online user presence
- Message read receipts

### 🤖 AI Integration

- **Google Gemini AI** powered features
- AI-assisted content suggestions
- Smart search capabilities

### 👥 Social Features

- Follow/Unfollow users
- Friends system
- User profiles with stats
- Stories feature (24-hour expiring content)
- Comments with nested replies
- User verification system

### 📊 Dashboards

#### User Dashboard

- Personal analytics (posts, followers, views)
- Post management
- Draft management
- Friend requests
- Account settings
- Subscription management

#### Admin Dashboard

- Platform statistics
- User management (verify, block, delete)
- Content moderation
- Reports management
- Activity logs
- Payment tracking

### 💳 Subscription System

- Premium subscription plans
- Payment integration
- Access to premium content

---

## 🛠 Tech Stack

### Frontend (Client)

| Technology             | Purpose                         |
| ---------------------- | ------------------------------- |
| Next.js 14             | React framework with App Router |
| TypeScript             | Type safety                     |
| NextUI v2              | UI component library            |
| Tailwind CSS           | Utility-first styling           |
| React Query (TanStack) | Data fetching & caching         |
| Socket.io Client       | Real-time communication         |
| Framer Motion          | Animations                      |
| Chart.js               | Analytics charts                |
| NextAuth.js            | Authentication                  |
| Axios                  | HTTP client                     |
| Zod                    | Schema validation               |

### Backend (Server)

| Technology  | Purpose               |
| ----------- | --------------------- |
| Express.js  | Node.js web framework |
| MongoDB     | Database              |
| Mongoose    | ODM for MongoDB       |
| Socket.io   | Real-time events      |
| Cloudinary  | Image storage         |
| Nodemailer  | Email service         |
| JWT         | Token authentication  |
| Zod         | Request validation    |
| Meilisearch | Search engine         |
| bcrypt      | Password hashing      |

---

## 📁 Project Structure

```
tech-tips-and-tricks-hub/
├── client/                          # Next.js frontend
│   ├── src/
│   │   ├── app/                     # App Router pages
│   │   │   ├── (auth)/              # Authentication pages
│   │   │   │   ├── login/
│   │   │   │   ├── register/
│   │   │   │   ├── forget-password/
│   │   │   │   └── reset-password/
│   │   │   ├── (commonLayout)/      # Main app pages
│   │   │   │   ├── page.tsx         # Home feed
│   │   │   │   ├── posts/           # Post pages
│   │   │   │   ├── profile/         # User profiles
│   │   │   │   ├── community/       # Community page
│   │   │   │   ├── my-friends/      # Friends list
│   │   │   │   ├── saved-posts/     # Saved posts
│   │   │   │   ├── subscription/    # Subscription plans
│   │   │   │   ├── settings/        # User settings
│   │   │   │   └── components/      # Shared components
│   │   │   ├── (dashboardLayout)/   # Dashboard pages
│   │   │   │   ├── (userDashboard)/
│   │   │   │   │   └── dashboard/
│   │   │   │   │       ├── page.tsx         # User dashboard home
│   │   │   │   │       ├── create-post/     # Create new post
│   │   │   │   │       ├── drafts/          # Draft management
│   │   │   │   │       ├── my-posts/        # User's posts
│   │   │   │   │       └── followers/       # Followers list
│   │   │   │   ├── (adminDashboard)/
│   │   │   │   │   └── admin-dashboard/
│   │   │   │   │       ├── page.tsx         # Admin home
│   │   │   │   │       ├── manage-users/    # User management
│   │   │   │   │       ├── manage-posts/    # Post moderation
│   │   │   │   │       ├── manage-payments/ # Payment tracking
│   │   │   │   │       ├── reports/         # Reports management
│   │   │   │   │       ├── activity-logs/   # User activity
│   │   │   │   │       └── changelog/       # Version history
│   │   │   │   ├── components/      # Dashboard components
│   │   │   │   └── layout/          # Dashboard layout
│   │   │   └── api/                 # API routes
│   │   │       └── auth/            # NextAuth endpoints
│   │   ├── components/              # Global components
│   │   │   └── ui/                  # UI components
│   │   │       ├── LiveChat.tsx     # Real-time chat
│   │   │       ├── NotificationsDropdown.tsx
│   │   │       └── ...
│   │   ├── config/                  # Configuration
│   │   │   ├── axios.config.ts      # Axios instance
│   │   │   ├── envConfig.ts         # Environment config
│   │   │   └── nextauth.config.ts   # NextAuth config
│   │   ├── context/                 # React Context
│   │   │   └── user.provider.tsx    # User & Socket context
│   │   ├── hooks/                   # Custom React hooks
│   │   │   ├── auth.hook.ts         # Auth mutations
│   │   │   ├── post.hook.ts         # Post queries/mutations
│   │   │   ├── comment.hook.ts      # Comment hooks
│   │   │   ├── user.hook.ts         # User hooks
│   │   │   └── ...
│   │   ├── services/                # API service functions
│   │   │   ├── AuthService/
│   │   │   ├── PostService/
│   │   │   ├── UserService/
│   │   │   └── ...
│   │   ├── types/                   # TypeScript types
│   │   │   ├── IUser.ts
│   │   │   ├── TPost.ts
│   │   │   └── ...
│   │   └── utils/                   # Utility functions
│   ├── public/                      # Static assets
│   ├── package.json
│   └── tailwind.config.ts
│
└── server/                          # Express backend
    ├── src/
    │   ├── app.ts                   # Express app setup
    │   ├── server.ts                # Server entry point
    │   └── app/
    │       ├── builder/             # Query builder
    │       │   └── QueryBuilder.ts
    │       ├── config/              # Server config
    │       │   ├── index.ts         # Environment variables
    │       │   ├── cloudinary.config.ts
    │       │   └── multer.config.ts
    │       ├── errors/              # Error handlers
    │       ├── interfaces/          # TypeScript interfaces
    │       ├── middlewares/         # Express middlewares
    │       │   ├── auth.ts          # JWT verification
    │       │   ├── globalErrorHandler.ts
    │       │   └── validateRequest.ts
    │       ├── modules/             # Feature modules
    │       │   ├── Auth/            # Authentication
    │       │   ├── User/            # User management
    │       │   ├── Post/            # Posts CRUD
    │       │   ├── Comment/         # Comments
    │       │   ├── Friends/         # Friends system
    │       │   ├── Stories/         # Stories feature
    │       │   ├── Payment/         # Payments
    │       │   ├── ImageUpload/     # File uploads
    │       │   └── Meilisearch/     # Search
    │       ├── routes/              # API routes
    │       │   └── index.ts
    │       ├── utils/               # Utilities
    │       └── zod/                 # Validation schemas
    ├── package.json
    └── vercel.json                  # Vercel deployment
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** or **yarn** or **pnpm**
- **MongoDB** (local or Atlas)
- **Cloudinary** account (for image uploads)
- **Google Cloud Console** project (for OAuth)

### Environment Variables

#### Client (`client/.env.local`)

```env
# Next.js
NEXT_PUBLIC_BASE_API=http://localhost:5000/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Gemini AI (optional)
NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

#### Server (`server/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/tech-tips-hub
# or MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/tech-tips-hub

# JWT
JWT_ACCESS_SECRET=your-jwt-access-secret
JWT_REFRESH_SECRET=your-jwt-refresh-secret
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Meilisearch (optional)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-meilisearch-key

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/tech-tips-and-tricks-hub.git
cd tech-tips-and-tricks-hub
```

#### 2. Install dependencies

**Client:**

```bash
cd client
npm install
```

**Server:**

```bash
cd server
npm install
```

#### 3. Set up environment variables

Create `.env.local` in the `client` folder and `.env` in the `server` folder with the variables listed above.

#### 4. Start MongoDB

If using local MongoDB:

```bash
mongod
```

Or use MongoDB Atlas connection string in `DATABASE_URL`.

#### 5. Run the development servers

**Server (Terminal 1):**

```bash
cd server
npm run dev
```

Server runs on `http://localhost:5000`

**Client (Terminal 2):**

```bash
cd client
npm run dev
```

Client runs on `http://localhost:3000`

---

## 🏗 Architecture

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Next.js App                          │
├─────────────────────────────────────────────────────────────┤
│  Pages (App Router)                                          │
│  ┌─────────┐  ┌─────────────┐  ┌──────────────────┐        │
│  │  Auth   │  │ Common Layout│  │ Dashboard Layout │        │
│  └────┬────┘  └──────┬──────┘  └────────┬─────────┘        │
│       │              │                   │                   │
│  ┌────┴──────────────┴───────────────────┴────┐             │
│  │              Components Layer               │             │
│  └──────────────────┬──────────────────────────┘             │
│                     │                                        │
│  ┌──────────────────┴──────────────────────────┐             │
│  │           Hooks (React Query + Custom)       │             │
│  └──────────────────┬──────────────────────────┘             │
│                     │                                        │
│  ┌──────────────────┴──────────────────────────┐             │
│  │              Services (API Calls)            │             │
│  └──────────────────┬──────────────────────────┘             │
│                     │                                        │
│  ┌──────────────────┴──────────────────────────┐             │
│  │        Context (User, Socket, Theme)         │             │
│  └─────────────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────────┘
                          │
                          ▼
              ┌───────────────────────┐
              │   Express Backend     │
              └───────────────────────┘
```

### Backend Architecture (Modular)

```
┌─────────────────────────────────────────────────────────────┐
│                      Express Server                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Routes → Controllers → Services → Models                    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                   Modules                            │    │
│  │  ┌──────┐ ┌──────┐ ┌─────────┐ ┌─────────┐         │    │
│  │  │ Auth │ │ User │ │  Post   │ │ Comment │   ...   │    │
│  │  └──────┘ └──────┘ └─────────┘ └─────────┘         │    │
│  │     │        │          │           │              │    │
│  │  Each module has:                                   │    │
│  │  - route.ts (endpoints)                            │    │
│  │  - controller.ts (request handling)                │    │
│  │  - service.ts (business logic)                     │    │
│  │  - model.ts (Mongoose schema)                      │    │
│  │  - validation.ts (Zod schemas)                     │    │
│  │  - interface.ts (TypeScript types)                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Middlewares                         │    │
│  │  - Authentication (JWT verification)                 │    │
│  │  - Authorization (Role-based access)                 │    │
│  │  - Validation (Zod schema validation)                │    │
│  │  - Error Handling (Global error handler)             │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Socket.io                           │    │
│  │  - Real-time chat                                    │    │
│  │  - Notifications                                     │    │
│  │  - Typing indicators                                 │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| POST   | `/api/v1/auth/register`        | Register new user      |
| POST   | `/api/v1/auth/login`           | Login user             |
| POST   | `/api/v1/auth/refresh-token`   | Refresh access token   |
| POST   | `/api/v1/auth/change-password` | Change password        |
| POST   | `/api/v1/auth/forget-password` | Request password reset |
| POST   | `/api/v1/auth/reset-password`  | Reset password         |

### User Endpoints

| Method | Endpoint                     | Description         |
| ------ | ---------------------------- | ------------------- |
| GET    | `/api/v1/users`              | Get all users       |
| GET    | `/api/v1/users/:id`          | Get user by ID      |
| GET    | `/api/v1/users/me`           | Get current user    |
| PATCH  | `/api/v1/users/me`           | Update current user |
| POST   | `/api/v1/users/follow/:id`   | Follow a user       |
| POST   | `/api/v1/users/unfollow/:id` | Unfollow a user     |
| PATCH  | `/api/v1/users/:id/verify`   | Verify user (Admin) |
| PATCH  | `/api/v1/users/:id/block`    | Block user (Admin)  |

### Post Endpoints

| Method | Endpoint                     | Description     |
| ------ | ---------------------------- | --------------- |
| GET    | `/api/v1/posts`              | Get all posts   |
| GET    | `/api/v1/posts/:id`          | Get post by ID  |
| POST   | `/api/v1/posts`              | Create new post |
| PATCH  | `/api/v1/posts/:id`          | Update post     |
| DELETE | `/api/v1/posts/:id`          | Delete post     |
| POST   | `/api/v1/posts/:id/upvote`   | Upvote post     |
| POST   | `/api/v1/posts/:id/downvote` | Downvote post   |
| POST   | `/api/v1/posts/:id/save`     | Save post       |

### Comment Endpoints

| Method | Endpoint                        | Description           |
| ------ | ------------------------------- | --------------------- |
| GET    | `/api/v1/comments/post/:postId` | Get comments for post |
| POST   | `/api/v1/comments`              | Create comment        |
| PATCH  | `/api/v1/comments/:id`          | Update comment        |
| DELETE | `/api/v1/comments/:id`          | Delete comment        |

### Friends Endpoints

| Method | Endpoint                      | Description           |
| ------ | ----------------------------- | --------------------- |
| GET    | `/api/v1/friends`             | Get friends list      |
| GET    | `/api/v1/friends/requests`    | Get friend requests   |
| POST   | `/api/v1/friends/request/:id` | Send friend request   |
| POST   | `/api/v1/friends/accept/:id`  | Accept friend request |
| POST   | `/api/v1/friends/reject/:id`  | Reject friend request |

---

## 🔥 Key Features Explained

### Real-time Chat System

The chat system uses Socket.io for real-time communication:

```typescript
// Client-side connection
const socket = io(SOCKET_URL, {
  auth: { token: accessToken },
});

// Events
socket.emit("sendMessage", { receiverId, content });
socket.on("newMessage", (message) => {
  /* handle */
});
socket.on("typing", (userId) => {
  /* show indicator */
});
```

### Draft System

Posts can be saved as drafts in localStorage:

```typescript
// Save draft
localStorage.setItem(
  `draft_${draftId}`,
  JSON.stringify({
    title,
    content,
    category,
    tags,
    isPremium,
  }),
);

// Load draft in create-post page via URL params
// /dashboard/create-post?draft=draft_123
```

### Authentication Flow

1. User logs in via credentials or Google OAuth
2. Server returns access token + refresh token
3. Tokens stored in HTTP-only cookies
4. NextAuth session manages client-side state
5. Axios interceptor adds token to requests
6. Refresh token automatically refreshes expired access tokens

### Data Fetching with React Query

```typescript
// Using custom hooks
const { data: posts, isLoading } = useGetPosts(page, limit);
const { mutate: createPost } = useCreatePost();

// Service layer
export const getPosts = async (page: number, limit: number) => {
  const res = await axiosInstance.get(`/posts?page=${page}&limit=${limit}`);
  return res.data;
};
```

---

## 👨‍💻 Development Workflow

### Branch Naming Convention

```
feature/feature-name    # New features
bugfix/bug-description  # Bug fixes
hotfix/critical-fix     # Critical production fixes
```

### Commit Message Format

```
feat: add user profile page
fix: resolve duplicate message issue
docs: update README
refactor: restructure auth hooks
style: format code with prettier
```

### Code Quality

```bash
# Run linter
npm run lint

# Format code
npm run format

# Type check
npm run type-check
```

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push code to GitHub
2. Connect repository to Vercel
3. Set environment variables
4. Deploy

### Backend (Vercel / Railway / Render)

**Vercel:**

```json
// vercel.json
{
  "version": 2,
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
}
```

**Environment Variables:** Set all server `.env` variables in the deployment platform.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'feat: add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write meaningful commit messages
- Update documentation for new features
- Test your changes before submitting PR
- Keep components small and focused

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React Framework
- [NextUI](https://nextui.org/) - UI Components
- [Socket.io](https://socket.io/) - Real-time Engine
- [MongoDB](https://www.mongodb.com/) - Database
- [Cloudinary](https://cloudinary.com/) - Image Storage
- [Vercel](https://vercel.com/) - Deployment Platform

---

<div align="center">
  <p>Made with ❤️ by the Tech Tips Hub Team</p>
  <p>
    <a href="https://github.com/your-username/tech-tips-and-tricks-hub/issues">Report Bug</a>
    ·
    <a href="https://github.com/your-username/tech-tips-and-tricks-hub/issues">Request Feature</a>
  </p>
</div>
