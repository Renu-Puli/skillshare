// Navigation and routing functionality
class NavigationManager {
    constructor() {
        this.currentPage = 'login';
        this.pages = ['login', 'signup', 'home', 'profile-view', 'my-profile', 'dashboard'];
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkInitialRoute();
        
        // Handle browser back/forward buttons
        window.addEventListener('hashchange', () => {
            const page = window.location.hash.substring(1);
            if (page && this.pages.includes(page)) {
                this.navigateTo(page, false);
            }
        });
    }

    setupEventListeners() {
        // Navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                if (page) {
                    this.navigateTo(page);
                }
            });
        });

        // Back button on profile view
        const backBtn = document.getElementById('back-to-home');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigateTo('home');
            });
        }

        // Mobile navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navLinks = document.querySelector('.nav-links');
        
        if (navToggle && navLinks) {
            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('show');
            });
        }
    }

    checkInitialRoute() {
        const currentUser = window.storageManager.getCurrentUser();
        
        if (currentUser) {
            // User is logged in, show home page
            this.navigateTo('home');
        } else {
            // User is not logged in, show login page
            this.navigateTo('login');
        }
    }

    navigateTo(pageName, updateHash = true) {
        if (!this.pages.includes(pageName)) {
            console.error(`Page "${pageName}" not found`);
            return;
        }

        // Update URL hash
        if (updateHash) {
            window.location.hash = pageName;
        }

        // Check authentication for protected pages
        const protectedPages = ['home', 'profile-view', 'my-profile', 'dashboard'];
        const currentUser = window.storageManager.getCurrentUser();
        
        if (protectedPages.includes(pageName) && !currentUser) {
            this.navigateTo('login');
            return;
        }

        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show target page
        const targetPage = document.getElementById(`${pageName}-page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation state
        this.updateNavigationState(pageName);
        
        // Handle page-specific initialization
        this.handlePageLoad(pageName);

        this.currentPage = pageName;
    }

    updateNavigationState(pageName) {
        const navBar = document.getElementById('nav-bar');
        const authPages = ['login', 'signup'];
        
        if (authPages.includes(pageName)) {
            // Hide navigation for auth pages
            navBar.classList.add('hidden');
        } else {
            // Show navigation for app pages
            navBar.classList.remove('hidden');
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-page') === pageName) {
                    link.classList.add('active');
                }
            });
        }
    }

    handlePageLoad(pageName) {
        switch (pageName) {
            case 'home':
                if (window.usersManager) {
                    window.usersManager.loadHomePage();
                }
                break;
            case 'my-profile':
                if (window.skillsManager) {
                    window.skillsManager.loadMyProfile();
                }
                break;
            case 'dashboard':
                if (window.ratingsManager) {
                    window.ratingsManager.loadDashboard();
                }
                break;
            case 'profile-view':
                // Profile view is handled separately when viewing a specific user
                break;
        }
    }

    getCurrentPage() {
        return this.currentPage;
    }

    showProfile(userId) {
        // Load specific user profile and navigate to profile view
        if (window.usersManager) {
            window.usersManager.showUserProfile(userId);
        }
        this.navigateTo('profile-view');
    }

    goBack() {
        // Simple back navigation - goes to home by default
        this.navigateTo('home');
    }
}

// Initialize global navigation manager
window.navigationManager = new NavigationManager();