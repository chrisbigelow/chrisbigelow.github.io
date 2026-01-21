// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // Clear localStorage to start fresh (remove this line after first load)
    localStorage.removeItem('todoState');
    
    // Todo list functionality
    const todoItems = document.querySelectorAll('.todo-item input[type="checkbox"]');
    
    todoItems.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const todoItem = this.closest('.todo-item');
            
            if (this.checked) {
                todoItem.classList.add('completed');
            } else {
                todoItem.classList.remove('completed');
            }
            
            // Save to localStorage
            saveTodoState();
        });
    });
    
    // Load todo state from localStorage
    function loadTodoState() {
        const savedState = localStorage.getItem('todoState');
        if (savedState) {
            const state = JSON.parse(savedState);
            todoItems.forEach((checkbox, index) => {
                if (state[index]) {
                    checkbox.checked = true;
                    checkbox.closest('.todo-item').classList.add('completed');
                }
            });
        }
    }
    
    // Save todo state to localStorage
    function saveTodoState() {
        const state = Array.from(todoItems).map(checkbox => checkbox.checked);
        localStorage.setItem('todoState', JSON.stringify(state));
    }
    
    // Load saved state on page load
    loadTodoState();
    
    // Todo filtering functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const todoItemElements = document.querySelectorAll('.todo-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active state
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter todo items
            todoItemElements.forEach(item => {
                if (filter === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filter) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 20;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fetch GitHub repositories
    async function fetchGitHubRepos() {
        const username = 'chrisbigelow';
        const reposContainer = document.getElementById('github-repos');
        
        try {
            const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100&type=all`);
            
            if (!response.ok) {
                throw new Error('Failed to fetch repositories');
            }
            
            const repos = await response.json();
            
            // Filter out forks and sort by most recently updated
            const filteredRepos = repos
                .filter(repo => !repo.fork)
                .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
            
            if (filteredRepos.length === 0) {
                reposContainer.innerHTML = '<p style="color: #6b7280; text-align: center;">No repositories found.</p>';
                return;
            }
            
            // Display repos in thin tile format
            reposContainer.innerHTML = '<div class="github-repos-grid"></div>';
            const grid = reposContainer.querySelector('.github-repos-grid');
            
            filteredRepos.forEach(repo => {
                const repoCard = document.createElement('a');
                repoCard.href = repo.html_url;
                repoCard.target = '_blank';
                repoCard.className = 'github-repo-card';
                
                const updatedDate = new Date(repo.updated_at);
                const daysAgo = Math.floor((new Date() - updatedDate) / (1000 * 60 * 60 * 24));
                const timeAgo = daysAgo === 0 ? 'today' : daysAgo === 1 ? '1 day ago' : `${daysAgo} days ago`;
                
                repoCard.innerHTML = `
                    <div class="repo-name">${repo.name}</div>
                    <div class="repo-footer">
                        ${repo.language ? `<span class="repo-language">${repo.language}</span>` : ''}
                        <span class="repo-updated">${timeAgo}</span>
                        <span class="repo-visibility">${repo.private ? '🔒' : '🌐'}</span>
                    </div>
                `;
                
                grid.appendChild(repoCard);
            });
            
        } catch (error) {
            console.error('Error fetching GitHub repos:', error);
            reposContainer.innerHTML = '<p style="color: #dc2626; text-align: center;">Failed to load repositories. Please try again later.</p>';
        }
    }
    
    // Load GitHub repos on page load
    fetchGitHubRepos();
    
    // 100% Human Author Badge Popup
    function initHumanAuthorBadge() {
        // Create popup overlay if it doesn't exist
        let popupOverlay = document.getElementById('human-author-popup-overlay');
        if (!popupOverlay) {
            popupOverlay = document.createElement('div');
            popupOverlay.id = 'human-author-popup-overlay';
            popupOverlay.className = 'human-author-popup-overlay';
            popupOverlay.innerHTML = `
                <div class="human-author-popup">
                    <div class="human-author-popup-header">
                        <h3 class="human-author-popup-title">100% Human Author</h3>
                        <button class="human-author-popup-close" aria-label="Close">×</button>
                    </div>
                    <div class="human-author-popup-content">
                        I hate reading slop. I use AI for research but I never use AI to write out what I publish.
                    </div>
                </div>
            `;
            document.body.appendChild(popupOverlay);
        }
        
        // Get all badges
        const badges = document.querySelectorAll('.human-author-badge');
        
        badges.forEach(badge => {
            badge.addEventListener('click', function(e) {
                // Prevent navigation if badge is inside a link
                e.preventDefault();
                e.stopPropagation();
                
                // Show popup
                popupOverlay.classList.add('active');
            });
        });
        
        // Close popup handlers
        const closeBtn = popupOverlay.querySelector('.human-author-popup-close');
        closeBtn.addEventListener('click', function() {
            popupOverlay.classList.remove('active');
        });
        
        // Close popup when clicking overlay
        popupOverlay.addEventListener('click', function(e) {
            if (e.target === popupOverlay) {
                popupOverlay.classList.remove('active');
            }
        });
        
        // Close popup with Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && popupOverlay.classList.contains('active')) {
                popupOverlay.classList.remove('active');
            }
        });
    }
    
    // Initialize badge popup
    initHumanAuthorBadge();
}); 