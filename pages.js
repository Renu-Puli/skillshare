// Page rendering functions
const Pages = {
    // Show signup page
    showSignupPage() {
        const content = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Join SkillShare</h1>
                    <form id="signup-form">
                        <div class="form-group">
                            <label for="signup-name">Full Name</label>
                            <input type="text" id="signup-name" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-email">Email</label>
                            <input type="email" id="signup-email" required>
                        </div>
                        <div class="form-group">
                            <label for="signup-password">Password</label>
                            <input type="password" id="signup-password" required>
                        </div>
                        <button type="submit" class="btn">Create Account</button>
                    </form>
                    <div class="auth-switch">
                        Already have an account? <a href="#" id="show-login">Login here</a>
                    </div>
                    <div id="signup-message"></div>
                </div>
            </div>
        `;
        this.renderPage(content);
        this.hideNavbar();
    },

    // Show login page
    showLoginPage() {
        const content = `
            <div class="auth-container">
                <div class="auth-card">
                    <h1>Welcome Back</h1>
                    <form id="login-form">
                        <div class="form-group">
                            <label for="login-email">Email</label>
                            <input type="email" id="login-email" required>
                        </div>
                        <div class="form-group">
                            <label for="login-password">Password</label>
                            <input type="password" id="login-password" required>
                        </div>
                        <button type="submit" class="btn">Login</button>
                    </form>
                    <div class="auth-switch">
                        Don't have an account? <a href="#" id="show-signup">Sign up here</a>
                    </div>
                    <div id="login-message"></div>
                </div>
            </div>
        `;
        this.renderPage(content);
        this.hideNavbar();
    },

    // Show home page (user list)
    showHomePage() {
        const currentUser = Auth.getCurrentUser();
        const allUsers = Storage.getUsers();
        const otherUsers = allUsers.filter(user => user.id !== currentUser.id);

        if (otherUsers.length === 0) {
            const content = `
                <div class="page-container">
                    <div class="page-header">
                        <h1>Welcome to SkillShare</h1>
                        <p>Connect with others and share your skills</p>
                    </div>
                    <div class="empty-state">
                        <h3>No other users yet</h3>
                        <p>Be the first to explore when more users join!</p>
                    </div>
                </div>
            `;
            this.renderPage(content);
            this.showNavbar();
            return;
        }

        const usersHtml = otherUsers.map(user => {
            const rating = Storage.getUserRating(user.id);
            const currentUserRating = Storage.getUserRatingByRater(user.id, currentUser.id);
            
            return `
                <div class="user-card">
                    <h3>${user.name}</h3>
                    <div class="skills-list">
                        ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                    </div>
                    <div class="rating">
                        <div class="stars" data-user-id="${user.id}">
                            ${[1,2,3,4,5].map(star => 
                                `<span class="star ${star <= currentUserRating ? 'filled' : ''}" data-rating="${star}">★</span>`
                            ).join('')}
                        </div>
                        <span class="rating-text">${rating > 0 ? `${rating}/5` : 'Not rated'}</span>
                    </div>
                    <button class="btn btn-small" onclick="Pages.showProfilePage('${user.id}')">View Profile</button>
                </div>
            `;
        }).join('');

        const content = `
            <div class="page-container">
                <div class="page-header">
                    <h1>Discover Skills</h1>
                    <p>Find people to learn from and connect with</p>
                </div>
                <div class="users-grid">
                    ${usersHtml}
                </div>
            </div>
        `;
        
        this.renderPage(content);
        this.showNavbar();
        this.initializeRatingSystem();
    },

    // Show profile page of a specific user
    showProfilePage(userId) {
        const user = Storage.getUserById(userId);
        const currentUser = Auth.getCurrentUser();
        
        if (!user) {
            this.showHomePage();
            return;
        }

        const rating = Storage.getUserRating(user.id);
        const skillsHtml = user.skills.map(skill => 
            `<span class="skill-tag with-action" onclick="Pages.sendLearnRequest('${user.id}', '${skill}')">${skill} - Learn</span>`
        ).join('');

        const content = `
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <h1>${user.name}</h1>
                        <div class="rating">
                            <div class="stars">
                                ${[1,2,3,4,5].map(star => 
                                    `<span class="star ${star <= Math.round(rating) ? 'filled' : ''}">★</span>`
                                ).join('')}
                            </div>
                            <span class="rating-text">${rating > 0 ? `${rating}/5` : 'Not rated'}</span>
                        </div>
                    </div>
                    
                    <div class="skill-management">
                        <h3>Skills Available</h3>
                        ${user.skills.length > 0 ? 
                            `<div class="skills-list">${skillsHtml}</div>` : 
                            '<p>No skills listed yet.</p>'
                        }
                    </div>
                    
                    <button class="btn btn-secondary" onclick="Pages.showHomePage()">Back to Home</button>
                </div>
                <div id="profile-message"></div>
            </div>
        `;
        
        this.renderPage(content);
        this.showNavbar();
    },

    // Show my profile page
    showMyProfilePage() {
        const currentUser = Auth.getCurrentUser();
        const incomingRequests = Storage.getRequestsForUser(currentUser.id)
            .filter(req => req.status === 'pending');

        const skillsHtml = currentUser.skills.map(skill => 
            `<div class="skill-item">
                <span>${skill}</span>
                <button class="btn btn-danger btn-small" onclick="Pages.removeSkill('${skill}')">Remove</button>
            </div>`
        ).join('');

        const requestsHtml = incomingRequests.map(request => {
            const requester = Storage.getUserById(request.requesterId);
            return `
                <div class="request-item">
                    <div class="request-header">
                        <strong>${requester ? requester.name : 'Unknown User'}</strong>
                        <div class="request-actions">
                            <button class="btn btn-success btn-small" onclick="Pages.acceptRequest('${request.id}')">Accept</button>
                            <button class="btn btn-danger btn-small" onclick="Pages.rejectRequest('${request.id}')">Reject</button>
                        </div>
                    </div>
                    <div class="request-info">
                        Wants to learn: <strong>${request.skill}</strong>
                    </div>
                </div>
            `;
        }).join('');

        const content = `
            <div class="profile-container">
                <div class="profile-card">
                    <div class="profile-header">
                        <h1>My Profile</h1>
                        <p>Welcome, ${currentUser.name}!</p>
                    </div>
                    
                    <div class="skill-management">
                        <h3>My Skills</h3>
                        <div class="add-skill-form">
                            <input type="text" id="new-skill" placeholder="Enter a new skill">
                            <button class="btn btn-small" onclick="Pages.addSkill()">Add Skill</button>
                        </div>
                        <div class="skills-container">
                            ${currentUser.skills.length > 0 ? skillsHtml : '<p>No skills added yet.</p>'}
                        </div>
                    </div>
                    
                    <div class="requests-section">
                        <h3>Incoming Learn Requests</h3>
                        ${incomingRequests.length > 0 ? requestsHtml : '<p>No pending requests.</p>'}
                    </div>
                </div>
                <div id="profile-message"></div>
            </div>
        `;
        
        this.renderPage(content);
        this.showNavbar();
    },

    // Show dashboard page (ranked users)
    showDashboardPage() {
        const currentUser = Auth.getCurrentUser();
        const allUsers = Storage.getUsers();
        const otherUsers = allUsers.filter(user => user.id !== currentUser.id);
        
        // Sort users by rating (highest first)
        const rankedUsers = otherUsers.map(user => ({
            ...user,
            rating: Storage.getUserRating(user.id)
        })).sort((a, b) => b.rating - a.rating);

        if (rankedUsers.length === 0) {
            const content = `
                <div class="page-container">
                    <div class="page-header">
                        <h1>Dashboard</h1>
                        <p>Top rated skill providers</p>
                    </div>
                    <div class="empty-state">
                        <h3>No users to display</h3>
                        <p>The dashboard will show users ranked by their ratings.</p>
                    </div>
                </div>
            `;
            this.renderPage(content);
            this.showNavbar();
            return;
        }

        const usersHtml = rankedUsers.map((user, index) => `
            <div class="user-card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                    <h3>${user.name}</h3>
                    <span style="background: #667eea; color: white; padding: 5px 10px; border-radius: 15px; font-size: 14px;">
                        #${index + 1}
                    </span>
                </div>
                <div class="skills-list">
                    ${user.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                <div class="rating">
                    <div class="stars">
                        ${[1,2,3,4,5].map(star => 
                            `<span class="star ${star <= Math.round(user.rating) ? 'filled' : ''}">★</span>`
                        ).join('')}
                    </div>
                    <span class="rating-text">${user.rating > 0 ? `${user.rating}/5` : 'Not rated'}</span>
                </div>
                <button class="btn btn-small" onclick="Pages.showProfilePage('${user.id}')">View Profile</button>
            </div>
        `).join('');

        const content = `
            <div class="page-container">
                <div class="page-header">
                    <h1>Dashboard</h1>
                    <p>Top rated skill providers</p>
                </div>
                <div class="users-grid">
                    ${usersHtml}
                </div>
            </div>
        `;
        
        this.renderPage(content);
        this.showNavbar();
    },

    // Send learn request
    sendLearnRequest(targetUserId, skill) {
        const currentUser = Auth.getCurrentUser();
        
        const request = {
            id: Auth.generateId(),
            requesterId: currentUser.id,
            targetUserId: targetUserId,
            skill: skill,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        const success = Storage.addLearnRequest(request);
        
        if (success) {
            this.showMessage('profile-message', 'Learn request sent successfully!', 'success');
        } else {
            this.showMessage('profile-message', 'You already have a pending request for this skill.', 'error');
        }
    },

    // Add skill to current user
    addSkill() {
        const skillInput = document.getElementById('new-skill');
        const skill = skillInput.value.trim();
        
        if (!skill) {
            this.showMessage('profile-message', 'Please enter a skill name.', 'error');
            return;
        }

        const currentUser = Auth.getCurrentUser();
        
        if (currentUser.skills.includes(skill)) {
            this.showMessage('profile-message', 'You already have this skill.', 'error');
            return;
        }

        currentUser.skills.push(skill);
        Storage.updateUser(currentUser);
        skillInput.value = '';
        
        this.showMyProfilePage();
        this.showMessage('profile-message', 'Skill added successfully!', 'success');
    },

    // Remove skill from current user
    removeSkill(skill) {
        const currentUser = Auth.getCurrentUser();
        currentUser.skills = currentUser.skills.filter(s => s !== skill);
        Storage.updateUser(currentUser);
        
        this.showMyProfilePage();
        this.showMessage('profile-message', 'Skill removed successfully!', 'success');
    },

    // Accept learn request
    acceptRequest(requestId) {
        const requests = Storage.getLearnRequests();
        const request = requests.find(req => req.id === requestId);
        
        if (request) {
            Storage.updateLearnRequest(requestId, 'accepted');
            
            // Share contact information
            const currentUser = Auth.getCurrentUser();
            const contact = {
                id: Auth.generateId(),
                requesterId: request.requesterId,
                providerId: currentUser.id,
                providerEmail: currentUser.email,
                skill: request.skill,
                sharedAt: new Date().toISOString()
            };
            
            Storage.addSharedContact(contact);
            
            this.showMyProfilePage();
            this.showMessage('profile-message', 'Request accepted! Your contact has been shared.', 'success');
        }
    },

    // Reject learn request
    rejectRequest(requestId) {
        Storage.updateLearnRequest(requestId, 'rejected');
        this.showMyProfilePage();
        this.showMessage('profile-message', 'Request rejected.', 'success');
    },

    // Initialize rating system
    initializeRatingSystem() {
        const stars = document.querySelectorAll('.stars');
        stars.forEach(starContainer => {
            const userId = starContainer.getAttribute('data-user-id');
            const starElements = starContainer.querySelectorAll('.star');
            
            starElements.forEach(star => {
                star.addEventListener('click', () => {
                    const rating = parseInt(star.getAttribute('data-rating'));
                    this.submitRating(userId, rating);
                    
                    // Update visual feedback
                    starElements.forEach((s, index) => {
                        if (index < rating) {
                            s.classList.add('filled');
                        } else {
                            s.classList.remove('filled');
                        }
                    });
                });
            });
        });
    },

    // Submit rating
    submitRating(userId, rating) {
        const currentUser = Auth.getCurrentUser();
        
        const ratingData = {
            id: Auth.generateId(),
            raterId: currentUser.id,
            ratedUserId: userId,
            rating: rating,
            createdAt: new Date().toISOString()
        };
        
        Storage.addRating(ratingData);
    },

    // Show message
    showMessage(elementId, message, type) {
        const messageElement = document.getElementById(elementId);
        if (messageElement) {
            messageElement.innerHTML = `<div class="message ${type}">${message}</div>`;
            setTimeout(() => {
                messageElement.innerHTML = '';
            }, 3000);
        }
    },

    // Show/hide navigation
    showNavbar() {
        const navbar = document.getElementById('navbar');
        navbar.classList.remove('hidden');
    },

    hideNavbar() {
        const navbar = document.getElementById('navbar');
        navbar.classList.add('hidden');
    },

    // Render page content
    renderPage(content) {
        const mainContent = document.getElementById('main-content');
        mainContent.innerHTML = content;
    }
};