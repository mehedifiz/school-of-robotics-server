# School of Robotics - Backend Server

A comprehensive backend API for a robotics learning platform featuring subscription-based access to educational content, quiz assessments, user progress tracking, and payment integration.

## 🚀 Features

- **Authentication System**: Secure login and registration with OTP verification via SMS
- **Role-Based Authorization**: Different access levels for students and administrators
- **Subscription Management**: Multiple subscription tiers with payment processing
- **Educational Content**: Book and chapter management with progress tracking
- **Quiz System**: Create, attempt, and grade quizzes tied to learning content
- **User Progress Tracking**: Track reading progress and quiz performance
- **Admin Dashboard**: Comprehensive statistics and user management
- **Notification System**: Platform-wide and targeted notices for users

## 💻 Tech Stack

- **Framework**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Payment Gateway**: SSLCommerz
- **Security**: bcrypt for password hashing
- **SMS Service**: Integration for OTP verification
- **Infrastructure**: RESTful API architecture

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB
- SSLCommerz account (for payment processing)
- SMS API account (for OTP verification)

## ⚙️ Installation and Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/school-of-robotics-server.git
   cd school-of-robotics-server
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory and add the following:

   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   # SMS configuration
   smsUrl=your_sms_api_url
   smsApiKey=your_sms_api_key
   smsSenderId=your_sms_sender_id

   # Payment gateway configuration
   STORE_ID=your_sslcommerz_store_id
   STORE_PASSWORD=your_sslcommerz_store_password

   # URLs
   API_URL=frontend_url
   SERVER_URL=backend_url

   PORT=7000
   ```

4. **Start the server**
   ```bash
   npm start
   ```
   For development:
   ```bash
   npm run dev
   ```

## 🔑 API Authentication

The API uses JWT for authentication. Include the token in the Authorization header:

```
Authorization: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 📚 API Documentation

### Authentication

| Method | Endpoint                     | Description                 | Access         |
| ------ | ---------------------------- | --------------------------- | -------------- |
| POST   | `/api/auth/register`         | Register a new user         | Public         |
| POST   | `/api/auth/verify-otp`       | Verify OTP for registration | Public         |
| POST   | `/api/auth/login`            | Login and get token         | Public         |
| POST   | `/api/auth/create-admin`     | Create admin account        | Admin          |
| GET    | `/api/auth/admins`           | Get all admins              | Admin          |
| DELETE | `/api/auth/remove-admin/:id` | Remove an admin             | Admin          |
| POST   | `/api/auth/change-password`  | Change user password        | Student, Admin |
| POST   | `/api/auth/forgot-password`  | Forgot password request     | Public         |
| POST   | `/api/auth/reset-password`   | Reset password with OTP     | Public         |

### Books

| Method | Endpoint                              | Description             | Access         |
| ------ | ------------------------------------- | ----------------------- | -------------- |
| GET    | `/api/book/get-books`                 | Get all books           | Student, Admin |
| GET    | `/api/book/:id`                       | Get book by ID          | Student, Admin |
| POST   | `/api/book/create-book`               | Create a new book       | Admin          |
| PATCH  | `/api/book/:id`                       | Update a book           | Admin          |
| DELETE | `/api/book/:id`                       | Delete a book           | Admin          |
| POST   | `/api/book/add-chapter`               | Add a chapter to a book | Admin          |
| GET    | `/api/book/get-chapter/:bookId`       | Get chapters of a book  | Student, Admin |
| PATCH  | `/api/book/update-chapter/:chapterId` | Update a chapter        | Admin          |
| DELETE | `/api/book/delete-chapter/:chapterId` | Delete a chapter        | Admin          |
| GET    | `/api/book/getAllBooksFree`           | Get free books          | Public         |
| GET    | `/api/book/getBookFree/:bookId`       | Get a free book         | Public         |

### User

| Method | Endpoint                      | Description               | Access         |
| ------ | ----------------------------- | ------------------------- | -------------- |
| GET    | `/api/user/get-user/:id`      | Get user by ID            | Student, Admin |
| GET    | `/api/user/get-all`           | Get all users             | Admin          |
| PATCH  | `/api/user/update-profile`    | Update user profile       | Student, Admin |
| GET    | `/api/user/stats/overview`    | Get user stats overview   | Student, Admin |
| GET    | `/api/user/stats/quiz`        | Get quiz statistics       | Student, Admin |
| GET    | `/api/user/stats/weekly`      | Get weekly performance    | Student, Admin |
| GET    | `/api/user/transactions`      | Get transaction history   | Student, Admin |
| GET    | `/api/user/getBasicStats`     | Get admin dashboard stats | Admin          |
| GET    | `/api/user/revenue-analytics` | Get revenue analytics     | Admin          |

### Reading Progress

| Method | Endpoint                          | Description              | Access         |
| ------ | --------------------------------- | ------------------------ | -------------- |
| GET    | `/api/user/book-progress/:bookId` | Get book progress        | Student, Admin |
| GET    | `/api/user/reading-progress`      | Get all reading progress | Student, Admin |
| POST   | `/api/user/update-last-read`      | Update last read chapter | Student, Admin |
| POST   | `/api/user/mark-chapter-complete` | Mark chapter as complete | Student, Admin |

### Subscription Plans

| Method | Endpoint                               | Description                | Access         |
| ------ | -------------------------------------- | -------------------------- | -------------- |
| GET    | `/api/plan/all`                        | Get all subscription plans | Public         |
| GET    | `/api/plan/:id`                        | Get plan by ID             | Public         |
| POST   | `/api/plan/create`                     | Create a new plan          | Admin          |
| PATCH  | `/api/plan/update/:id`                 | Update a plan              | Admin          |
| DELETE | `/api/plan/delete/:id`                 | Delete a plan              | Admin          |
| POST   | `/api/plan/create-ssl-payment`         | Create payment session     | Student        |
| POST   | `/api/plan/success-payment`            | Payment success callback   | System         |
| GET    | `/api/plan/transaction/:transactionId` | Get transaction by ID      | Student, Admin |

### Quiz

| Method | Endpoint                                   | Description         | Access         |
| ------ | ------------------------------------------ | ------------------- | -------------- |
| GET    | `/api/quiz/get-quiz-by-chapter/:chapterId` | Get quiz by chapter | Student, Admin |
| GET    | `/api/quiz/get-submission/:submissionId`   | Get quiz submission | Student, Admin |
| GET    | `/api/quiz/get-quiz/:quizId`               | Get quiz by ID      | Student, Admin |
| POST   | `/api/quiz/create-quiz`                    | Create a quiz       | Admin          |
| PUT    | `/api/quiz/update-quiz/:quizId`            | Update a quiz       | Admin          |
| DELETE | `/api/quiz/delete-quiz/:quizId`            | Delete a quiz       | Admin          |
| POST   | `/api/quiz/submit-quiz`                    | Submit a quiz       | Student, Admin |

### Notices

| Method | Endpoint                       | Description     | Access         |
| ------ | ------------------------------ | --------------- | -------------- |
| POST   | `/api/notice/create`           | Create a notice | Admin          |
| PUT    | `/api/notice/update/:noticeId` | Update a notice | Admin          |
| DELETE | `/api/notice/delete/:noticeId` | Delete a notice | Admin          |
| GET    | `/api/notice/get-notices`      | Get all notices | Student, Admin |

## 📁 Project Structure

```
school-of-robotics-server/
├── config/               # Configuration files
│   └── mongodb.js        # Database connection
├── controllers/          # Request handlers
├── middleware/           # Custom middleware
├── models/               # MongoDB schemas
├── routes/               # API routes
├── utils/                # Utility functions
├── .env                  # Environment variables
├── .gitignore            # Git ignore file
├── index.js              # Server entry point
├── package.json          # Dependencies and scripts
└── README.md             # Project documentation
```

## 💾 Database Models

The application uses the following main data models:

- **User**: Student and admin profiles
- **Book**: Educational content containers
- **Chapter**: Book sections with content
- **Quiz**: Questions and answers for assessments
- **QuizSubmission**: Student quiz attempts and scores
- **SubscriptionPlan**: Available subscription plans
- **Transaction**: Payment records
- **Notice**: System-wide announcements
- **BookProgress**: User progress in books

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- OTP verification for registration and password reset
- Role-based access control
- Secure payment processing

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Contributors

- [Md Mufazzal Hossain Yamin](https://github.com/Yamin39)
- [Mehedi Hasan Shanto](https://github.com/mehedifiz)
- [Md Arman Khan Yeassin](https://github.com/mdarmankhan6252)
- [Md Mukter Hossain](https://github.com/MukterHossain)
- [Mst: Rebeka Sultana](https://github.com/Rebakum)

## 🤝 Acknowledgements

- [Express.js](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [SSLCommerz](https://sslcommerz.com/)
- [JWT](https://jwt.io/)

## Support

For any questions, issues, or feature requests, please contact the development team at support@schoolofrobotics.com
