# SkillShare - Connect & Learn Platform

A complete frontend-only web application for connecting people to share and learn skills. Built with pure HTML, CSS, and JavaScript with LocalStorage persistence.

## Features

### 🔐 Authentication System
- **Signup**: Register with name, email, and password
- **Login**: Secure authentication with email validation
- **Session Management**: Persistent login sessions

### 🏠 User Discovery
- **Home Page**: Browse all registered users
- **Profile Cards**: Display user info, skills, and ratings
- **Search & Filter**: Find users by skills or name

### 👤 Profile Management
- **View Profiles**: Detailed user profiles with skills
- **Skill Management**: Add, edit, and remove personal skills
- **Learn Requests**: Request to learn skills from other users

### 📚 Learning System
- **Learn Requests**: Send/receive skill learning requests
- **Request Management**: Accept or reject incoming requests
- **Contact Sharing**: Automatic contact sharing on acceptance

### ⭐ Rating System
- **5-Star Ratings**: Rate other users (1-5 stars)
- **Average Ratings**: Calculated and displayed ratings
- **Rating History**: Track all ratings given and received

### 📊 Dashboard
- **Top Users**: Ranked list of highest-rated users
- **Statistics**: User stats and performance metrics
- **Activity Feed**: Recent platform activity

## Technology Stack

- **Frontend**: Pure HTML5, CSS3, JavaScript (ES6+)
- **Storage**: LocalStorage for data persistence
- **Design**: Responsive design with mobile-first approach
- **No Frameworks**: Built without external dependencies

## File Structure

```
skillshare-app/
├── index.html              # Main HTML file with all pages
├── styles/
│   ├── main.css            # Base styles and variables
│   ├── components.css      # Reusable component styles
│   └── pages.css           # Page-specific styles
├── scripts/
│   ├── app.js              # Main application initialization
│   ├── auth.js             # Authentication management
│   ├── navigation.js       # Page routing and navigation
│   ├── storage.js          # LocalStorage utilities
│   ├── users.js            # User management and display
│   ├── skills.js           # Skill management
│   └── ratings.js          # Rating system and dashboard
└── README.md
```

## Getting Started

1. Clone or download the project files
2. Open `index.html` in a modern web browser
3. Start with the signup page to create your account
4. Explore the platform features

### Demo Accounts

For testing purposes, some demo accounts are pre-loaded:
- **Email**: john@example.com, **Password**: password123
- **Email**: jane@example.com, **Password**: password123
- **Email**: mike@example.com, **Password**: password123

## Features Overview

### User Authentication
- Secure signup with email validation
- Login with persistent sessions
- Logout functionality

### Skill Sharing
- Add unlimited skills to your profile
- Browse other users' skills
- Request to learn specific skills
- Manage incoming learning requests

### Rating System
- Rate users from 1-5 stars
- View average ratings for all users
- Rating-based user rankings

### Responsive Design
- Mobile-friendly interface
- Tablet and desktop optimized
- Clean, modern UI design

## Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Data Persistence

All user data is stored locally in the browser using LocalStorage:
- User accounts and profiles
- Skills and learning requests
- Ratings and reviews
- Session information

**Note**: Data is stored locally and will be lost if browser data is cleared.

## Contributing

This is a demonstration project showcasing frontend web development skills. Feel free to use as a learning resource or starting point for similar projects.

## License

This project is open source and available under the MIT License.