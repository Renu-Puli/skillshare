// Main application logic
const App = {
    init() {
        this.setupEventListeners();
        this.checkAuthAndRoute();
    },

    setupEventListeners() {
        // Navigation clicks
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-page]')) {
                e.preventDefault();
                const page = e.target.getAttribute('data-page');
                this.navigateTo(page);
            }

            // Auth page switches
            if (e.target.id === 'show-login') {
                e.preventDefault();
                Pages.showLoginPage();
            }

            if (e.target.id === 'show-signup') {
                e.preventDefault();
                Pages.showSignupPage();
            }

            // Logout
            if (e.target.id === 'logout-btn') {
                e.preventDefault();
                this.logout();
            }
        });

        // Form submissions
        document.addEventListener('submit', (e) => {
            if (e.target.id === 'signup-form') {
                e.preventDefault();
                this.handleSignup();
            }

            if (e.target.id === 'login-form') {
                e.preventDefault();
                this.handleLogin();
            }
        });

        // Enter key for add skill
        document.addEventListener('keypress', (e) => {
            if (e.target.id === 'new-skill' && e.key === 'Enter') {
                e.preventDefault();
                Pages.addSkill();
            }
        });
    },

    checkAuthAndRoute() {
        if (Auth.isLoggedIn()) {
            Pages.showHomePage();
        } else {
            Pages.showLoginPage();
        }
    },

    navigateTo(page) {
        if (!Auth.isLoggedIn()) {
            Pages.showLoginPage();
            return;
        }

        switch (page) {
            case 'home':
                Pages.showHomePage();
                break;
            case 'my-profile':
                Pages.showMyProfilePage();
                break;
            case 'dashboard':
                Pages.showDashboardPage();
                break;
            default:
                Pages.showHomePage();
        }
    },

    handleSignup() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;

        const result = Auth.signup(name, email, password);
        
        if (result.success) {
            Pages.showMessage('signup-message', result.message, 'success');
            setTimeout(() => {
                Pages.showLoginPage();
            }, 1500);
        } else {
            Pages.showMessage('signup-message', result.message, 'error');
        }
    },

    handleLogin() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        const result = Auth.login(email, password);
        
        if (result.success) {
            Pages.showMessage('login-message', result.message, 'success');
            setTimeout(() => {
                Pages.showHomePage();
            }, 1000);
        } else {
            Pages.showMessage('login-message', result.message, 'error');
        }
    },

    logout() {
        Auth.logout();
        Pages.showLoginPage();
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});