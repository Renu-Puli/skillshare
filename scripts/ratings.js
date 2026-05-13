// Ratings and dashboard functionality
class RatingsManager {
    constructor(storageManager, authManager) {
        this.storage = storageManager;
        this.auth = authManager;
        this.init();
    }

    init() {
        // Ratings functionality is handled in the users manager
        // This class focuses on dashboard display
    }

    loadDashboard() {
        const users = this.storage.getUsers();
        const currentUser = this.auth.getCurrentUser();
        
        if (!currentUser) return;

        // Calculate ratings for all users and sort by average rating
        const usersWithRatings = users
            .filter(user => user.id !== currentUser.id) // Exclude current user
            .map(user => ({
                ...user,
                averageRating: this.calculateAverageRating(user.id),
                totalRatings: this.getTotalRatings(user.id)
            }))
            .sort((a, b) => {
                // Sort by average rating (desc), then by total ratings (desc)
                if (b.averageRating !== a.averageRating) {
                    return b.averageRating - a.averageRating;
                }
                return b.totalRatings - a.totalRatings;
            });

        this.renderDashboard(usersWithRatings);
    }

    renderDashboard(users) {
        const dashboardContainer = document.getElementById('dashboard-users');
        if (!dashboardContainer) return;

        if (users.length === 0) {
            dashboardContainer.innerHTML = `
                <div class="empty-state">
                    <h3>No users to display</h3>
                    <p>Check back later as more users join SkillShare!</p>
                </div>
            `;
            return;
        }

        dashboardContainer.innerHTML = users.map((user, index) => {
            const rank = index + 1;
            return this.createDashboardItem(user, rank);
        }).join('');

        // Add click event listeners
        dashboardContainer.querySelectorAll('.dashboard-item').forEach(item => {
            item.addEventListener('click', () => {
                const userId = item.getAttribute('data-user-id');
                if (window.usersManager) {
                    window.usersManager.showUserProfile(userId);
                }
            });
        });
    }

    createDashboardItem(user, rank) {
        const skillNames = user.skills.map(s => typeof s === 'string' ? s : s.name);
        const skillsCount = skillNames.length;
        const skillsPreview = skillNames.slice(0, 3).join(', ');
        const remainingSkills = skillsCount > 3 ? ` +${skillsCount - 3} more` : '';
        const initials = user.name.split(' ').map(n => n[0]).join('').toUpperCase();

        return `
            <div class="dashboard-item card" data-user-id="${user.id}" style="cursor: pointer;">
                <div class="dashboard-rank">${rank}</div>
                <div class="dashboard-avatar">
                    <div class="user-avatar-circle sm">${initials}</div>
                </div>
                <div class="dashboard-info">
                    <h4>${this.escapeHtml(user.name)}</h4>
                    <div class="dashboard-stats">
                        <div class="stat-item">
                            <div class="rating-display">
                                <div class="stars">
                                    ${this.renderStars(user.averageRating)}
                                </div>
                                <span class="rating-text">${user.averageRating.toFixed(1)}</span>
                            </div>
                        </div>
                        <div class="stat-item">
                            <span>${user.totalRatings} rating${user.totalRatings !== 1 ? 's' : ''}</span>
                        </div>
                        <div class="stat-item">
                            <span>${skillsCount} skill${skillsCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    ${skillsCount > 0 ? `
                        <div class="skills-preview">
                            <small class="text-gray-500">${skillsPreview}${remainingSkills}</small>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }

    calculateAverageRating(userId) {
        const ratings = this.storage.getRatings();
        const userRatings = ratings.filter(r => r.ratedUserId === userId);
        
        if (userRatings.length === 0) return 0;
        
        const sum = userRatings.reduce((total, r) => total + r.rating, 0);
        return sum / userRatings.length;
    }

    getTotalRatings(userId) {
        const ratings = this.storage.getRatings();
        return ratings.filter(r => r.ratedUserId === userId).length;
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
}

// Initialize global ratings manager
window.ratingsManager = new RatingsManager(window.storageManager, window.authManager);