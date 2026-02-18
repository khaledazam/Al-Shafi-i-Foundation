# مؤسسة الشافعي | Al-Shafi'i Foundation
### Premium Paint & Interior Decoration Platform

A full-stack web application featuring an interactive wall color simulator for customers and a comprehensive admin dashboard for product management.

---

## 🎨 Features

### Customer Side (Landing Page)
- **Interactive 3D Wall Color Simulator**
  - Real-time wall color visualization
  - Multiple wall selection (4 walls + ceiling)
  - Before/After comparison toggle
  - 12+ preset color palette + custom color picker
  - GSAP-powered smooth animations
  - Save and share simulations

- **Product Showcase**
  - Responsive product grid
  - Advanced filtering (category, price, search)
  - Product cards with images, colors, and prices
  - Mobile-first design

- **Bilingual Support**
  - Arabic (RTL) and English
  - Language toggle

### Admin Side (Dashboard)
- **JWT Authentication**
  - Secure login system
  - Protected routes

- **Product Management (CRUD)**
  - Add, edit, delete products
  - Bilingual product information (AR/EN)
  - Multi-color management
  - Stock tracking
  - Category organization

- **Discount Management**
  - Create time-based discounts
  - Set minimum quantities
  - Product-specific discounts

- **Analytics & Reports**
  - Most selected colors (Bar chart)
  - Simulations per product (Line chart)
  - Dashboard KPI cards
  - Real-time statistics

- **Dark Mode**
  - Full dark mode support across all pages

---

## 🚀 Tech Stack

### Frontend
- **React 18** - UI library
- **Tailwind CSS 3** - Styling
- **GSAP** - Animations
- **React Router DOM** - Routing
- **Recharts** - Data visualization
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JSON Web Token (JWT)** - Authentication
- **Bcrypt.js** - Password hashing
- **Multer** - File uploads
- **Express Validator** - Input validation

---

## 📦 Installation

### Prerequisites
- Node.js (v16+)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file (already created, modify as needed)
# PORT=5000
# MONGODB_URI=mongodb://localhost:27017/al-shafii-foundation
# JWT_SECRET=your-secret-key

# Create uploads directory
mkdir -p uploads/products

# Seed admin user (optional)
npm run seed

# Start development server
npm run dev
```

Default admin credentials after seeding:
- **Email:** admin@alshafii.com
- **Password:** admin123456

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will run on `http://localhost:3000` and proxy API requests to `http://localhost:5000`.

---

## 📁 Project Structure

```
Al-Shafi'i Foundation/
├── backend/
│   ├── controllers/          # Request handlers
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API routes
│   ├── middleware/           # Auth & upload middleware
│   ├── utils/                # Helper functions
│   ├── uploads/              # Uploaded images
│   ├── server.js             # Entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── landing/      # Landing page components
│   │   │   └── admin/        # Admin components
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   └── admin/        # Admin pages
│   │   ├── context/          # React Context providers
│   │   ├── utils/            # Utilities (API client)
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── tailwind.config.js    # Tailwind configuration
│   ├── vite.config.js        # Vite configuration
│   └── package.json
└── README.md
```

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Admin login
- `GET /api/auth/verify` - Verify token

### Products
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)
- `POST /api/products/bulk-upload` - Bulk upload (admin)

### Simulations
- `POST /api/simulations` - Save simulation
- `GET /api/simulations/stats` - Get statistics (admin)

### Discounts
- `GET /api/discounts` - Get all discounts
- `POST /api/discounts` - Create discount (admin)
- `PUT /api/discounts/:id` - Update discount (admin)
- `DELETE /api/discounts/:id` - Delete discount (admin)

### Analytics
- `GET /api/analytics/popular-colors` - Most selected colors (admin)
- `GET /api/analytics/simulation-count` - Simulations per product (admin)
- `GET /api/analytics/overview` - Dashboard overview (admin)

---

## 🎯 Key Features Showcase

### Wall Color Simulator
The simulator uses SVG to create a 3D room perspective with interactive walls. GSAP provides smooth color transitions when users select different colors. The component tracks:
- 4 walls + ceiling (5 selectable surfaces)
- Real-time color changes
- Before/After state comparison
- Color persistence for simulation saving

### Product Management
Full CRUD interface with:
- Bilingual fields (Arabic/English)
- Dynamic color palette management
- Multi-image upload support (via Multer)
- Real-time validation

### Analytics Dashboard
Recharts integration for:
- Bar charts (popular colors)
- Line charts (simulation trends)
- KPI cards with live data
- Responsive design for mobile

---

## 🌙 Dark Mode
Full dark mode implementation using:
- Tailwind's dark mode class strategy
- React Context for state management
- LocalStorage persistence
- Smooth transitions

---

## 🌍 Internationalization (i18n)
- Language Context for state management
- RTL support for Arabic
- Dynamic direction switching
- Bilingual content throughout

---

## 🔒 Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- CORS configuration
- Input validation

---

## 📱 Responsive Design
- Mobile-first approach
- Breakpoints: sm, md, lg, xl
- Touch-friendly interfaces
- Optimized for all devices

---

## 🎨 Color Palette
- **Primary (Coral):** #f43f5e
- **Secondary (Teal):** #14b8a6
- **Navy:** #0f172a
- Custom Tailwind theme with extended colors

---

## 🚧 Future Enhancements
- [ ] Cloud image storage (Cloudinary integration)
- [ ] Advanced CSV bulk upload with preview
- [ ] Email notifications for saved simulations
- [ ] Customer accounts and order history
- [ ] Real-time collaboration on simulations
- [ ] AR visualization using device camera
- [ ] Multi-language support (more languages)

---

## 📝 License
This project is created for demonstration purposes.

---

## 👨‍💻 Development

### Backend Development
```bash
cd backend
npm run dev  # Uses nodemon for auto-reload
```

### Frontend Development
```bash
cd frontend
npm run dev  # Vite dev server with HMR
```

### Production Build
```bash
# Frontend
cd frontend
npm run build

# Backend (standard Node.js)
cd backend
npm start
```

---

## 🤝 Contributing
This is a portfolio/demo project. Feel free to fork and customize!

---

## 📧 Contact
For questions or feedback about this project, please reach out through the repository.

---

**Built with ❤️ using React, Node.js, Express, MongoDB, Tailwind CSS, and GSAP**
