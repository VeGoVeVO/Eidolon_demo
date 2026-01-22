# 👔 Eidolon - Virtual Try-On Fashion Application

> **Mobile Application Development Course Project**  
> A modern React-based virtual try-on experience that allows users to visualize clothing items on themselves before purchasing.

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Technology Stack](#-technology-stack)
4. [Getting Started](#-getting-started)
5. [Project Structure](#-project-structure)
6. [Application Pages](#-application-pages)
7. [Core Components](#-core-components)
8. [Internationalization](#-internationalization)
9. [Testing](#-testing)
10. [Design Decisions](#-design-decisions)

---

## 🎯 Project Overview

**Eidolon** is a frontend presentation of a virtual try-on fashion application built with modern web technologies. The application enables users to:

- Upload their photos and see how different clothing items would look on them
- Manage a personal wardrobe of clothing items
- Browse and create outfit combinations
- Explore a marketplace of fashion items
- Track their usage and activity statistics

This repository contains the **frontend client only** - backend services have been omitted for the course deliverable. Demo data is provided to showcase the full user experience.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Virtual Try-On** | Before/after slider comparison showing clothing items on user photos |
| **User Authentication** | Simulated login flow with Google OAuth integration |
| **Personal Wardrobe** | Manage and categorize owned clothing items |
| **Outfit Builder** | Create and save outfit combinations |
| **Marketplace** | Browse and discover new fashion items |
| **Usage Analytics** | Track uploads, outfits created, and activity statistics |
| **Dark Mode** | Full dark/light theme support with persistent preference |
| **Multi-language** | Internationalization support (English/Spanish) |
| **Responsive Design** | Mobile-first design with desktop optimization |
| **Animated UI** | Smooth page transitions and animated backgrounds |

---

## 🛠 Technology Stack

### Core Framework
- **React 18.2** - Modern UI library with hooks
- **Vite 5.0** - Fast build tool and development server

### Routing & State
- **React Router DOM 6.8** - Client-side routing with protected routes
- **React Context API** - Global state management for language and process tracking

### Styling
- **Tailwind CSS 3.3** - Utility-first CSS framework
- **PostCSS** - CSS processing pipeline
- **Custom CSS** - Component-specific styles

### UI & Animation
- **Framer Motion 11.0** - Page transitions and animations
- **Lucide React** - Modern icon library
- **Recharts 2.15** - Data visualization for usage statistics

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Vitest** - Unit testing framework
- **React Testing Library** - Component testing utilities

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** version 18.0 or higher
- **npm** (comes with Node.js)

### Installation

1. **Clone the repository** (or extract the project files)

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173` (default Vite port)

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build optimized production bundle |
| `npm run preview` | Preview production build locally |
| `npm test` | Run unit tests with Vitest |
| `npm run lint` | Check code with ESLint |
| `npm run format` | Format code with Prettier |

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Main application with routing setup
├── main.jsx                # Application entry point
├── index.css               # Global styles and Tailwind imports
│
├── components/             # Reusable UI components
│   ├── AIStylistModal.jsx      # AI styling recommendations modal
│   ├── AnimatedBackground.jsx  # Animated gradient background
│   ├── BeforeAfterSlider.jsx   # Image comparison slider (key feature)
│   ├── ConfirmationModal.jsx   # Reusable confirmation dialog
│   ├── EidolonLogo.jsx         # Brand logo component
│   ├── FloatingNotification.jsx # Toast notification system
│   ├── Header.jsx              # Page header component
│   ├── ImageUpload.jsx         # Drag-and-drop image upload
│   ├── LoadingOverlay.jsx      # Loading state overlay
│   ├── MobileBottomNav.jsx     # Mobile navigation bar
│   ├── Navigation.jsx          # Main navigation component
│   ├── PageTransition.jsx      # Framer Motion page transitions
│   ├── PrestigeFrame.jsx       # Decorative frame component
│   └── ProcessedImage.jsx      # Processed image display
│
├── pages/                  # Application pages/views
│   ├── Home.jsx            # Landing page (public)
│   ├── LoginPage.jsx       # Authentication page
│   ├── MainApp.jsx         # Profile/main dashboard
│   ├── Wardrobe.jsx        # Clothing items management
│   ├── Outfits.jsx         # Outfit combinations gallery
│   ├── Marketplace.jsx     # Fashion item discovery
│   ├── Usage.jsx           # Usage statistics dashboard
│   ├── Premium.jsx         # Premium subscription page
│   ├── Subscription.jsx    # Subscription management
│   └── NotFound.jsx        # 404 error page
│
├── contexts/               # React Context providers
│   └── ProcessTracker.jsx  # Track image processing state
│
├── i18n/                   # Internationalization
│   ├── LanguageContext.jsx # Language provider and hooks
│   └── translations.js     # Translation strings (EN/ES)
│
├── services/               # Business logic services
│   ├── backgroundRemoval.js # Image background removal
│   └── imageCropping.js     # Auto-crop functionality
│
├── utils/                  # Utility functions
│   ├── apiClient.js        # API request handler
│   ├── demoData.js         # Demo data definitions
│   ├── demoStorage.js      # Local storage demo data
│   └── footDetection.js    # AI foot detection utility
│
└── test/                   # Test files
    ├── setup.js            # Test configuration
    ├── App.test.jsx        # App component tests
    ├── ImageUpload.test.jsx # Upload component tests
    └── LoginPage.test.jsx  # Login page tests
```

---

## 📱 Application Pages

### 1. Home Page (`/`)
- **Purpose:** Public landing page introducing the application
- **Features:** 
  - Animated hero section with parallax effects
  - Feature highlights and call-to-action
  - Dark mode toggle
  - Navigation to login

### 2. Login Page (`/login`)
- **Purpose:** User authentication
- **Features:**
  - Google OAuth integration (simulated)
  - Responsive form design
  - Automatic redirect after login

### 3. Profile/Dashboard (`/profile`)
- **Purpose:** Main user dashboard after authentication
- **Features:**
  - Before/after image comparison slider
  - User photo upload
  - Quick access to main features

### 4. Wardrobe (`/wardrobe`)
- **Purpose:** Manage personal clothing collection
- **Features:**
  - Category filtering (tops, bottoms, shoes, etc.)
  - Grid layout with image preview
  - Copy description functionality

### 5. Outfits (`/outfits`)
- **Purpose:** View and manage outfit combinations
- **Features:**
  - Search functionality
  - Outfit detail modal
  - Before/after comparison
  - Share functionality

### 6. Marketplace (`/marketplace`)
- **Purpose:** Discover new fashion items
- **Features:**
  - Search by title/tags
  - Favorite items
  - Price display

### 7. Usage Statistics (`/usage`)
- **Purpose:** Track user activity and statistics
- **Features:**
  - Upload and outfit counters
  - Progress bars
  - Visual statistics

---

## 🧩 Core Components

### BeforeAfterSlider
The signature component for virtual try-on visualization:
- Draggable slider to compare before/after images
- Touch and mouse support
- Responsive design
- Configurable labels

### ImageUpload
Handles user photo uploads:
- Drag-and-drop support
- File type validation
- Size limit enforcement (10MB)
- Progress indication

### AnimatedBackground
Creates the dynamic visual experience:
- Gradient animations
- Dark mode support
- Performance optimized

### Navigation
Consistent navigation across authenticated pages:
- Mobile bottom navigation
- Desktop sidebar/header
- Active route highlighting

---

## 🌍 Internationalization

The application supports multiple languages using a custom i18n solution:

**Supported Languages:**
- 🇺🇸 English (default)
- 🇪🇸 Spanish

**Implementation:**
- `LanguageContext.jsx` - Context provider with `useLanguage` hook
- `translations.js` - All UI strings organized by language
- Language preference persists in localStorage

**Usage Example:**
```jsx
const { t, changeLanguage } = useLanguage();
return <h1>{t('welcomeMessage')}</h1>;
```

---

## 🧪 Testing

### Test Framework
- **Vitest** - Fast unit testing
- **React Testing Library** - Component testing
- **@testing-library/jest-dom** - Custom matchers

### Running Tests
```bash
# Run all tests
npm test

# Run tests with UI
npm run test:ui
```

### Test Coverage
- `App.test.jsx` - Application routing and rendering
- `ImageUpload.test.jsx` - Upload component functionality
- `LoginPage.test.jsx` - Authentication flow

---

## 💡 Design Decisions

### Architecture Choices

1. **Component-Based Design**
   - Small, reusable components
   - Separation of concerns (pages vs components)
   - Props-driven customization

2. **Context for Global State**
   - Language preference
   - Process tracking
   - Avoiding prop drilling

3. **Demo Data Pattern**
   - `demoStorage.js` provides realistic data
   - Enables full UI demonstration without backend
   - Easy to replace with real API calls

4. **CSS Strategy**
   - Tailwind for rapid development
   - Custom CSS for complex components
   - CSS modules for scoping

### UI/UX Decisions

1. **Mobile-First**
   - Bottom navigation on mobile
   - Touch-friendly interactions
   - Responsive breakpoints

2. **Dark Mode**
   - System preference detection
   - Manual toggle
   - Persistent preference

3. **Visual Feedback**
   - Loading states
   - Toast notifications
   - Smooth transitions

---

## 📝 Notes for Reviewers

- **Backend APIs** are referenced but not functional - demo data is used instead
- **Authentication** is simulated for demonstration purposes
- **Image processing** (background removal) requires backend integration in production
- All **demo data** is loaded from `src/utils/demoStorage.js`

---

## 👤 Author

**Student Project** - Mobile Application Development Course

---

## 📄 License

This project is submitted as a course deliverable and is not intended for production use.
