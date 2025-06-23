// Admin Dashboard JavaScript
(function() {
    'use strict';

    // Check if user is admin
    function checkAdminAccess() {
        const user = AuthClient.getUser();
        if (!user || user.role !== 'admin') {
            window.location.href = '/login.html';
            return false;
        }
        return true;
    }

    // Initialize dashboard
    function initDashboard() {
        if (!checkAdminAccess()) return;

        loadAnalytics();
        setupNavigation();
        setupEventListeners();
        startRealtimeUpdates();
    }

    // Load analytics data
    async function loadAnalytics() {
        try {
            const response = await AuthClient.authenticatedFetch('/api/admin/analytics');
            const data = await response.json();

            updateOverviewStats(data.overview);
            updateRevenueChart(data.revenue);
            updateActivityFeed(data.activities);
            updateClientsList(data.clients);
        } catch (error) {
            console.error('Failed to load analytics:', error);
            ErrorHandler.showError('Failed to load analytics data');
        }
    }

    // Update overview statistics
    function updateOverviewStats(stats) {
        document.getElementById('total-revenue').textContent = formatCurrency(stats.totalRevenue);
        document.getElementById('active-clients').textContent = stats.activeClients;
        document.getElementById('avg-project-value').textContent = formatCurrency(stats.avgProjectValue);
        document.getElementById('system-uptime').textContent = `${stats.systemUptime}%`;
    }

    // Update revenue chart
    function updateRevenueChart(revenueData) {
        const ctx = document.getElementById('revenue-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'line',
            data: {
                labels: revenueData.labels,
                datasets: [{
                    label: 'Revenue',
                    data: revenueData.values,
                    borderColor: '#0066FF',
                    backgroundColor: 'rgba(0, 102, 255, 0.1)',
                    tension: 0.3,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatCurrency(value);
                            },
                            color: '#9CA3AF'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#9CA3AF'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                        }
                    }
                }
            }
        });
    }

    // Update activity feed
    function updateActivityFeed(activities) {
        const activityList = document.getElementById('activity-list');
        activityList.innerHTML = '';

        activities.forEach(activity => {
            const item = document.createElement('div');
            item.className = 'activity-item';
            item.innerHTML = `
                <div class="activity-content">
                    <p>${activity.description}</p>
                    <span class="activity-time">${formatRelativeTime(activity.timestamp)}</span>
                </div>
            `;
            activityList.appendChild(item);
        });
    }

    // Update clients list
    function updateClientsList(clients) {
        const tbody = document.getElementById('clients-table-body');
        if (!tbody) return;

        tbody.innerHTML = '';

        clients.forEach(client => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${client.name}</td>
                <td>${client.company || '-'}</td>
                <td><span class="status-badge ${client.status}">${client.status}</span></td>
                <td>${client.services.join(', ')}</td>
                <td>${formatRelativeTime(client.lastActivity)}</td>
                <td>
                    <button class="btn-2025" style="font-size: var(--text-sm);" onclick="viewClient('${client.id}')">View</button>
                    <button class="btn-2025" style="font-size: var(--text-sm);" onclick="editClient('${client.id}')">Edit</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    }

    // Setup navigation
    function setupNavigation() {
        const navItems = document.querySelectorAll('.nav-item');
        const sections = document.querySelectorAll('.dashboard-section');

        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.dataset.section;

                // Update nav
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');

                // Update sections
                sections.forEach(section => {
                    section.style.display = 'none';
                });
                
                const targetSection = document.getElementById(`${sectionId}-section`);
                if (targetSection) {
                    targetSection.style.display = 'block';
                    
                    // Load section-specific data
                    loadSectionData(sectionId);
                }
            });
        });
    }

    // Load section-specific data
    async function loadSectionData(section) {
        switch(section) {
            case 'revenue':
                await loadRevenueData();
                break;
            case 'services':
                await loadServicesData();
                break;
            case 'system':
                await loadSystemData();
                break;
        }
    }

    // Load revenue data
    async function loadRevenueData() {
        try {
            const response = await AuthClient.authenticatedFetch('/api/admin/revenue');
            const data = await response.json();

            document.getElementById('mrr').textContent = formatCurrency(data.mrr);
            document.getElementById('arr').textContent = formatCurrency(data.arr);
            document.getElementById('outstanding').textContent = formatCurrency(data.outstanding);

            updateServiceRevenueChart(data.serviceRevenue);
        } catch (error) {
            console.error('Failed to load revenue data:', error);
        }
    }

    // Update service revenue chart
    function updateServiceRevenueChart(data) {
        const ctx = document.getElementById('service-revenue-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: data.labels,
                datasets: [{
                    data: data.values,
                    backgroundColor: [
                        '#0066FF',
                        '#00FF88',
                        '#FF0066'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#9CA3AF'
                        }
                    }
                }
            }
        });
    }

    // Load system data
    async function loadSystemData() {
        try {
            const response = await AuthClient.authenticatedFetch('/api/admin/system');
            const data = await response.json();

            document.getElementById('active-sessions').textContent = data.activeSessions;
            updatePerformanceChart(data.performance);
        } catch (error) {
            console.error('Failed to load system data:', error);
        }
    }

    // Update performance chart
    function updatePerformanceChart(data) {
        const ctx = document.getElementById('performance-chart');
        if (!ctx) return;

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: data.labels,
                datasets: [{
                    label: 'Response Time (ms)',
                    data: data.responseTimes,
                    backgroundColor: '#0066FF',
                    barPercentage: 0.6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: '#9CA3AF'
                        },
                        grid: {
                            color: 'rgba(156, 163, 175, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#9CA3AF'
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // Setup event listeners
    function setupEventListeners() {
        // Client search
        const searchInput = document.getElementById('client-search');
        if (searchInput) {
            searchInput.addEventListener('input', debounce(searchClients, 300));
        }

        // Add client form
        const addClientForm = document.getElementById('add-client-form');
        if (addClientForm) {
            addClientForm.addEventListener('submit', handleAddClient);
        }

        // Logout
        const logoutLink = document.querySelector('.logout-link');
        if (logoutLink) {
            logoutLink.addEventListener('click', (e) => {
                e.preventDefault();
                AuthClient.logout();
                window.location.href = '/login.html';
            });
        }
    }

    // Search clients
    async function searchClients(e) {
        const query = e.target.value;
        
        try {
            const response = await AuthClient.authenticatedFetch(`/api/admin/clients/search?q=${encodeURIComponent(query)}`);
            const clients = await response.json();
            updateClientsList(clients);
        } catch (error) {
            console.error('Search failed:', error);
        }
    }

    // Handle add client
    async function handleAddClient(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('client-name').value,
            email: document.getElementById('client-email').value,
            company: document.getElementById('client-company').value,
            services: Array.from(document.getElementById('client-services').selectedOptions).map(opt => opt.value)
        };

        try {
            const response = await AuthClient.authenticatedFetch('/api/admin/clients', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                closeAddClientModal();
                loadAnalytics();
                ErrorHandler.showSuccess('Client added successfully');
            }
        } catch (error) {
            console.error('Failed to add client:', error);
            ErrorHandler.showError('Failed to add client');
        }
    }

    // Start realtime updates
    function startRealtimeUpdates() {
        setInterval(async () => {
            try {
                const response = await AuthClient.authenticatedFetch('/api/admin/realtime');
                const data = await response.json();
                
                document.getElementById('active-sessions').textContent = data.activeSessions;
                
                // Update activity feed if new activities
                if (data.newActivities && data.newActivities.length > 0) {
                    updateActivityFeed(data.newActivities);
                }
            } catch (error) {
                console.error('Realtime update failed:', error);
            }
        }, 30000); // Update every 30 seconds
    }

    // Export analytics
    window.exportAnalytics = async function() {
        try {
            const response = await AuthClient.authenticatedFetch('/api/admin/export');
            const blob = await response.blob();
            
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `analytics-report-${new Date().toISOString().split('T')[0]}.pdf`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed:', error);
            ErrorHandler.showError('Failed to export analytics');
        }
    };

    // Refresh data
    window.refreshData = function() {
        loadAnalytics();
        ErrorHandler.showSuccess('Data refreshed');
    };

    // View client
    window.viewClient = function(clientId) {
        window.location.href = `/client-details.html?id=${clientId}`;
    };

    // Edit client
    window.editClient = function(clientId) {
        // Implementation for editing client
        console.log('Edit client:', clientId);
    };

    // Show add client modal
    window.showAddClientModal = function() {
        document.getElementById('add-client-modal').style.display = 'flex';
    };

    // Close add client modal
    window.closeAddClientModal = function() {
        document.getElementById('add-client-modal').style.display = 'none';
        document.getElementById('add-client-form').reset();
    };

    // Utility functions
    function formatCurrency(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
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
        return `${days}d ago`;
    }

    function debounce(func, wait) {
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

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDashboard);
    } else {
        initDashboard();
    }
})();