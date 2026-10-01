# 🖥️ Tech Tips & Tricks Hub - Backend Server

A robust Express.js backend API with MongoDB, Socket.io for real-time features, and comprehensive authentication system.

![Express.js](https://img.shields.io/badge/Express.js-4.21-black?style=flat-square&logo=express)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue?style=flat-square&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose_8-green?style=flat-square&logo=mongodb)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-black?style=flat-square&logo=socket.io)

---

## 📑 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Socket.io Events](#-socketio-events)
- [Database Models](#-database-models)
- [Middleware](#-middleware)
- [Error Handling](#-error-handling)
- [Deployment](#-deployment)

---

## ✨ Features

- **RESTful API** - Clean, well-structured API endpoints
- **JWT Authentication** - Secure access & refresh token system
- **Social Login** - Google OAuth integration
- **Real-time Communication** - Socket.io for chat & notifications
- **File Upload** - Cloudinary integration for image storage
- **Search Engine** - Meilisearch integration for fast search
- **Email Service** - Nodemailer with Handlebars templates
- **Input Validation** - Zod schema validation
- **Error Handling** - Centralized error handling with custom error classes
- **Database Seeding** - Admin user seeding on startup
- **Subscription System** - Auto-check user subscription status

---

## 🛠 Tech Stack

| Technology  | Purpose              |
| ----------- | -------------------- |
| Express.js  | Web framework        |
| TypeScript  | Type safety          |
| MongoDB     | Database             |
| Mongoose    | ODM                  |
| Socket.io   | Real-time events     |
| JWT         | Authentication       |
| bcryptjs    | Password hashing     |
| Cloudinary  | Image storage        |
| Multer      | File upload handling |
| Nodemailer  | Email service        |
| Handlebars  | Email templates      |
| Zod         | Request validation   |
| Meilisearch | Search engine        |

---

## 📁 Project Structure

```
server/
├── src/
│   ├── app.ts                    # Express app configuration
│   ├── server.ts                 # Server entry point
│   └── app/
│       ├── builder/
│       │   └── QueryBuilder.ts   # MongoDB query builder utility
│       │
│       ├── config/
│       │   ├── index.ts          # Environment config
│       │   ├── cloudinary.config.ts
│       │   └── multer.config.ts
│       │
│       ├── errors/
│       │   ├── AppError.ts       # Custom error class
│       │   ├── handleCastError.ts
│       │   ├── handlerDuplicateError.ts
│       │   ├── handleValidationError.ts
│       │   └── handleZodError.ts
│       │
│       ├── interfaces/
│       │   ├── error.interface.ts
│       │   ├── image.interface.ts
│       │   └── index.d.ts        # Global type declarations
│       │
│       ├── middlewares/
│       │   ├── auth.ts           # JWT authentication
│       │   ├── bodyParser.ts     # Parse multipart body
│       │   ├── globalErrorHandler.ts
│       │   ├── notFound.ts
│       │   ├── validateImageFileRequest.ts
│       │   └── validateRequest.ts
│       │
│       ├── modules/              # Feature modules
│       │   ├── Auth/
│       │   │   ├── auth.controller.ts
│       │   │   ├── auth.interface.ts
│       │   │   ├── auth.route.ts
│       │   │   ├── auth.service.ts
│       │   │   └── auth.validation.ts
│       │   │
│       │   ├── User/
│       │   │   ├── user.constant.ts
│       │   │   ├── user.controller.ts
│       │   │   ├── user.interface.ts
│       │   │   ├── user.model.ts
│       │   │   ├── user.route.ts
│       │   │   ├── user.service.ts
│       │   │   └── user.validation.ts
│       │   │
│       │   ├── Post/
│       │   │   ├── post.constant.ts
│       │   │   ├── post.controller.ts
│       │   │   ├── post.interface.ts
│       │   │   ├── post.model.ts
│       │   │   ├── post.route.ts
│       │   │   ├── post.service.ts
│       │   │   ├── post.utils.ts
│       │   │   └── post.validation.ts
│       │   │
│       │   ├── Comment/          # Post comments
│       │   ├── Friends/          # Friend system
│       │   ├── Stories/          # 24-hour stories
│       │   ├── Payment/          # Subscription payments
│       │   ├── ImageUpload/      # Image handling
│       │   └── Meilisearch/      # Search functionality
│       │
│       ├── routes/
│       │   └── index.ts          # Route aggregator
│       │
│       ├── socket/
│       │   └── socket.ts         # Socket.io configuration
│       │
│       ├── utils/
│       │   ├── catchAsync.ts     # Async error wrapper
│       │   ├── seeding.ts        # Database seeding
│       │   ├── checkUserSubscriptions.ts
│       │   ├── sendResponse.ts
│       │   ├── sendEmail.ts
│       │   └── pick.ts
│       │
│       └── zod/
│           └── image.validation.ts
│
├── package.json
├── tsconfig.json
├── eslint.config.mjs
└── vercel.json                   # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **MongoDB** (local or Atlas)
- **Cloudinary** account
- **Meilisearch** instance (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mehedihasan444/tech-tips-and-tricks-hub-frontend.git

# Navigate to server directory
cd tech-tips-and-tricks-hub/client/server

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
npm run dev

# Build for production
npm run build

# Run production server
npm run start:prod
```

---

## 🔐 Environment Variables

Create a `.env` file in the server root:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=mongodb://localhost:27017/tech-tips-hub
# Or MongoDB Atlas:
# DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/tech-tips-hub

# JWT Secrets
JWT_ACCESS_SECRET=your-super-secret-access-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
JWT_ACCESS_EXPIRES_IN=1d
JWT_REFRESH_EXPIRES_IN=30d

# Bcrypt
BCRYPT_SALT_ROUNDS=12

# Cloudinary (Image Upload)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (Nodemailer)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Meilisearch (Optional)
MEILISEARCH_HOST=http://localhost:7700
MEILISEARCH_API_KEY=your-meilisearch-key

# Frontend URL (CORS)
CLIENT_URL=http://localhost:3000

# Admin Seeding
ADMIN_EMAIL=admin@techtips.com
ADMIN_PASSWORD=Admin@123
```

---

## 📚 API Endpoints

### Base URL: `/api/v1`

### Authentication (`/auth`)

| Method | Endpoint                | Description            | Auth   |
| ------ | ----------------------- | ---------------------- | ------ |
| POST   | `/auth/register`        | Register new user      | ❌     |
| POST   | `/auth/login`           | Login with credentials | ❌     |
| POST   | `/auth/social-login`    | Login via Google       | ❌     |
| POST   | `/auth/refresh-token`   | Refresh access token   | Cookie |
| POST   | `/auth/forget-password` | Request password reset | ❌     |
| POST   | `/auth/reset-password`  | Reset password         | ✅     |

### Users (`/users`)

| Method | Endpoint                      | Description          | Auth  |
| ------ | ----------------------------- | -------------------- | ----- |
| GET    | `/users`                      | Get all users        | ❌    |
| GET    | `/users/:nickName`            | Get user by nickname | ❌    |
| POST   | `/users/create-user`          | Create user (Admin)  | Admin |
| PUT    | `/users/:id`                  | Follow/Unfollow user | ❌    |
| PUT    | `/users/update-profile-photo` | Update profile photo | ❌    |
| DELETE | `/users/:id`                  | Delete user          | Admin |

### Posts (`/posts`)

| Method | Endpoint     | Description     | Auth |
| ------ | ------------ | --------------- | ---- |
| GET    | `/posts`     | Get all posts   | ❌   |
| GET    | `/posts/:id` | Get single post | ❌   |
| POST   | `/posts`     | Create post     | User |
| PUT    | `/posts/:id` | Update post     | User |
| DELETE | `/posts/:id` | Delete post     | User |

### Comments (`/comments`)

| Method | Endpoint                 | Description           | Auth |
| ------ | ------------------------ | --------------------- | ---- |
| GET    | `/comments/post/:postId` | Get comments for post | ❌   |
| POST   | `/comments`              | Create comment        | User |
| PUT    | `/comments/:id`          | Update comment        | User |
| DELETE | `/comments/:id`          | Delete comment        | User |

### Friends (`/friends`)

| Method | Endpoint               | Description         | Auth |
| ------ | ---------------------- | ------------------- | ---- |
| GET    | `/friends`             | Get friends list    | User |
| GET    | `/friends/requests`    | Get friend requests | User |
| POST   | `/friends/request/:id` | Send friend request | User |
| POST   | `/friends/accept/:id`  | Accept request      | User |
| POST   | `/friends/reject/:id`  | Reject request      | User |

### Stories (`/stories`)

| Method | Endpoint       | Description     | Auth |
| ------ | -------------- | --------------- | ---- |
| GET    | `/stories`     | Get all stories | User |
| POST   | `/stories`     | Create story    | User |
| DELETE | `/stories/:id` | Delete story    | User |

### Payment (`/payment`)

| Method | Endpoint           | Description         | Auth |
| ------ | ------------------ | ------------------- | ---- |
| POST   | `/payment/create`  | Create payment      | User |
| GET    | `/payment/history` | Get payment history | User |

### Search (`/search-posts`)

| Method | Endpoint                  | Description  | Auth |
| ------ | ------------------------- | ------------ | ---- |
| GET    | `/search-posts?q=keyword` | Search posts | ❌   |

### Image Upload (`/image-upload`)

| Method | Endpoint        | Description  | Auth |
| ------ | --------------- | ------------ | ---- |
| POST   | `/image-upload` | Upload image | User |

---

## 🔌 Socket.io Events

### Connection

```typescript
// Client connects with auth token
io.connect(SOCKET_URL, {
  auth: { token: accessToken },
});
```

### Events

| Event          | Direction       | Payload                   | Description           |
| -------------- | --------------- | ------------------------- | --------------------- |
| `connection`   | Server          | -                         | Client connected      |
| `disconnect`   | Server          | -                         | Client disconnected   |
| `join`         | Client → Server | `userId`                  | Join user room        |
| `sendMessage`  | Client → Server | `{ receiverId, content }` | Send chat message     |
| `newMessage`   | Server → Client | `Message`                 | Receive new message   |
| `typing`       | Client → Server | `{ receiverId }`          | User is typing        |
| `userTyping`   | Server → Client | `userId`                  | Show typing indicator |
| `stopTyping`   | Client → Server | `{ receiverId }`          | User stopped typing   |
| `notification` | Server → Client | `Notification`            | New notification      |
| `onlineUsers`  | Server → Client | `string[]`                | Online users list     |

### Example Usage

```typescript
// Server-side
io.on("connection", (socket) => {
  socket.on("join", (userId) => {
    socket.join(userId);
  });

  socket.on("sendMessage", async (data) => {
    const message = await saveMessage(data);
    io.to(data.receiverId).emit("newMessage", message);
  });
});
```

---

## 🗄️ Database Models

### User Model

```typescript
interface IUser {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  profilePhoto?: string;
  coverPhoto?: string;
  nickName: string;
  role: "USER" | "ADMIN";
  status: "ACTIVE" | "BLOCKED";
  isVerified: boolean;
  isPremium: boolean;
  subscriptionExpiry?: Date;
  followers: ObjectId[];
  following: ObjectId[];
  bio?: string;
  dateOfBirth?: Date;
  phone?: string;
  address?: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Post Model

```typescript
interface IPost {
  _id: ObjectId;
  title: string;
  content: string;
  author: ObjectId;
  images: string[];
  category: string;
  tags: string[];
  isPremium: boolean;
  upvotes: ObjectId[];
  downvotes: ObjectId[];
  comments: ObjectId[];
  savedBy: ObjectId[];
  views: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Comment Model

```typescript
interface IComment {
  _id: ObjectId;
  content: string;
  author: ObjectId;
  post: ObjectId;
  parentComment?: ObjectId;
  replies: ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🛡️ Middleware

### Authentication Middleware

```typescript
// Usage in routes
router.get("/protected", auth(USER_ROLE.USER), controller);
router.get("/admin-only", auth(USER_ROLE.ADMIN), controller);
```

### Validation Middleware

```typescript
// Validate request body with Zod
router.post("/posts", validateRequest(PostValidation.createPostValidationSchema), controller);
```

### File Upload Middleware

```typescript
// Handle multipart form data
router.post(
  "/upload",
  multerUpload.fields([{ name: "images", maxCount: 3 }]),
  validateImageFileRequest(ImageFilesArrayZodSchema),
  parseBody,
  controller,
);
```

---

## ⚠️ Error Handling

### Custom Error Class

```typescript
class AppError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Usage
throw new AppError(httpStatus.NOT_FOUND, "Post not found");
```

### Error Types Handled

- **Zod Validation Errors** - Invalid request data
- **Mongoose Cast Errors** - Invalid ObjectId
- **Mongoose Validation Errors** - Schema validation failures
- **Duplicate Key Errors** - Unique constraint violations
- **JWT Errors** - Token expired/invalid
- **Custom App Errors** - Business logic errors

### Error Response Format

```json
{
  "success": false,
  "message": "Error message here",
  "errorSources": [
    {
      "path": "field_name",
      "message": "Specific error for this field"
    }
  ],
  "stack": "Error stack trace (development only)"
}
```

---

## 🚢 Deployment

### Vercel Deployment

The server includes a `vercel.json` configuration:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/server.js"
    }
  ]
}
```

**Steps:**

1. Build the project: `npm run build`
2. Push to GitHub
3. Connect repository to Vercel
4. Set environment variables in Vercel dashboard
5. Deploy

### Railway / Render Deployment

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set start command: `npm run start:prod`
4. Add all environment variables
5. Deploy

---

## 📜 Scripts

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
    "build": "tsc",
    "start:prod": "node ./dist/server.js",
    "lint": "npx eslint .",
    "lint:fix": "npx eslint . --fix"
  }
}
```

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm run dev`        | Start development server with hot reload |
| `npm run build`      | Compile TypeScript to JavaScript         |
| `npm run start:prod` | Start production server                  |
| `npm run lint`       | Check for linting errors                 |
| `npm run lint:fix`   | Auto-fix linting errors                  |

---

## 🔧 Query Builder

The `QueryBuilder` class provides a fluent API for building MongoDB queries:

```typescript
const query = new QueryBuilder(Post.find(), queryParams)
  .search(["title", "content"])
  .filter()
  .sort()
  .paginate()
  .fields();

const posts = await query.modelQuery;
const meta = await query.countTotal();
```

**Features:**

- Search across multiple fields
- Filter by query parameters
- Sort by any field
- Pagination with limit/page
- Field selection

---

## 📄 License

This project is licensed under the MIT License.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/new-feature`)
3. Commit changes (`git commit -m 'feat: add new feature'`)
4. Push to branch (`git push origin feature/new-feature`)
5. Open Pull Request

---

<div align="center">
  <p>Built with ❤️ for the Tech Tips & Tricks Hub</p>
</div>
