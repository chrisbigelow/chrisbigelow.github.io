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
                    } else if (sortType === 'views') {
                        return parseInt(b.getAttribute('data-views')) - parseInt(a.getAttribute('data-views'));
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
});
