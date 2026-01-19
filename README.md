# 🔐 PrivaLink - Secure Secret Sharing (Server)

Backend API for PrivaLink - a secure secret-sharing application with end-to-end encryption and self-destructing messages.

## ✨ Features

- **🔐 Secure Secret Storage** - Encrypted secrets with AES-256
- **⏰ TTL-based Auto Deletion** - Automatic cleanup of expired secrets
- **🔑 Password Protection** - Bcrypt-hashed password verification
- **📊 RESTful API** - Clean and well-documented endpoints
- **✅ Input Validation** - Zod schema validation
- **🛡️ Security First** - Helmet, CORS, rate limiting ready

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Validation**: Zod
- **Security**: bcrypt, crypto-js
- **Error Handling**: Custom middleware

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone https://github.com/nayem1816/priva-link-server.git
cd priva-link-server
```

2. Install dependencies

```bash
npm install
```

3. Create environment file

```bash
cp .env.example .env.development
```

4. Update `.env.development` with your configuration

```env
NODE_ENV=development
PORT=8000
MONGODB_URI=mongodb://localhost:27017/privalink
ENCRYPTION_KEY=your-32-character-encryption-key
BCRYPT_SALT_ROUNDS=10
FRONTEND_URL=http://localhost:3000
```

5. Run the development server

```bash
npm run dev
```

Server will start at [http://localhost:8000](http://localhost:8000)

## 📁 Project Structure

```
server/
├── src/
│   ├── app/
│   │   ├── config/          # Configuration
│   │   │   └── config.js
│   │   ├── errors/          # Custom error classes
│   │   │   └── AppError.js
│   │   ├── helpers/         # Utility functions
│   │   │   └── crypto.helper.js
│   │   ├── middlewares/     # Express middlewares
│   │   │   ├── globalErrorHandler.js
│   │   │   └── validateRequest.js
│   │   ├── modules/         # Feature modules
│   │   │   └── Secret/
│   │   │       ├── secret.model.js
│   │   │       ├── secret.controller.js
│   │   │       ├── secret.service.js
│   │   │       ├── secret.route.js
│   │   │       └── secret.validation.js
│   │   └── utils/           # Utility functions
│   │       ├── catchAsync.js
│   │       └── sendResponse.js
│   ├── app.js               # Express app setup
│   └── index.js             # Server entry point
└── package.json
```

## 🔧 API Endpoints

### Create Secret

```http
POST /api/v1/secret
Content-Type: application/json

{
  "content": "Your secret message",
  "password": "optional-password",
  "expirationHours": 24
}
```

**Response:**

```json
{
  "success": true,
  "message": "Secret created successfully",
  "data": {
    "id": "secret-id",
    "url": "http://localhost:3000/secret/secret-id",
    "expiresAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### Check Secret Exists

```http
GET /api/v1/secret/:id
```

**Response:**

```json
{
  "success": true,
  "message": "Secret found",
  "data": {
    "exists": true,
    "hasPassword": false,
    "expiresAt": "2024-01-20T12:00:00.000Z"
  }
}
```

### Reveal Secret

```http
POST /api/v1/secret/:id/reveal
Content-Type: application/json

{
  "password": "optional-password"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Secret revealed and destroyed",
  "data": {
    "content": "Your secret message"
  }
}
```

## 📊 Database Schema

### Secret Model

| Field              | Type   | Description              |
| ------------------ | ------ | ------------------------ |
| `encryptedContent` | String | AES-256 encrypted secret |
| `iv`               | String | Initialization vector    |
| `passwordHash`     | String | Bcrypt hash (optional)   |
| `expirationHours`  | Number | 1, 6, 24, or 168 hours   |
| `expiresAt`        | Date   | Auto-deletion timestamp  |
| `createdAt`        | Date   | Creation timestamp       |

### TTL Index

Secrets are automatically deleted when `expiresAt` is reached using MongoDB TTL index.

## 🔧 Available Scripts

| Command        | Description                      |
| -------------- | -------------------------------- |
| `npm run dev`  | Start with nodemon (development) |
| `npm start`    | Start production server          |
| `npm run lint` | Run ESLint                       |

## 🔒 Security Features

1. **AES-256 Encryption** - Industry standard encryption
2. **Bcrypt Password Hashing** - Secure password storage
3. **Input Validation** - Zod schema validation
4. **CORS Configuration** - Cross-origin security
5. **Error Handling** - No sensitive data in errors
6. **TTL Auto-Deletion** - Automatic cleanup

## 🌐 Environment Variables

| Variable             | Description        | Example                 |
| -------------------- | ------------------ | ----------------------- |
| `NODE_ENV`           | Environment        | `development`           |
| `PORT`               | Server port        | `8000`                  |
| `MONGODB_URI`        | MongoDB connection | `mongodb://...`         |
| `ENCRYPTION_KEY`     | 32-char key        | `your-key-here`         |
| `BCRYPT_SALT_ROUNDS` | Hash rounds        | `10`                    |
| `FRONTEND_URL`       | Client URL         | `http://localhost:3000` |

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Author

**Nayem Islam**

- GitHub: [@nayem1816](https://github.com/nayem1816)

---

⭐ If you found this project useful, please give it a star!
