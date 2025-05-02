# 🚀 Spaces — Backend API for Real-Time Collaboration

This is the **backend API** for the Spaces platform — a real-time, role-based collaboration tool built for student-supervisor project interaction at Teesside University.

> It supports user authentication, role management, group creation and task management.

---

## 🌐 Frontend Demo

🧪 [Try the frontend here](https://spaces-frontend-lovat.vercel.app)

### 🔐 Demo Login

Use the following credentials to test without signing up:

- **Email:** `japahubs@gmail.com`  
- **Password:** `Qwerty78`

---

## 🛠️ Built With

Backend stack:

- ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
- ![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
- ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)

---

## ✨ Key Features

- 🔐 User authentication with refresh tokens
- 🎓 Role-based accounts: **Student** or **Supervisor**
- 📧 OTP email verification
- 🧱 PostgreSQL (Neon) for database

---

## ⚙️ How To Run the Backend Locally

### 1. Clone the repository

```bash
git clone https://github.com/prosper20/spaces-backend.git
cd spaces-backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create a `.env` file

In the root directory, create a `.env` file with the following variables (values required but not provided here):

```env
# Port
PORT=5000

# PostgreSQL / Prisma
DATABASE_URL=
POSTGRES_USER=
POSTGRES_DB=
POSTGRES_PASSWORD=

# Redis
REDIS_PORT=
REDIS_HOST=
REDIS_URL=
REDIS_PASS=

# JWT Tokens
ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=

# SMTP Email (for OTP)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASSWORD=
```

> These values are required for the server to run correctly. Contact the maintainer if you need access to a `.env` example.

---

### 4. Apply Prisma schema

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Start the development server

```bash
npm run dev
```

> Server runs at:  
> ⚙️ `http://localhost:5000`

---

## 🧩 Project Structure

```bash
spaces-backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── routes/           # API endpoints
│   ├── middleware/       # Auth and validation middleware
│   ├── services/         # Business logic
│   ├── utils/            # Helper functions
│   └── prisma/           # Prisma schema and client
├── .env                  # Environment variables (not committed)
├── prisma/schema.prisma  # Database schema
└── README.md
```

---

## 🧪 Troubleshooting

- Ensure your PostgreSQL and Redis services are reachable.
- Double-check `.env` values and format (no spaces around `=`).
- Use `npx prisma studio` to inspect and debug your DB locally.
- Restart your dev server after any `.env` changes.

---