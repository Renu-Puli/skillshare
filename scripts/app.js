
document.addEventListener('DOMContentLoaded', function() {
    
    console.log('SkillShare application initialized');
    
    
    if (!window.storageManager) {
        console.error('Storage manager not found');
        return;
    }
    
    if (!window.authManager) {
        console.error('Auth manager not found');
        return;
    }
    
    if (!window.navigationManager) {
        console.error('Navigation manager not found');
        return;
    }
    
   
    initializeDemoData();
    
    console.log('All managers initialized successfully');
});


function initializeDemoData() {
    const users = window.storageManager.getUsers();
    
    
    if (users.length === 0) {
        const demoUsers = [
            {
                id: 'demo1',
                name: 'John Doe',
                email: 'john@example.com',
                password: 'password123',
                skills: ['JavaScript', 'React', 'Node.js'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo2',
                name: 'Jane Smith',
                email: 'jane@example.com',
                password: 'password123',
                skills: ['Python', 'Django', 'Machine Learning'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo3',
                name: 'Mike Johnson',
                email: 'mike@example.com',
                password: 'password123',
                skills: ['UI/UX Design', 'Figma', 'Adobe Creative Suite'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo4',
                name: 'Sarah Wilson',
                email: 'sarah@example.com',
                password: 'password123',
                skills: ['Swift', 'iOS Development', 'Core Data'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo5',
                name: 'David Chen',
                email: 'david@example.com',
                password: 'password123',
                skills: ['Golang', 'Kubernetes', 'Docker'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo6',
                name: 'Aisha Patel',
                email: 'aisha@example.com',
                password: 'password123',
                skills: ['Cloud Architecture', 'AWS', 'Terraform'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo7',
                name: 'Robert Brown',
                email: 'robert@example.com',
                password: 'password123',
                skills: ['Java', 'Spring Boot', 'Microservices'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo8',
                name: 'Elena Gilbert',
                email: 'elena@example.com',
                password: 'password123',
                skills: ['SEO', 'Content Marketing', 'Analytics'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo9',
                name: 'Lucas Viana',
                email: 'lucas@example.com',
                password: 'password123',
                skills: ['Cyber Security', 'Penetration Testing', 'Network Security'],
                createdAt: new Date().toISOString()
            },
            {
                id: 'demo10',
                name: 'Sophie Martin',
                email: 'sophie@example.com',
                password: 'password123',
                skills: ['Product Management', 'Agile', 'Scrum'],
                createdAt: new Date().toISOString()
            }
        ];
        
        window.storageManager.saveUsers(demoUsers);
        
        
        const demoRatings = [
            { id: 'r1', raterId: 'demo1', ratedUserId: 'demo2', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r2', raterId: 'demo2', ratedUserId: 'demo3', rating: 4, createdAt: new Date().toISOString() },
            { id: 'r3', raterId: 'demo3', ratedUserId: 'demo1', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r4', raterId: 'demo4', ratedUserId: 'demo5', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r5', raterId: 'demo5', ratedUserId: 'demo6', rating: 4, createdAt: new Date().toISOString() },
            { id: 'r6', raterId: 'demo6', ratedUserId: 'demo4', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r7', raterId: 'demo7', ratedUserId: 'demo8', rating: 3, createdAt: new Date().toISOString() },
            { id: 'r8', raterId: 'demo8', ratedUserId: 'demo9', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r9', raterId: 'demo9', ratedUserId: 'demo10', rating: 4, createdAt: new Date().toISOString() },
            { id: 'r10', raterId: 'demo10', ratedUserId: 'demo7', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r11', raterId: 'demo1', ratedUserId: 'demo4', rating: 4, createdAt: new Date().toISOString() },
            { id: 'r12', raterId: 'demo2', ratedUserId: 'demo5', rating: 5, createdAt: new Date().toISOString() },
            { id: 'r13', raterId: 'demo3', ratedUserId: 'demo6', rating: 5, createdAt: new Date().toISOString() }
        ];
        
        window.storageManager.saveRatings(demoRatings);
        
        console.log('Demo data initialized');
    }
}


window.SkillShareUtils = {
    
    formatDate: function(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    },
    
   
    isValidEmail: function(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    },
    
    
    truncateText: function(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
   
    debounce: function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};