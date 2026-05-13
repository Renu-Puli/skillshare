// User management and display functionality
class UsersManager {
    constructor(storageManager, authManager) {
        this.storage = storageManager;
        this.auth = authManager;
        this.currentViewingUser = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Home page will be loaded dynamically
        // Profile view interactions will be set up when loading profile
    }

    loadHomePage() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const users = this.storage.getUsers();
        const otherUsers = users.filter(user => user.id !== currentUser.id);
        
        this.renderUsersGrid(otherUsers);
    }

    renderUsersGrid(users) {
        const gridContainer = document.getElementById('users-grid');
        if (!gridContainer) return;

        if (users.length === 0) {
            gridContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No other users found</h3>
                    <p>Be the first to connect with others on SkillShare!</p>
                </div>
            `;
            return;
        }

        gridContainer.innerHTML = users.map(user => this.createUserCard(user)).join('');
        
        // Add click event listeners to user cards
        gridContainer.querySelectorAll('.user-card').forEach(card => {
            card.addEventListener('click', () => {
                const userId = card.getAttribute('data-user-id');
                this.showUserProfile(userId);
            });
        });
    }

    createUserCard(user) {
        const averageRating = this.calculateAverageRating(user.id);
        const skillNames = user.skills.map(s => typeof s === 'string' ? s : s.name);
        const skillsPreview = skillNames.slice(0, 3); 
        const remainingSkills = skillNames.length - 3;
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

        return `
            <div class="user-card" data-user-id="${user.id}">
                <div class="user-card-header">
                    <div class="user-avatar-circle">${initials}</div>
                    <h3>${this.escapeHtml(user.name)}</h3>
                    <div class="rating-display">
                        <div class="stars">
                            ${this.renderStars(averageRating)}
                        </div>
                        <span class="rating-text">(${averageRating.toFixed(1)})</span>
                    </div>
                </div>
                <div class="user-card-body">
                    <div class="user-skills">
                        <h4>Top Skills</h4>
                        <div class="skills-list">
                            ${skillsPreview.map(skill => `
                                <span class="skill-tag">${this.escapeHtml(skill)}</span>
                            `).join('')}
                            ${remainingSkills > 0 ? `
                                <span class="skill-tag">+${remainingSkills} more</span>
                            ` : ''}
                            ${user.skills.length === 0 ? '<span class="empty-state">No skills listed</span>' : ''}
                        </div>
                    </div>
                </div>
                <div class="user-card-footer">
                    <button class="btn btn-primary btn-full">View Profile</button>
                </div>
            </div>
        `;
    }

    showUserProfile(userId) {
        const user = this.storage.findUserById(userId);
        if (!user) {
            this.showToast('User not found', 'error');
            return;
        }

        this.currentViewingUser = user;
        this.renderProfileView(user);
        window.navigationManager.navigateTo('profile-view');
    }

    renderProfileView(user) {
        const profileInfo = document.getElementById('profile-info');
        const profileSkills = document.getElementById('profile-skills');
        const ratingStars = document.getElementById('rating-stars');

        if (!profileInfo || !profileSkills || !ratingStars) return;

        const averageRating = this.calculateAverageRating(user.id);

        // Render profile info
        profileInfo.innerHTML = `
            <h1>${this.escapeHtml(user.name)}</h1>
            <div class="rating-display">
                <div class="stars">
                    ${this.renderStars(averageRating)}
                </div>
                <span class="rating-text">Average Rating: ${averageRating.toFixed(1)} out of 5</span>
            </div>
        `;

        // Render skills with learn buttons
        if (user.skills.length === 0) {
            profileSkills.innerHTML = '<div class="empty-state">No skills listed</div>';
        } else {
            const requests = this.storage.getLearnRequests();
            const currentUser = this.auth.getCurrentUser();
            
            profileSkills.innerHTML = user.skills.map(skill => {
                const skillName = typeof skill === 'string' ? skill : skill.name;
                const existingRequest = currentUser ? requests.find(req => 
                    req.studentId === currentUser.id && 
                    req.teacherId === user.id && 
                    req.skill === skillName &&
                    req.status === 'pending'
                ) : null;

                return `
                    <div class="skill-learn-item">
                        <span class="skill-name">${this.escapeHtml(skillName)}</span>
                        ${existingRequest ? `
                            <button class="btn btn-outline btn-sm" style="color: #f87171; border-color: #f87171;" onclick="window.skillsManager.cancelLearnRequest('${existingRequest.id}')">
                                Cancel Request
                            </button>
                        ` : `
                            <button class="btn btn-secondary btn-sm" onclick="window.usersManager.requestToLearn('${user.id}', '${this.escapeHtml(skillName)}')">
                                Learn
                            </button>
                        `}
                    </div>
                `;
            }).join('');
        }

        // Setup rating functionality
        this.setupRatingStars(user.id);
    }

    setupRatingStars(userId) {
        const stars = document.querySelectorAll('#rating-stars .star');
        const currentUser = this.auth.getCurrentUser();
        
        if (!currentUser) return;

        // Check if user has already rated this person
        const existingRating = this.getUserRating(currentUser.id, userId);
        
        stars.forEach((star, index) => {
            const rating = index + 1;
            
            // Highlight existing rating
            if (existingRating && rating <= existingRating.rating) {
                star.classList.add('active');
            }
            
            star.addEventListener('click', () => {
                this.rateUser(userId, rating);
            });
            
            star.addEventListener('mouseenter', () => {
                stars.forEach((s, i) => {
                    if (i <= index) {
                        s.classList.add('active');
                    } else {
                        s.classList.remove('active');
                    }
                });
            });
            
            star.addEventListener('mouseleave', () => {
                stars.forEach(s => s.classList.remove('active'));
                // Restore existing rating
                if (existingRating) {
                    stars.forEach((s, i) => {
                        if (i < existingRating.rating) {
                            s.classList.add('active');
                        }
                    });
                }
            });
        });
    }

    requestToLearn(teacherId, skill) {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const requests = this.storage.getLearnRequests();
        
        // Check if request already exists
        const existingRequest = requests.find(req => 
            req.studentId === currentUser.id && 
            req.teacherId === teacherId && 
            req.skill === skill &&
            req.status === 'pending'
        );

        if (existingRequest) {
            this.showToast('You have already requested to learn this skill', 'warning');
            return;
        }

        // Create new learn request
        const newRequest = {
            id: this.storage.generateId(),
            studentId: currentUser.id,
            studentName: currentUser.name,
            studentEmail: currentUser.email,
            teacherId,
            skill,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        requests.push(newRequest);
        this.storage.saveLearnRequests(requests);
        
        this.showToast(`Request sent to learn "${skill}"!`, 'success');
        
        // Refresh the current profile view to show "Cancel Request" button
        if (this.currentViewingUser && this.currentViewingUser.id === teacherId) {
            this.renderProfileView(this.currentViewingUser);
        }
    }

    rateUser(userId, rating) {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        if (currentUser.id === userId) {
            this.showToast('You cannot rate yourself', 'error');
            return;
        }

        const ratings = this.storage.getRatings();
        
        // Find existing rating
        const existingRatingIndex = ratings.findIndex(r => 
            r.raterId === currentUser.id && r.ratedUserId === userId
        );

        const ratingData = {
            id: this.storage.generateId(),
            raterId: currentUser.id,
            ratedUserId: userId,
            rating,
            createdAt: new Date().toISOString()
        };

        if (existingRatingIndex !== -1) {
            // Update existing rating
            ratings[existingRatingIndex] = { ...ratings[existingRatingIndex], ...ratingData };
            this.showToast('Rating updated!', 'success');
        } else {
            // Add new rating
            ratings.push(ratingData);
            this.showToast('Rating submitted!', 'success');
        }

        this.storage.saveRatings(ratings);
        
        // Update the profile view with new average rating
        if (this.currentViewingUser && this.currentViewingUser.id === userId) {
            this.renderProfileView(this.currentViewingUser);
        }
    }

    calculateAverageRating(userId) {
        const ratings = this.storage.getRatings();
        const userRatings = ratings.filter(r => r.ratedUserId === userId);
        
        if (userRatings.length === 0) return 0;
        
        const sum = userRatings.reduce((total, r) => total + r.rating, 0);
        return sum / userRatings.length;
    }

    getUserRating(raterId, ratedUserId) {
        const ratings = this.storage.getRatings();
        return ratings.find(r => r.raterId === raterId && r.ratedUserId === ratedUserId);
    }

    renderStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHtml = '';
        
        // Full stars
        for (let i = 0; i < fullStars; i++) {
            starsHtml += '<span class="star active">★</span>';
        }
        
        // Half star
        if (hasHalfStar) {
            starsHtml += '<span class="star half">★</span>';
        }
        
        // Empty stars
        for (let i = 0; i < emptyStars; i++) {
            starsHtml += '<span class="star">★</span>';
        }
        
        return starsHtml;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    showToast(message, type = 'info') {
        if (window.toastManager) {
            window.toastManager.show(message, type);
        }
    }
}

// Initialize global users manager
window.usersManager = new UsersManager(window.storageManager, window.authManager);