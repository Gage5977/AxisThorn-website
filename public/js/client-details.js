// Client Details JavaScript
(function() {
    'use strict';

    let currentClient = null;
    let clientId = null;

    // Initialize client details page
    function initClientDetails() {
        // Check admin access
        const user = AuthClient.getUser();
        if (!user || user.role !== 'admin') {
            window.location.href = '/login.html';
            return;
        }

        // Get client ID from URL
        const urlParams = new URLSearchParams(window.location.search);
        clientId = urlParams.get('id');
        
        if (!clientId) {
            window.location.href = '/admin-dashboard.html#clients';
            return;
        }

        loadClientData();
        setupTabs();
        setupEventListeners();
    }

    // Load client data
    async function loadClientData() {
        try {
            const response = await AuthClient.authenticatedFetch(`/api/admin/clients/${clientId}`);
            if (!response.ok) {
                throw new Error('Client not found');
            }

            currentClient = await response.json();
            updateClientInfo();
            loadTabData('overview');
        } catch (error) {
            console.error('Failed to load client:', error);
            ErrorHandler.showError('Failed to load client data');
            setTimeout(() => {
                window.location.href = '/admin-dashboard.html#clients';
            }, 2000);
        }
    }

    // Update client info in UI
    function updateClientInfo() {
        document.getElementById('client-name').textContent = currentClient.name;
        document.getElementById('client-company').textContent = currentClient.company || 'No company';
        document.getElementById('client-email').textContent = currentClient.email;
        
        const statusBadge = document.getElementById('client-status');
        statusBadge.textContent = currentClient.status;
        statusBadge.className = `status-badge ${currentClient.status}`;

        // Overview tab info
        document.getElementById('info-email').textContent = currentClient.email;
        document.getElementById('info-since').textContent = formatDate(currentClient.createdAt);
        document.getElementById('info-last-activity').textContent = formatRelativeTime(currentClient.lastActivity);
    }

    // Setup tabs
    function setupTabs() {
        const tabs = document.querySelectorAll('.tab');
        const tabContents = document.querySelectorAll('.tab-content');

        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = tab.dataset.tab;

                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');

                // Show corresponding content
                tabContents.forEach(content => {
                    content.style.display = 'none';
                });
                document.getElementById(`${tabName}-tab`).style.display = 'block';

                // Load tab data
                loadTabData(tabName);
            });
        });
    }

    // Load tab-specific data
    async function loadTabData(tabName) {
        switch(tabName) {
            case 'overview':
                loadActivityTimeline();
                break;
            case 'services':
                loadServices();
                break;
            case 'documents':
                loadDocuments();
                break;
            case 'billing':
                loadBilling();
                break;
            case 'activity':
                loadFullActivity();
                break;
            case 'notes':
                loadNotes();
                break;
        }
    }

    // Load activity timeline
    async function loadActivityTimeline() {
        const activities = [
            {
                title: 'Document Uploaded',
                description: 'Financial statement Q3 2024',
                timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
                active: true
            },
            {
                title: 'Payment Received',
                description: '$50,000 - Invoice #2024-011',
                timestamp: new Date(Date.now() - 24 * 3600000).toISOString()
            },
            {
                title: 'Service Completed',
                description: 'Portfolio optimization analysis',
                timestamp: new Date(Date.now() - 48 * 3600000).toISOString()
            }
        ];

        const timeline = document.getElementById('activity-timeline');
        timeline.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-dot ${activity.active ? 'active' : ''}"></div>
                <div class="timeline-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="timeline-time">${formatRelativeTime(activity.timestamp)}</span>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    // Load services
    function loadServices() {
        const servicesGrid = document.getElementById('services-grid');
        servicesGrid.innerHTML = '';

        const allServices = [
            { name: 'Financial Systems', icon: '📊', active: false },
            { name: 'Portfolio Engineering', icon: '💼', active: false },
            { name: 'Contract Automation', icon: '📝', active: false }
        ];

        allServices.forEach(service => {
            const isActive = currentClient.services.includes(service.name);
            const card = document.createElement('div');
            card.className = `service-card ${isActive ? 'active' : ''}`;
            card.innerHTML = `
                <div class="service-icon">${service.icon}</div>
                <h4>${service.name}</h4>
                <p>${isActive ? 'Active' : 'Not Active'}</p>
            `;
            servicesGrid.appendChild(card);
        });
    }

    // Load documents
    async function loadDocuments() {
        try {
            const response = await AuthClient.authenticatedFetch(`/api/clients/${clientId}/documents`);
            const documents = await response.json();

            const documentsList = document.getElementById('documents-list');
            documentsList.innerHTML = '';

            if (documents.length === 0) {
                documentsList.innerHTML = '<p style="text-align: center; padding: var(--space-8); color: var(--axis-neutral-400);">No documents uploaded yet</p>';
                return;
            }

            documents.forEach(doc => {
                const item = document.createElement('div');
                item.className = 'document-item';
                item.innerHTML = `
                    <div class="document-info">
                        <div class="document-icon">${getFileIcon(doc.type)}</div>
                        <div>
                            <div>${doc.name}</div>
                            <div class="document-meta">${formatFileSize(doc.size)} • ${formatDate(doc.uploadedAt)}</div>
                        </div>
                    </div>
                    <div>
                        <button class="btn-2025" style="font-size: var(--text-sm);" onclick="downloadDocument('${doc.id}')">Download</button>
                        <button class="btn-2025" style="font-size: var(--text-sm); color: var(--axis-accent-error);" onclick="deleteDocument('${doc.id}')">Delete</button>
                    </div>
                `;
                documentsList.appendChild(item);
            });
        } catch (error) {
            console.error('Failed to load documents:', error);
        }
    }

    // Load billing info
    async function loadBilling() {
        // This would load actual billing data from the API
        console.log('Loading billing data for client:', clientId);
    }

    // Load full activity
    async function loadFullActivity() {
        // This would load complete activity history from the API
        const activities = [];
        for (let i = 0; i < 20; i++) {
            activities.push({
                title: ['Document Uploaded', 'Payment Received', 'Service Updated', 'Note Added'][Math.floor(Math.random() * 4)],
                description: 'Activity description here',
                timestamp: new Date(Date.now() - i * 24 * 3600000).toISOString()
            });
        }

        const timeline = document.getElementById('full-activity-timeline');
        timeline.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'timeline-item';
            item.innerHTML = `
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${activity.title}</h4>
                    <p>${activity.description}</p>
                    <span class="timeline-time">${formatDate(activity.timestamp)}</span>
                </div>
            `;
            timeline.appendChild(item);
        });
    }

    // Load notes
    async function loadNotes() {
        try {
            const response = await AuthClient.authenticatedFetch(`/api/admin/clients/${clientId}/notes`);
            const notes = await response.json();

            const notesList = document.getElementById('notes-list');
            notesList.innerHTML = '';

            if (notes.length === 0) {
                notesList.innerHTML = '<p style="text-align: center; padding: var(--space-4); color: var(--axis-neutral-400);">No notes yet</p>';
                return;
            }

            notes.forEach(note => {
                const item = document.createElement('div');
                item.className = 'note-item';
                item.innerHTML = `
                    <div class="note-header">
                        <span class="note-author">${note.author}</span>
                        <span class="note-time">${formatRelativeTime(note.createdAt)}</span>
                    </div>
                    <div class="note-content">${note.content}</div>
                `;
                notesList.appendChild(item);
            });
        } catch (error) {
            console.error('Failed to load notes:', error);
        }
    }

    // Setup event listeners
    function setupEventListeners() {
        // Logout
        const logoutLink = document.querySelector('.logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                AuthClient.logout();
                window.location.href = '/login.html';
            });
        }

        // Add note form
        const addNoteForm = document.getElementById('add-note-form');
        if (addNoteForm) {
            addNoteForm.addEventListener('submit', handleAddNote);
        }
    }

    // Handle add note
    async function handleAddNote(e) {
        e.preventDefault();
        
        const content = document.getElementById('note-content').value.trim();
        if (!content) return;

        try {
            const response = await AuthClient.authenticatedFetch(`/api/admin/clients/${clientId}/notes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content })
            });

            if (response.ok) {
                document.getElementById('note-content').value = '';
                loadNotes();
                ErrorHandler.showSuccess('Note added successfully');
            }
        } catch (error) {
            console.error('Failed to add note:', error);
            ErrorHandler.showError('Failed to add note');
        }
    }

    // Window functions
    window.editClient = function() {
        // Implementation for editing client
        console.log('Edit client:', clientId);
    };

    window.sendMessage = function() {
        window.location.href = `mailto:${currentClient.email}`;
    };

    window.uploadDocument = function() {
        // Implementation for uploading document
        console.log('Upload document for client:', clientId);
    };

    window.downloadDocument = function(docId) {
        // Implementation for downloading document
        console.log('Download document:', docId);
    };

    window.deleteDocument = async function(docId) {
        if (!confirm('Are you sure you want to delete this document?')) return;

        try {
            const response = await AuthClient.authenticatedFetch(`/api/documents/${docId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                loadDocuments();
                ErrorHandler.showSuccess('Document deleted successfully');
            }
        } catch (error) {
            console.error('Failed to delete document:', error);
            ErrorHandler.showError('Failed to delete document');
        }
    };

    // Utility functions
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    function formatRelativeTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);
        
        if (minutes < 60) return `${minutes}m ago`;
        if (hours < 24) return `${hours}h ago`;
        if (days < 7) return `${days}d ago`;
        return formatDate(timestamp);
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function getFileIcon(fileType) {
        const icons = {
            'pdf': '📄',
            'doc': '📝',
            'docx': '📝',
            'xls': '📊',
            'xlsx': '📊',
            'png': '🖼️',
            'jpg': '🖼️',
            'jpeg': '🖼️',
            'default': '📎'
        };
        
        const ext = fileType.split('/').pop().toLowerCase();
        return icons[ext] || icons.default;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initClientDetails);
    } else {
        initClientDetails();
    }
})();