// Utility function to extract plain text from HTML and generate excerpt
function extractExcerpt(htmlContent, maxLength = 160) {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;
    
    // Get all text content, preserving some structure
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    // Truncate to max length, trying to end at a word boundary
    if (text.length > maxLength) {
        text = text.substring(0, maxLength);
        const lastSpace = text.lastIndexOf(' ');
        if (lastSpace > maxLength * 0.8) { // Only break at word if we're not too close to the start
            text = text.substring(0, lastSpace);
        }
        text = text.trim() + '...';
    }
    
    return text;
}

// Function to update meta tags with excerpt
function updateMetaTags(excerpt) {
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.setAttribute('content', excerpt);
    }
    
    // Update Open Graph description
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
        ogDescription.setAttribute('content', excerpt);
    }
    
    // Update Twitter description
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) {
        twitterDescription.setAttribute('content', excerpt);
    }
    
    // Update JSON-LD description
    const jsonLdScripts = document.querySelectorAll('script[type="application/ld+json"]');
    jsonLdScripts.forEach(script => {
        try {
            const data = JSON.parse(script.textContent);
            if (data['@type'] === 'BlogPosting' && data.description) {
                data.description = excerpt;
                script.textContent = JSON.stringify(data);
            }
        } catch (e) {
            // Ignore JSON parse errors
        }
    });
}

// Function to fetch and extract excerpt from a blog post URL
async function fetchBlogExcerpt(postUrl) {
    try {
        const response = await fetch(postUrl);
        if (!response.ok) return null;
        
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        
        const contentElement = doc.querySelector('.blog-article-content');
        if (!contentElement) return null;
        
        return extractExcerpt(contentElement.innerHTML, 200);
    } catch (error) {
        console.error('Error fetching blog excerpt:', error);
        return null;
    }
}

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
    
    // Auto-generate excerpts for blog post cards on listing pages
    // DISABLED: Excerpts are now set manually in the HTML
    // async function updateBlogPostExcerpts() {
    //     const blogPostCards = document.querySelectorAll('.blog-post-card');
    //     
    //     for (const card of blogPostCards) {
    //         const excerptElement = card.querySelector('.blog-post-excerpt');
    //         if (!excerptElement) continue;
    //         
    //         // Skip if already has a data attribute indicating it was auto-generated
    //         if (excerptElement.hasAttribute('data-auto-excerpt')) continue;
    //         
    //         const postUrl = card.getAttribute('href');
    //         if (!postUrl) continue;
    //         
    //         // Handle relative URLs
    //         const fullUrl = postUrl.startsWith('http') ? postUrl : 
    //                       postUrl.startsWith('/') ? window.location.origin + postUrl :
    //                       window.location.origin + window.location.pathname.replace(/\/[^\/]*$/, '/') + postUrl;
    //         
    //         const excerpt = await fetchBlogExcerpt(fullUrl);
    //         if (excerpt) {
    //             excerptElement.textContent = excerpt;
    //             excerptElement.setAttribute('data-auto-excerpt', 'true');
    //         }
    //     }
    // }
    // 
    // // Update excerpts on blog listing page
    // if (document.getElementById('blog-posts')) {
    //     updateBlogPostExcerpts();
    // }
});
