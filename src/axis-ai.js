// Axis AI Landing Page Interactions

document.addEventListener('DOMContentLoaded', function() {
    // Tab functionality
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanels = document.querySelectorAll('.tab-panel');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabId = button.getAttribute('data-tab');
            
            // Remove active class from all
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanels.forEach(panel => panel.classList.remove('active'));
            
            // Add active class to clicked
            button.classList.add('active');
            document.getElementById(tabId).classList.add('active');
        });
    });
    
    // Add more tab content dynamically
    const tabContent = {
        'family-offices': {
            title: 'Family Office Solutions',
            items: [
                {
                    title: 'Wealth Preservation',
                    description: 'AI-powered strategies to protect and grow multi-generational wealth through market cycles.'
                },
                {
                    title: 'Tax Optimization',
                    description: 'Intelligent tax planning that minimizes liabilities while maintaining compliance.'
                },
                {
                    title: 'Estate Planning',
                    description: 'Automated scenario modeling for complex estate structures and succession planning.'
                }
            ]
        },
        'institutions': {
            title: 'Institutional Solutions',
            items: [
                {
                    title: 'Portfolio Management',
                    description: 'Manage billions in assets with AI that optimizes across thousands of positions simultaneously.'
                },
                {
                    title: 'Regulatory Compliance',
                    description: 'Automated monitoring and reporting for SEC, FINRA, and international regulations.'
                },
                {
                    title: 'Risk Analytics',
                    description: 'Real-time risk assessment with stress testing and scenario analysis.'
                }
            ]
        },
        'advisors': {
            title: 'Advisor Solutions',
            items: [
                {
                    title: 'Client Analytics',
                    description: 'Deep insights into client portfolios with personalized recommendation engines.'
                },
                {
                    title: 'Proposal Generation',
                    description: 'AI-generated investment proposals tailored to each client\'s unique situation.'
                },
                {
                    title: 'Market Research',
                    description: 'Comprehensive market analysis and reporting tools powered by machine learning.'
                }
            ]
        }
    };
    
    // Populate tab content
    Object.keys(tabContent).forEach(tabId => {
        const panel = document.getElementById(tabId);
        if (panel) {
            const content = tabContent[tabId];
            panel.innerHTML = `
                <h3>${content.title}</h3>
                <div class="solution-grid">
                    ${content.items.map(item => `
                        <div class="solution-item">
                            <h4>${item.title}</h4>
                            <p>${item.description}</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }
    });
    
    // Animate capability cards on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.capability-card').forEach(card => {
        card.style.opacity = '0';
        observer.observe(card);
    });
    
    // Demo animation
    const processingSteps = document.querySelectorAll('.processing-step');
    let currentStep = 0;
    
    function animateDemo() {
        if (currentStep < processingSteps.length) {
            processingSteps[currentStep].classList.add('completed');
            currentStep++;
            setTimeout(animateDemo, 800);
        } else {
            // Reset after completion
            setTimeout(() => {
                processingSteps.forEach(step => step.classList.remove('completed'));
                currentStep = 0;
                setTimeout(animateDemo, 1000);
            }, 3000);
        }
    }
    
    // Start demo animation when visible
    const demoSection = document.querySelector('.demo-section');
    const demoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateDemo();
                demoObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (demoSection) {
        demoObserver.observe(demoSection);
    }
});

// Add fadeInUp animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);