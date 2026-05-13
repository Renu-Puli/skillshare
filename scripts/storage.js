// LocalStorage management utilities
class StorageManager {
    constructor() {
        this.keys = {
            USERS: 'skillshare_users',
            CURRENT_USER: 'skillshare_current_user',
            LEARN_REQUESTS: 'skillshare_learn_requests',
            RATINGS: 'skillshare_ratings',
            SHARED_CONTACTS: 'skillshare_shared_contacts',
            DOUBTS: 'skillshare_doubts',
            QUIZ_ATTEMPTS: 'skillshare_quiz_attempts'
        };
        this.initializeStorage();
    }

    initializeStorage() {
        // Initialize empty arrays if they don't exist
        if (!this.getItem(this.keys.USERS)) {
            this.setItem(this.keys.USERS, []);
        }
        if (!this.getItem(this.keys.LEARN_REQUESTS)) {
            this.setItem(this.keys.LEARN_REQUESTS, []);
        }
        if (!this.getItem(this.keys.RATINGS)) {
            this.setItem(this.keys.RATINGS, []);
        }
        if (!this.getItem(this.keys.SHARED_CONTACTS)) {
            this.setItem(this.keys.SHARED_CONTACTS, []);
        }
        if (!this.getItem(this.keys.DOUBTS)) {
            this.setItem(this.keys.DOUBTS, []);
        }
        if (!this.getItem(this.keys.QUIZ_ATTEMPTS)) {
            this.setItem(this.keys.QUIZ_ATTEMPTS, []);
        }
    }

    setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Error saving to localStorage:', error);
            return false;
        }
    }

    getItem(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (error) {
            console.error('Error reading from localStorage:', error);
            return null;
        }
    }

    removeItem(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Error removing from localStorage:', error);
            return false;
        }
    }

    // User management
    getUsers() {
        return this.getItem(this.keys.USERS) || [];
    }

    saveUsers(users) {
        return this.setItem(this.keys.USERS, users);
    }

    getCurrentUser() {
        return this.getItem(this.keys.CURRENT_USER);
    }

    setCurrentUser(user) {
        return this.setItem(this.keys.CURRENT_USER, user);
    }

    clearCurrentUser() {
        return this.removeItem(this.keys.CURRENT_USER);
    }

    // Learn requests management
    getLearnRequests() {
        return this.getItem(this.keys.LEARN_REQUESTS) || [];
    }

    saveLearnRequests(requests) {
        return this.setItem(this.keys.LEARN_REQUESTS, requests);
    }

    // Ratings management
    getRatings() {
        return this.getItem(this.keys.RATINGS) || [];
    }

    saveRatings(ratings) {
        return this.setItem(this.keys.RATINGS, ratings);
    }

    // Shared contacts management
    getSharedContacts() {
        return this.getItem(this.keys.SHARED_CONTACTS) || [];
    }

    saveSharedContacts(contacts) {
        return this.setItem(this.keys.SHARED_CONTACTS, contacts);
    }

    // Doubts management
    getDoubts() {
        return this.getItem(this.keys.DOUBTS) || [];
    }

    saveDoubts(doubts) {
        return this.setItem(this.keys.DOUBTS, doubts);
    }

    // Utility methods
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    findUserById(userId) {
        const users = this.getUsers();
        return users.find(user => user.id === userId);
    }

    findUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    updateUser(userId, updates) {
        const users = this.getUsers();
        const userIndex = users.findIndex(user => user.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex] = { ...users[userIndex], ...updates };
            this.saveUsers(users);
            
            // Update current user if it's the same user
            const currentUser = this.getCurrentUser();
            if (currentUser && currentUser.id === userId) {
                this.setCurrentUser(users[userIndex]);
            }
            
            return users[userIndex];
        }
        
        return null;
    }

    // Clear all data (useful for testing)
    clearAllData() {
        Object.values(this.keys).forEach(key => {
            this.removeItem(key);
        });
        this.initializeStorage();
    }
}

// Create global instance
window.storageManager = new StorageManager();