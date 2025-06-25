# WalletApp Frontend

A modern React-based frontend application for a digital wallet system, providing an intuitive interface for account management and financial transactions with real-time updates.

## 🏗️ Architecture Overview

The frontend follows modern React patterns with component-based architecture:

- **Pages** - Main application views (Login, Dashboard)
- **Components** - Reusable UI components for specific functionality
- **Services** - API integration layer with Axios
- **Routing** - Client-side navigation with React Router
- **Styling** - Utility-first CSS with Tailwind CSS

## 🚀 Features

### User Interface
- **Admin Login** - Secure authentication interface
- **Modern Dashboard** - Clean, responsive layout with dark theme
- **Account Management** - Create new wallet accounts with initial balance
- **Account Listing** - Interactive table showing all accounts with owner details
- **Balance Display** - Real-time account balance with formatted currency
- **Money Transfer** - Intuitive transfer interface with validation
- **Real-time Updates** - Automatic refresh of data after transactions

### User Experience
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **Loading States** - Visual feedback during API operations
- **Error Handling** - User-friendly error messages and retry options
- **Form Validation** - Client-side validation with immediate feedback
- **Interactive Elements** - Hover effects and smooth transitions

## 🛠️ Technology Stack

- **React 19** - Modern JavaScript library with latest features
- **Vite** - Fast build tool and development server
- **React Router DOM 7.6** - Client-side routing and navigation
- **Axios 1.10** - HTTP client for API communication
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **PostCSS & Autoprefixer** - CSS processing and browser compatibility
- **ESLint** - Code linting and quality assurance

## 📋 Prerequisites

- **Node.js 16+** (recommended: Node.js 18 or later)
- **npm** or **yarn** package manager
- **Running WalletApp Backend API** (should be accessible at localhost:7298)

## ⚙️ Installation & Setup

### 1. Clone and Install

```bash
# Clone the repository (if not already cloned)
git clone <repository-url>
cd walletapp-frontend

# Install dependencies
npm install
```

### 2. Environment Configuration

Update the API base URL in `src/lib/axios.js` if your backend runs on different ports:

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "https://localhost:7298/api", // Update this URL if needed
  headers: {"Content-Type": "application/json"},
  timeout: 10000, 
});

export default api;
```

### 3. Development Server

```bash
# Start development server
npm run dev
```

The application will be available at: `http://localhost:5173`

### 4. Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔗 API Integration

The frontend integrates with the backend through the following endpoints:

| Frontend Feature | API Endpoint | Method | Purpose |
|-----------------|--------------|---------|---------|
| Login Page | `/api/SystemLogin` | GET | Admin authentication |
| Accounts List | `/api/GetAccounts` | GET | Fetch all accounts |
| Account Creation | `/api/CreateAccount` | POST | Create new account |
| Balance Display | `/api/GetBalanceAccount` | GET | Get account balance |
| Money Transfer | `/api/CreateTransaction` | POST | Transfer funds |

### API Service Configuration

```javascript
// src/lib/axios.js
const api = axios.create({
  baseURL: "https://localhost:7298/api",
  headers: {"Content-Type": "application/json"},
  timeout: 10000, 
});
```

## 🎨 UI Components Overview

### Core Pages

**LoginPage** (`src/pages/LoginPage.jsx`)
- Admin authentication form
- Input validation and error handling
- Automatic navigation to dashboard on success

**DashboardPage** (`src/pages/DashboardPage.jsx`)
- Main application interface
- Component orchestration and state management
- Real-time data refresh coordination

### Key Components

**AccountsList** (`src/components/AccountsList.jsx`)
- Interactive table of all wallet accounts
- Click-to-select functionality
- Real-time refresh capability
- Loading and error states

**AccountBalance** (`src/components/AccountBalance.jsx`)
- Real-time balance display with currency formatting
- Last updated timestamp
- Manual refresh functionality
- Account selection integration

**NewAccount** (`src/components/NewAccount.jsx`)
- Account creation form with validation
- Initial balance setting
- Success/error feedback
- Auto-refresh trigger on success

**NewTransfer** (`src/components/NewTransfer.jsx`)
- Money transfer interface
- Dropdown account selection
- Transfer validation and preview
- Real-time account filtering


## 📁 Project Structure

```
walletapp-frontend/
├── public/
│   ├── vite.svg                 # Vite logo
│   └── index.html               # HTML template
├── src/
│   ├── components/              # Reusable components
│   │   ├── AccountsList.jsx     # Accounts table
│   │   ├── AccountBalance.jsx   # Balance display
│   │   ├── NewAccount.jsx       # Account creation
│   │   └── NewTransfer.jsx      # Money transfer
│   ├── pages/                   # Main pages
│   │   ├── LoginPage.jsx        # Authentication
│   │   └── DashboardPage.jsx    # Main dashboard
│   ├── lib/                     # Utilities
│   │   └── axios.js             # API configuration
│   ├── App.jsx                  # Main app component
│   ├── main.jsx                 # Application entry point
│   └── index.css                # Global styles
├── package.json                 # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── tailwind.config.js          # Tailwind configuration
├── postcss.config.js           # PostCSS configuration
└── eslint.config.js            # ESLint configuration
```

## 🚀 Build and Deployment

### Production Build
```bash
npm run build
```

## 📝 License

This project is licensed under the MIT License.

---

**Built with React 19, Vite, and Tailwind CSS**
