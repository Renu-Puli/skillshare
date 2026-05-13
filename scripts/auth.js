// Authentication functionality
class AuthManager {
    constructor(storageManager) {
        this.storage = storageManager;
        this.currentUser = null;
        this.init();
    }

    init() {
        // Check if user is already logged in
        this.currentUser = this.storage.getCurrentUser();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }

        // Signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
        }

        // Auth switchers
        const showSignupBtn = document.getElementById('show-signup');
        const showLoginBtn = document.getElementById('show-login');
        
        if (showSignupBtn) {
            showSignupBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.navigationManager.navigateTo('signup');
            });
        }

        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.navigationManager.navigateTo('login');
            });
        }

        // Logout button
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
    }

    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;

        if (!email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        const user = this.storage.findUserByEmail(email);
        
        if (!user) {
            this.showToast('User not found', 'error');
            return;
        }

        if (user.password !== password) {
            this.showToast('Invalid password', 'error');
            return;
        }

        // Login successful
        this.currentUser = user;
        this.storage.setCurrentUser(user);
        this.showToast(`Welcome back, ${user.name}!`, 'success');
        
        // Navigate to home page
        window.navigationManager.navigateTo('home');
    }

    async handleSignup(e) {
        e.preventDefault();
        
        const name = document.getElementById('signup-name').value.trim();
        const email = document.getElementById('signup-email').value.trim();
        const password = document.getElementById('signup-password').value;

        if (!name || !email || !password) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (!this.isValidEmail(email)) {
            this.showToast('Please enter a valid email address', 'error');
            return;
        }

        if (password.length < 6) {
            this.showToast('Password must be at least 6 characters long', 'error');
            return;
        }

        // Check if email already exists
        const existingUser = this.storage.findUserByEmail(email);
        if (existingUser) {
            this.showToast('An account with this email already exists', 'error');
            return;
        }

        // Create new user
        const newUser = {
            id: this.storage.generateId(),
            name,
            email: email.toLowerCase(),
            password,
            skills: [],
            createdAt: new Date().toISOString()
        };

        const users = this.storage.getUsers();
        users.push(newUser);
        this.storage.saveUsers(users);

        this.showToast(`Account created successfully! Please login, ${name}.`, 'success');
        
        // Navigate to login page
        window.navigationManager.navigateTo('login');
    }

    logout() {
        this.currentUser = null;
        this.storage.clearCurrentUser();
        this.showToast('You have been logged out', 'info');
        
        // Navigate to login page
        window.navigationManager.navigateTo('login');
    }

    showLoginPage() {
        window.navigationManager.navigateTo('login');
        document.getElementById('login-form').reset();
    }

    showSignupPage() {
        window.navigationManager.navigateTo('signup');
        document.getElementById('signup-form').reset();
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    isAuthenticated() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    showToast(message, type = 'info') {
        if (window.toastManager) {
            window.toastManager.show(message, type);
        }
    }
}

// Toast notification system
class ToastManager {
    constructor() {
        this.container = document.getElementById('toast-container');
        this.toasts = [];
    }

    show(message, type = 'info', duration = 5000) {
        const toast = this.createToast(message, type);
        this.container.appendChild(toast);
        this.toasts.push(toast);

        // Trigger animation
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // Auto remove
        setTimeout(() => {
            this.remove(toast);
        }, duration);

        return toast;
    }

    createToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const titles = {
            success: 'Success',
            error: 'Error',
            warning: 'Warning',
            info: 'Info'
        };

        toast.innerHTML = `
            <div class="toast-title">${titles[type] || 'Info'}</div>
            <div class="toast-message">${message}</div>
        `;

        // Add click to dismiss
        toast.addEventListener('click', () => {
            this.remove(toast);
        });

        return toast;
    }

    remove(toast) {
        if (toast && toast.parentNode) {
            toast.classList.remove('show');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
                const index = this.toasts.indexOf(toast);
                if (index > -1) {
                    this.toasts.splice(index, 1);
                }
            }, 300);
        }
    }

    clear() {
        this.toasts.forEach(toast => this.remove(toast));
    }
}

// Initialize global instances
window.toastManager = new ToastManager();
window.authManager = new AuthManager(window.storageManager);