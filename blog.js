// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {

    // Blog sorting functionality
    const sortButtons = document.querySelectorAll('.blog-sort-controls .filter-btn');
    const blogPostsContainer = document.getElementById('blog-posts');

    if (sortButtons.length > 0 && blogPostsContainer) {
        sortButtons.forEach(button => {
            button.addEventListener('click', function() {
                const sortType = this.getAttribute('data-sort');

                // Update active state
                sortButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');

                // Get all blog post cards
                const posts = Array.from(blogPostsContainer.querySelectorAll('.blog-post-card'));

                // Sort posts based on selected criteria
                posts.sort((a, b) => {
                    if (sortType === 'date-desc') {
                        return new Date(b.getAttribute('data-date')) - new Date(a.getAttribute('data-date'));
                    } else if (sortType === 'date-asc') {
                        return new Date(a.getAttribute('data-date')) - new Date(b.getAttribute('data-date'));
                    }
                    return 0;
                });

                // Re-append posts in new order
                posts.forEach(post => {
                    blogPostsContainer.appendChild(post);
                });
            });
        });
    }
    
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
            
            // Close popup handlers (only set up once)
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
        
        // Get all badges that haven't been initialized yet
        const badges = document.querySelectorAll('.human-author-badge:not([data-popup-initialized])');
        
        badges.forEach(badge => {
            // Mark as initialized
            badge.setAttribute('data-popup-initialized', 'true');
            
            badge.addEventListener('click', function(e) {
                // Prevent navigation if badge is inside a link
                e.preventDefault();
                e.stopPropagation();
                
                // Show popup
                popupOverlay.classList.add('active');
            });
        });
    }
    
    // Initialize badge popup
    initHumanAuthorBadge();
});
