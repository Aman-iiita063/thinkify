# Thinkify

Thinkify is a vibrant space where people from diverse backgrounds and interests come together to engage in meaningful conversations, fostering an environment rich in idea exchange, knowledge sharing, and diverse experiences.

# Preview

<img src="/preview.png">
<a href="https://thinkify.vercel.app" target="_blank">Live Preview</a> | <a href="https://thinkify-server.vercel.app" target="_blank">Live API</a> | <a href="https://documenter.getpostman.com/view/27027258/2sA3dxEXJh" target="_blank">Postman</a>

# Requirements

[Install Node On Your Device](https://nodejs.org/)

# How to Run

```bash
git clone https://github.com/Aman-iiita063/thinkify.git

# BACKEND
cd server
npm install
npm run dev

# FRONTEND
cd ../client
npm install
npm run dev
```

# Environment Variables

## Frontend

```
VITE_SERVER_ENDPOINT = https://thinkify-server.vercel.app:3000/api
VITE_TOKEN_KEY = thinkify
VITE_USER_ROLE = role
VITE_COOKIE_EXPIRES = 1
VITE_GOOGLE_CLIENT_ID= YOUR_CLIENT_ID
```

## Backend

```
PORT = 3000
DATABASE_URL = mongodb://localhost:27017/
DATABASE_NAME = thinkify
BCRYPT_GEN_SALT_NUMBER = 10
JWT_SECRET_KEY = abcdefghijklmnopqrstuvwxyz
COOKIE_EXPIRES = 5d
COOKIE_KEY = thinkify
UPLOAD_DIRECTORY = uploads
```

# Features

## Admin

- Profile
  - Last Month User Activity
  - Role Based User Distribution
- Users Management
- Sign Out

## Student

- Profile
- Add Post
- My Posts
- Add Product
- My Products
- Task Manager
- Setting
  - Change Password
- Sign Out

## Teacher/Institution

- All Student Features
- Assignments Management
  - Create assignments with deadlines
  - Grade student submissions
  - Track submission status
- Polls Management
  - Create single/multiple choice polls
  - Anonymous voting support
  - Real-time results
- Resource Sharing
  - Upload, download, and manage educational resources
  - Track download statistics
  - Public/private visibility
- Test Management
  - Create comprehensive tests
  - Multiple question types
  - Auto-grading for MCQs
  - Manual grading for essays

# Major Recent Changes & Improvements

## UI/UX Overhaul

- **Modern Material-UI Theme:** Unified color palette, typography, and component styling.
- **Responsive Design:** Mobile-first, adaptive layouts.
- **Sidebar & Header Fixes:** Sidebar no longer overlaps header; main content and header shift right on desktop.
- **Modern Navigation:** Glass effect, improved branding, and responsive NavBar.
- **Enhanced Sidebar:** User avatar, role display, and improved navigation states.
- **Modern Footer:** Social icons, contact info, and responsive layout.
- **Loading & Alerts:** Modern loading spinner and animated alert notifications.
- **AddPost & Dashboard:** Card-based layouts, live preview, and stat cards.
- **Consistent Animations:** Smooth transitions, hover effects, and focus states.

## Backend & API

- **Public Post Feed:** All users can view, like, comment, and share posts.
- **Role-based Filtering:** Students see only active tests; teachers see all.
- **Test Creation/Editing:** Default to active status, improved filtering.
- **Post System:** Any user can create posts, visible to all, with like/comment/share.
- **Improved Validation:** Tags are now optional for posts.
- **Cleaner Error Handling:** Better feedback and loading states.

# High-Level Architecture

```mermaid
graph TD
  subgraph Frontend (React + MUI)
    A[NavBar] --> B[Sidebar]
    B --> C[Main Content]
    C --> D[Pages: Home, Posts, Tests, Assignments, Dashboard, etc.]
    C --> E[Components: Banner, AlertBox, LoadingSpinner, etc.]
  end

  subgraph Backend (Node.js + Express)
    F[API Routes]
    F --> G[Controllers]
    G --> H[Models (MongoDB)]
    F --> I[Middleware (Auth, Upload, etc.)]
  end

  D <--> F
  E <--> F
```

**Frontend:**

- React + Material-UI for UI
- Context API for global state (alerts, loading)
- Responsive layouts, modern theming, and smooth navigation

**Backend:**

- Node.js + Express REST API
- MongoDB for data storage (users, posts, products, tasks, tests, polls, assignments, resources)
- JWT authentication, role-based access, file uploads

**Key Flows:**

- All users can view and interact with public posts
- Role-based access for assignments, tests, and resources
- Real-time feedback via alerts and loading spinners
- Modern, consistent UI across all pages

# Design Idea

- **Sidebar:** Permanent on desktop, collapsible on mobile. Shows user info, navigation, and role.
- **Header:** Always visible, shifts right when sidebar is present.
- **Main Content:** Card-based, clean, and visually separated.
- **Footer:** Social links, contact info, and legal.
- **Color Scheme:** #59e3a7 (primary), #1b2e35 (secondary), white backgrounds, subtle gradients.
- **Typography:** Platypi for headings, Inter for body.

# API Endpoints

## Assignments

- `GET /api/assignments` - Get all assignments
- `POST /api/assignments` - Create assignment
- `GET /api/assignments/:id` - Get assignment details
- `POST /api/assignments/:id/submit` - Submit assignment
- `POST /api/assignments/:id/grade/:studentId` - Grade assignment
- `PUT /api/assignments/:id` - Update assignment
- `DELETE /api/assignments/:id` - Delete assignment

## Polls

- `GET /api/polls` - Get all polls
- `POST /api/polls` - Create poll
- `GET /api/polls/:id` - Get poll details
- `POST /api/polls/:id/vote` - Vote in poll
- `PUT /api/polls/:id` - Update poll
- `DELETE /api/polls/:id` - Delete poll

## Resources

- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource
- `GET /api/resources/:id` - Get resource details
- `POST /api/resources/:id/download` - Download resource
- `PUT /api/resources/:id` - Update resource
- `DELETE /api/resources/:id` - Delete resource

## Tests

- `GET /api/tests` - Get all tests
- `POST /api/tests` - Create test
- `GET /api/tests/:id` - Get test details
- `POST /api/tests/:id/submit` - Submit test
- `PUT /api/tests/:id` - Update test
- `DELETE /api/tests/:id` - Delete test

## Google OAuth

- `POST /api/google/login` - Google OAuth login

## Analytics

- `GET /api/admin/analytics` - Get analytics dashboard data

## Tasks

- `GET /api/tasks/:id` - Get task details
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `PATCH /api/tasks/:id/status` - Update task status

# Contribution Ideas

- Google signup/signin integration
- Single Product Sell Page
- View Task Details
- View User Details (public)
- Edit user, post, product
- Loading View
- Real-time notifications
- Advanced analytics
- File upload system
- Mobile app development

# Data Models (Summary)

## Assignments

- title, description, subject, deadline, total marks, status, audience

## Polls

- title, description, type(single, multiple), options, deadline, status, anonymous member, audience

## Resource

- title, description, visibility, url, audience

## Tests

- title, description, subject, duration, questions, start/end dates, audience

# License

MIT
