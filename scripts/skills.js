// Skills management functionality
class SkillsManager {
    constructor(storageManager, authManager) {
        this.storage = storageManager;
        this.auth = authManager;
        this.init();
    }

    init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Add skill form
        const addSkillForm = document.getElementById('add-skill-form');
        if (addSkillForm) {
            addSkillForm.addEventListener('submit', (e) => this.handleAddSkill(e));
        }
    }

    loadMyProfile() {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        // Update Level Badge
        const levelBadge = document.getElementById('user-level-badge');
        const profileName = document.getElementById('profile-user-name');
        
        if (profileName) {
            profileName.innerText = currentUser.name;
        }

        if (levelBadge) {
            levelBadge.innerText = `Level: ${currentUser.level || 'Beginner'}`;
            levelBadge.className = `level-badge level-${(currentUser.level || 'Beginner').toLowerCase()}`;
        }

        this.renderMySkills(currentUser);
        this.renderLearnRequests(currentUser);
        this.renderSharedContacts(currentUser);
        this.renderLearningResources(currentUser);
        this.renderDoubtsToClarify(currentUser);
    }

    renderLearningResources(user) {
        const resourcesContainer = document.getElementById('learning-resources');
        if (!resourcesContainer) return;

        const requests = this.storage.getLearnRequests();
        const acceptedRequests = requests.filter(req => 
            req.studentId === user.id && req.status === 'accepted'
        );

        if (acceptedRequests.length === 0) {
            resourcesContainer.innerHTML = '<div class="empty-state">Accept a request to unlock AI-generated resources and ask doubts!</div>';
            return;
        }

        const doubts = this.storage.getDoubts();
        const skills = [...new Set(acceptedRequests.map(req => req.skill))];

        resourcesContainer.innerHTML = skills.map(skill => {
            const resources = this.generateAIResources(skill);
            const teacherReq = acceptedRequests.find(r => r.skill === skill);
            const skillDoubts = doubts.filter(d => d.studentId === user.id && d.skill === skill);

            return `
                <div class="resource-group">
                    <h4>Resources for ${this.escapeHtml(skill)}</h4>
                    <div class="resource-items">
                        ${resources.map(res => `
                            <div class="resource-card">
                                <div class="resource-type-icon">${res.type === 'video' ? '🎬' : '📄'}</div>
                                <div class="resource-details">
                                    <h5>${this.escapeHtml(res.title)}</h5>
                                    <p>${this.escapeHtml(res.description)}</p>
                                    <a href="${res.link}" target="_blank" class="btn btn-sm btn-outline">View ${res.type}</a>
                                </div>
                            </div>
                        `).join('')}
                    </div>

                    <div class="quiz-cta">
                        <button class="btn btn-secondary btn-sm" onclick="window.open('quiz.html?skill=${encodeURIComponent(skill)}', '_blank')">🎯 Attempt ${this.escapeHtml(skill)} Quiz</button>
                    </div>
                    
                    <div class="doubt-section">
                        <h5>Ask a Doubt to your Teacher</h5>
                        <div class="doubt-form">
                            <input type="text" id="doubt-q-${teacherReq.id}" placeholder="Type your doubt here...">
                            <button class="btn btn-primary btn-sm" onclick="window.skillsManager.askDoubt('${teacherReq.teacherId}', '${this.escapeHtml(skill)}', '${teacherReq.id}')">Ask</button>
                        </div>
                        <div class="existing-doubts">
                            ${skillDoubts.map(d => `
                                <div class="doubt-item ${d.answer ? 'answered' : 'pending'}">
                                    <p class="question"><strong>Q:</strong> ${this.escapeHtml(d.question)}</p>
                                    ${d.answer ? `<p class="answer"><strong>A:</strong> ${this.escapeHtml(d.answer)}</p>` : '<p class="status">Waiting for teacher...</p>'}
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    }

    askDoubt(teacherId, skill, requestId) {
        const currentUser = this.auth.getCurrentUser();
        const qInput = document.getElementById(`doubt-q-${requestId}`);
        const question = qInput.value.trim();

        if (!question) {
            this.showToast('Please enter your doubt', 'error');
            return;
        }

        const doubts = this.storage.getDoubts();
        const newDoubt = {
            id: this.storage.generateId(),
            studentId: currentUser.id,
            teacherId,
            skill,
            question,
            answer: null,
            createdAt: new Date().toISOString()
        };

        doubts.push(newDoubt);
        this.storage.saveDoubts(doubts);
        this.showToast('Doubt sent to teacher!', 'success');
        qInput.value = '';
        this.loadMyProfile();
    }

    renderDoubtsToClarify(user) {
        const doubtsContainer = document.getElementById('doubts-to-clarify');
        if (!doubtsContainer) return;

        const doubts = this.storage.getDoubts();
        const pendingDoubts = doubts.filter(d => d.teacherId === user.id && !d.answer);

        if (pendingDoubts.length === 0) {
            doubtsContainer.innerHTML = '<div class="empty-state">No pending doubts to clarify</div>';
            return;
        }

        doubtsContainer.innerHTML = pendingDoubts.map(d => {
            const student = this.storage.findUserById(d.studentId);
            return `
                <div class="doubt-clarify-card">
                    <div class="doubt-meta">
                        <strong>${this.escapeHtml(student ? student.name : 'Unknown')}</strong> wants to clarify about <strong>${this.escapeHtml(d.skill)}</strong>
                    </div>
                    <p class="doubt-text">"${this.escapeHtml(d.question)}"</p>
                    <div class="answer-form">
                        <textarea id="answer-a-${d.id}" placeholder="Type your clarification here..."></textarea>
                        <button class="btn btn-success btn-sm" onclick="window.skillsManager.answerDoubt('${d.id}')">Send Clarification</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    answerDoubt(doubtId) {
        const aInput = document.getElementById(`answer-a-${doubtId}`);
        const answer = aInput.value.trim();

        if (!answer) {
            this.showToast('Please enter an answer', 'error');
            return;
        }

        const doubts = this.storage.getDoubts();
        const doubtIndex = doubts.findIndex(d => d.id === doubtId);

        if (doubtIndex !== -1) {
            doubts[doubtIndex].answer = answer;
            doubts[doubtIndex].answeredAt = new Date().toISOString();
            this.storage.saveDoubts(doubts);
            this.showToast('Clarification sent!', 'success');
            this.loadMyProfile();
        }
    }

    generateAIResources(skill) {
        const skillLower = skill.toLowerCase();
        
        const resourceDatabase = {
            'javascript': [
                { type: 'video', title: 'JavaScript Crash Course', description: 'Complete JavaScript tutorial for beginners.', link: 'https://www.youtube.com/watch?v=hdI2bqOjy3c' },
                { type: 'text', title: 'JS Cheat Sheet', description: 'Essential ES6+ syntax and methods.', link: 'https://htmlcheatsheet.com/js/' }
            ],
            'react': [
                { type: 'video', title: 'React JS Full Course', description: 'Learn React from scratch in this full course.', link: 'https://www.youtube.com/watch?v=bMknfKXIFA8' },
                { type: 'text', title: 'React Beta Docs', description: 'The official interactive React documentation.', link: 'https://react.dev/' }
            ],
            'python': [
                { type: 'video', title: 'Python for Beginners', description: 'The ultimate Python tutorial for beginners.', link: 'https://www.youtube.com/watch?v=_uQrJ0TkZlc' },
                { type: 'text', title: 'Python Basics Guide', description: 'A comprehensive guide to Python fundamentals.', link: 'https://realpython.com/python-first-steps/' }
            ],
            'node.js': [
                { type: 'video', title: 'Node.js Full Course', description: 'Master Node.js and Express in this tutorial.', link: 'https://www.youtube.com/watch?v=Oe421EPjeBE' },
                { type: 'text', title: 'Node.js Handbook', description: 'A detailed handbook for Node.js development.', link: 'https://flaviocopes.com/page/nodejs-handbook/' }
            ],
            'ui/ux design': [
                { type: 'video', title: 'UI/UX Design Tutorial', description: 'Learn the principles of UI/UX design.', link: 'https://www.youtube.com/watch?v=c9Wg6ndoxag' },
                { type: 'text', title: 'Design System Checklist', description: 'A checklist for building modern design systems.', link: 'https://designsystemchecklist.com/' }
            ],
            'cloud architecture': [
                { type: 'video', title: 'AWS Cloud Practitioner', description: 'Complete AWS Cloud Practitioner course.', link: 'https://www.youtube.com/watch?v=3hLmDS179YE' },
                { type: 'text', title: 'Cloud Design Patterns', description: 'Azure Cloud design patterns documentation.', link: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/' }
            ]
        };

        // Default resources if skill not in database
        const defaultResources = [
            {
                type: 'video',
                title: `Mastering ${skill} - AI Tutorial`,
                description: `Learn the fundamentals and advanced concepts of ${skill} in this AI-selected tutorial.`,
                link: `https://www.youtube.com/results?search_query=${encodeURIComponent(skill + ' tutorial')}`
            },
            {
                type: 'text',
                title: `${skill} Documentation`,
                description: `Official documentation and best practices for ${skill}.`,
                link: `https://www.google.com/search?q=${encodeURIComponent(skill + ' documentation')}`
            }
        ];

        return resourceDatabase[skillLower] || defaultResources;
    }

    renderMySkills(user) {
        const skillsContainer = document.getElementById('my-skills');
        if (!skillsContainer) return;

        if (user.skills.length === 0) {
            skillsContainer.innerHTML = '<div class="empty-state">No skills added yet. Add your first skill above!</div>';
            return;
        }

        skillsContainer.innerHTML = user.skills.map(skill => `
            <div class="skill-tag">
                ${this.escapeHtml(skill)}
                <button class="remove-skill" onclick="window.skillsManager.removeSkill('${this.escapeHtml(skill)}')" title="Remove skill">
                    ×
                </button>
            </div>
        `).join('');
    }

    renderLearnRequests(user) {
        const incomingContainer = document.getElementById('learn-requests-incoming');
        const outgoingContainer = document.getElementById('learn-requests-outgoing');
        
        if (!incomingContainer || !outgoingContainer) return;

        const requests = this.storage.getLearnRequests();
        
        // Incoming Requests (Others want to learn from me)
        const incomingRequests = requests.filter(req => 
            req.teacherId === user.id && req.status === 'pending'
        );

        if (incomingRequests.length === 0) {
            incomingContainer.innerHTML = '<div class="empty-state">No incoming requests</div>';
        } else {
            incomingContainer.innerHTML = incomingRequests.map(request => `
                <div class="request-item">
                    <div class="request-info">
                        <h4>${this.escapeHtml(request.studentName)}</h4>
                        <p>Wants to learn: <strong>${this.escapeHtml(request.skill)}</strong></p>
                        <p class="text-sm text-gray-500">Requested on: ${new Date(request.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div class="request-actions">
                        <button class="btn btn-success btn-sm" onclick="window.skillsManager.acceptLearnRequest('${request.id}')">
                            Accept
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="window.skillsManager.rejectLearnRequest('${request.id}')">
                            Reject
                        </button>
                    </div>
                </div>
            `).join('');
        }

        // Outgoing Requests (I want to learn from others)
        const outgoingRequests = requests.filter(req => 
            req.studentId === user.id
        );

        if (outgoingRequests.length === 0) {
            outgoingContainer.innerHTML = '<div class="empty-state">No outgoing requests</div>';
        } else {
            outgoingContainer.innerHTML = outgoingRequests.map(request => {
                const teacher = this.storage.findUserById(request.teacherId);
                const teacherName = teacher ? teacher.name : 'Unknown User';
                
                let statusClass = 'status-pending';
                if (request.status === 'accepted') statusClass = 'status-accepted';
                if (request.status === 'rejected') statusClass = 'status-rejected';

                return `
                    <div class="request-item">
                        <div class="request-info">
                            <h4>To: ${this.escapeHtml(teacherName)}</h4>
                            <p>Skill: <strong>${this.escapeHtml(request.skill)}</strong></p>
                            <div class="request-status ${statusClass}">${request.status.charAt(0).toUpperCase() + request.status.slice(1)}</div>
                            <p class="text-sm text-gray-500">Sent on: ${new Date(request.createdAt).toLocaleDateString()}</p>
                        </div>
                        <div class="request-actions">
                            ${request.status === 'pending' ? `
                                <button class="btn btn-outline btn-sm" style="color: #f87171; border-color: #f87171;" onclick="window.skillsManager.cancelLearnRequest('${request.id}')">
                                    Cancel Request
                                </button>
                            ` : ''}
                        </div>
                    </div>
                `;
            }).join('');
        }
    }

    cancelLearnRequest(requestId) {
        const requests = this.storage.getLearnRequests();
        const updatedRequests = requests.filter(req => req.id !== requestId);
        
        if (requests.length !== updatedRequests.length) {
            this.storage.saveLearnRequests(updatedRequests);
            this.showToast('Request cancelled and removed', 'success');
            this.loadMyProfile(); // Refresh profile
            
            // If we are currently viewing the profile of the user we just cancelled a request for, refresh that too
            if (window.usersManager && window.usersManager.currentViewingUser) {
                window.usersManager.renderProfileView(window.usersManager.currentViewingUser);
            }
        } else {
            this.showToast('Request not found', 'error');
        }
    }

    renderSharedContacts(user) {
        const contactsContainer = document.getElementById('shared-contacts');
        if (!contactsContainer) return;

        const sharedContacts = this.storage.getSharedContacts();
        const userContacts = sharedContacts.filter(contact => contact.teacherId === user.id);

        if (userContacts.length === 0) {
            contactsContainer.innerHTML = '<div class="empty-state">No shared contacts yet</div>';
            return;
        }

        contactsContainer.innerHTML = userContacts.map(contact => `
            <div class="contact-item">
                <div class="contact-info">
                    <h4>${this.escapeHtml(contact.studentName)}</h4>
                    <p>Learning: <strong>${this.escapeHtml(contact.skill)}</strong></p>
                    <p>Email: <a href="mailto:${contact.studentEmail}">${this.escapeHtml(contact.studentEmail)}</a></p>
                    <p class="text-sm text-gray-500">Connected on: ${new Date(contact.sharedAt).toLocaleDateString()}</p>
                </div>
            </div>
        `).join('');
    }

    renderMySkills(user) {
        const skillsContainer = document.getElementById('my-skills');
        if (!skillsContainer) return;

        if (user.skills.length === 0) {
            skillsContainer.innerHTML = '<div class="empty-state">No skills added yet. Add your first skill above!</div>';
            return;
        }

        skillsContainer.innerHTML = user.skills.map(skillObj => {
            const name = typeof skillObj === 'string' ? skillObj : skillObj.name;
            const hasVideo = skillObj.video ? '✅ Video' : '❌ No Video';
            const hasText = skillObj.text ? '✅ Notes' : '❌ No Notes';

            return `
                <div class="skill-resource-card">
                    <div class="skill-header">
                        <h4>${this.escapeHtml(name)}</h4>
                        <button class="remove-skill-btn" onclick="window.skillsManager.removeSkill('${this.escapeHtml(name)}')" title="Remove skill">×</button>
                    </div>
                    <div class="skill-resources-status">
                        <span>${hasVideo}</span>
                        <span>${hasText}</span>
                    </div>
                </div>
            `;
        }).join('');
    }

    handleAddSkill(e) {
        e.preventDefault();
        
        const nameInput = document.getElementById('new-skill');
        const videoInput = document.getElementById('skill-video');
        const textInput = document.getElementById('skill-text');

        const name = nameInput.value.trim();
        const video = videoInput.value.trim();
        const text = textInput.value.trim();

        if (!name) {
            this.showToast('Please enter a skill name', 'error');
            return;
        }

        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        // Check if skill already exists (handle both string and object formats for safety)
        const exists = currentUser.skills.some(s => {
            const sName = typeof s === 'string' ? s : s.name;
            return sName.toLowerCase() === name.toLowerCase();
        });

        if (exists) {
            this.showToast('You already have this skill', 'warning');
            return;
        }

        // Add skill object to user
        const newSkillObj = { name, video, text };
        const updatedSkills = [...currentUser.skills, newSkillObj];
        const updatedUser = this.storage.updateUser(currentUser.id, { skills: updatedSkills });

        if (updatedUser) {
            this.showToast('Skill and resources added!', 'success');
            nameInput.value = '';
            videoInput.value = '';
            textInput.value = '';
            this.loadMyProfile(); // Refresh the profile
        } else {
            this.showToast('Failed to add skill', 'error');
        }
    }

    removeSkill(skillName) {
        const currentUser = this.auth.getCurrentUser();
        if (!currentUser) return;

        const updatedSkills = currentUser.skills.filter(s => {
            const sName = typeof s === 'string' ? s : s.name;
            return sName !== skillName;
        });
        
        const updatedUser = this.storage.updateUser(currentUser.id, { skills: updatedSkills });

        if (updatedUser) {
            this.showToast('Skill removed', 'success');
            this.loadMyProfile(); // Refresh the profile
        } else {
            this.showToast('Failed to remove skill', 'error');
        }
    }

    acceptLearnRequest(requestId) {
        const requests = this.storage.getLearnRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            this.showToast('Request not found', 'error');
            return;
        }

        const request = requests[requestIndex];
        
        // Update request status
        requests[requestIndex].status = 'accepted';
        requests[requestIndex].acceptedAt = new Date().toISOString();
        this.storage.saveLearnRequests(requests);

        // Add to shared contacts
        const sharedContacts = this.storage.getSharedContacts();
        const sharedContact = {
            id: this.storage.generateId(),
            teacherId: request.teacherId,
            studentId: request.studentId,
            studentName: request.studentName,
            studentEmail: request.studentEmail,
            skill: request.skill,
            sharedAt: new Date().toISOString()
        };

        sharedContacts.push(sharedContact);
        this.storage.saveSharedContacts(sharedContacts);

        this.showToast(`Contact information shared with ${request.studentName}!`, 'success');
        this.loadMyProfile(); // Refresh the profile
    }

    rejectLearnRequest(requestId) {
        const requests = this.storage.getLearnRequests();
        const requestIndex = requests.findIndex(req => req.id === requestId);

        if (requestIndex === -1) {
            this.showToast('Request not found', 'error');
            return;
        }

        // Update request status
        requests[requestIndex].status = 'rejected';
        requests[requestIndex].rejectedAt = new Date().toISOString();
        this.storage.saveLearnRequests(requests);

        this.showToast('Learn request rejected', 'info');
        this.loadMyProfile(); // Refresh the profile
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

// Initialize global skills manager
window.skillsManager = new SkillsManager(window.storageManager, window.authManager);