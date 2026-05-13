// Authentication utilities
const Auth = {
    // Generate unique ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Validate email format
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },

    // Validate password strength
    isValidPassword(password) {
        return password.length >= 6;
    },

    // Sign up new user
    signup(name, email, password) {
        // Validate inputs
        if (!name.trim()) {
            return { success: false, message: 'Name is required' };
        }

        if (!this.isValidEmail(email)) {
            return { success: false, message: 'Please enter a valid email' };
        }

        if (!this.isValidPassword(password)) {
            return { success: false, message: 'Password must be at least 6 characters' };
        }

        // Check if user already exists
        if (Storage.getUserByEmail(email)) {
            return { success: false, message: 'Email already registered' };
        }

        // Create new user
        const newUser = {
            id: this.generateId(),
            name: name.trim(),
            email: email.toLowerCase().trim(),
            password: password, // In real app, this should be hashed
            skills: [],
            createdAt: new Date().toISOString()
        };

        Storage.addUser(newUser);
        return { success: true, message: 'Account created successfully' };
    },

    // Login user
    login(email, password) {
        if (!email || !password) {
            return { success: false, message: 'Email and password are required' };
        }

        const user = Storage.getUserByEmail(email.toLowerCase().trim());
        
        if (!user) {
            return { success: false, message: 'User not found' };
        }

        if (user.password !== password) {
            return { success: false, message: 'Invalid password' };
        }

        Storage.setCurrentUser(user.id);
        return { success: true, message: 'Login successful', user: user };
    },

    // Logout user
    logout() {
        Storage.clearCurrentUser();
    },

    // Check if user is logged in
    isLoggedIn() {
        return Storage.getCurrentUser() !== null;
    },

    // Get current logged in user
    getCurrentUser() {
        return Storage.getCurrentUser();
    }
};