🚀 HOMEGATE PROJECT - QUICK START GUIDE

✅ DATABASE SETUP:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Open MongoDB Compass
2. Database name: "homegate" (will auto-create when you run the project)
3. Connection: mongodb://localhost:27017/homegate

✅ ENVIRONMENT SETUP COMPLETE:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Frontend (.env):
- REACT_APP_BASE_URL=http://localhost:4000 ✓

Backend (.env):
- PORT=4000 ✓
- MONGO_URI=mongodb://localhost:27017/homegate ✓
- CORS_ORIGIN=["http://localhost:3000"] ✓

🎯 HOW TO RUN THE PROJECT:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

OPTION 1 - RUN BOTH TOGETHER (RECOMMENDED):
└─ Command: npm run dev
└─ Frontend: http://localhost:3000
└─ Backend: http://localhost:4000

OPTION 2 - RUN SEPARATELY:
Terminal 1 (Frontend):
└─ npm install
└─ npm start

Terminal 2 (Backend):
└─ cd server
└─ npm install
└─ npm run server

📝 FEATURES:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✓ User Registration with Email OTP Verification
✓ User Login
✓ Pet Listing and Adoption Form
✓ Admin Panel
✓ Pet Management
✓ Email Notifications
✓ JWT Authentication
✓ MongoDB Database

🔗 API ENDPOINTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
POST   /api/user                 - Register User
POST   /api/user/login           - Login User
POST   /api/user/sendotp         - Send OTP
POST   /api/user/verifyotp       - Verify OTP
GET    /requests                 - Get Pending Pets
GET    /approvedPets             - Get Approved Pets
GET    /adoptedPets              - Get Adopted Pets
POST   /services                 - Post New Pet
PUT    /approving/:id            - Approve Pet
DELETE /delete/:id               - Delete Pet
POST   /form/adopt-form          - Submit Adoption Form

💡 TROUBLESHOOTING:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
❌ "Cannot connect to MongoDB"
✓ Make sure MongoDB is running
✓ Check MONGO_URI in server/.env

❌ "API errors/404"
✓ Make sure backend is running on port 4000
✓ Check CORS_ORIGIN setting

❌ "Page not loading"
✓ Make sure frontend is running on port 3000
✓ Clear browser cache (Ctrl+Shift+Delete)

