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
}); 