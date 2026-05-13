// LocalStorage management utilities
const Storage = {
    // User management
    getUsers() {
        return JSON.parse(localStorage.getItem('skillshare_users') || '[]');
    },

    saveUsers(users) {
        localStorage.setItem('skillshare_users', JSON.stringify(users));
    },

    addUser(user) {
        const users = this.getUsers();
        users.push(user);
        this.saveUsers(users);
    },

    getUserByEmail(email) {
        const users = this.getUsers();
        return users.find(user => user.email === email);
    },

    getUserById(id) {
        const users = this.getUsers();
        return users.find(user => user.id === id);
    },

    updateUser(updatedUser) {
        const users = this.getUsers();
        const index = users.findIndex(user => user.id === updatedUser.id);
        if (index !== -1) {
            users[index] = updatedUser;
            this.saveUsers(users);
        }
    },

    // Session management
    getCurrentUser() {
        const userId = localStorage.getItem('skillshare_current_user');
        return userId ? this.getUserById(userId) : null;
    },

    setCurrentUser(userId) {
        localStorage.setItem('skillshare_current_user', userId);
    },

    clearCurrentUser() {
        localStorage.removeItem('skillshare_current_user');
    },

    // Learn requests management
    getLearnRequests() {
        return JSON.parse(localStorage.getItem('skillshare_learn_requests') || '[]');
    },

    saveLearnRequests(requests) {
        localStorage.setItem('skillshare_learn_requests', JSON.stringify(requests));
    },

    addLearnRequest(request) {
        const requests = this.getLearnRequests();
        // Check if request already exists
        const existingRequest = requests.find(req => 
            req.requesterId === request.requesterId && 
            req.targetUserId === request.targetUserId && 
            req.skill === request.skill
        );
        
        if (!existingRequest) {
            requests.push(request);
            this.saveLearnRequests(requests);
            return true;
        }
        return false;
    },

    updateLearnRequest(requestId, status) {
        const requests = this.getLearnRequests();
        const index = requests.findIndex(req => req.id === requestId);
        if (index !== -1) {
            requests[index].status = status;
            this.saveLearnRequests(requests);
        }
    },

    getRequestsForUser(userId) {
        const requests = this.getLearnRequests();
        return requests.filter(req => req.targetUserId === userId);
    },

    getRequestsByUser(userId) {
        const requests = this.getLearnRequests();
        return requests.filter(req => req.requesterId === userId);
    },

    // Shared contacts management
    getSharedContacts() {
        return JSON.parse(localStorage.getItem('skillshare_shared_contacts') || '[]');
    },

    saveSharedContacts(contacts) {
        localStorage.setItem('skillshare_shared_contacts', JSON.stringify(contacts));
    },

    addSharedContact(contact) {
        const contacts = this.getSharedContacts();
        contacts.push(contact);
        this.saveSharedContacts(contacts);
    },

    getSharedContactsForUser(userId) {
        const contacts = this.getSharedContacts();
        return contacts.filter(contact => contact.requesterId === userId);
    },

    // Ratings management
    getRatings() {
        return JSON.parse(localStorage.getItem('skillshare_ratings') || '[]');
    },

    saveRatings(ratings) {
        localStorage.setItem('skillshare_ratings', JSON.stringify(ratings));
    },

    addRating(rating) {
        const ratings = this.getRatings();
        // Check if user already rated this person
        const existingRatingIndex = ratings.findIndex(r => 
            r.raterId === rating.raterId && r.ratedUserId === rating.ratedUserId
        );
        
        if (existingRatingIndex !== -1) {
            ratings[existingRatingIndex] = rating;
        } else {
            ratings.push(rating);
        }
        this.saveRatings(ratings);
    },

    getUserRating(userId) {
        const ratings = this.getRatings();
        const userRatings = ratings.filter(r => r.ratedUserId === userId);
        if (userRatings.length === 0) return 0;
        
        const sum = userRatings.reduce((acc, r) => acc + r.rating, 0);
        return Math.round((sum / userRatings.length) * 10) / 10;
    },

    getUserRatingByRater(userId, raterId) {
        const ratings = this.getRatings();
        const rating = ratings.find(r => r.ratedUserId === userId && r.raterId === raterId);
        return rating ? rating.rating : 0;
    }
};