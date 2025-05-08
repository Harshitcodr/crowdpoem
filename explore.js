explore
/* 
   Poetic Haven - Explore Page JavaScript
   Handles filtering, sorting, and interactions for the explore page
*/

document.addEventListener('DOMContentLoaded', function() {
    // Filter functionality
    const filterBtns = document.querySelectorAll('.filter-btn');
    const workCards = document.querySelectorAll('.work-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.getAttribute('data-filter');
            
            // Filter works
            workCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                } else {
                    if (card.getAttribute('data-category') === filter) {
                        card.style.display = 'flex';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
            
            // Animate cards
            animateCards();
        });
    });
    
    // Sort functionality
    const sortSelect = document.querySelector('.sort-select');
    
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const worksContainer = document.querySelector('.works-container');
            const cards = Array.from(workCards);
            
            // Sort cards based on selected option
            switch (sortValue) {
                case 'newest':
                    // Simulating sort by date (newest first)
                    // In a real app, you would have actual date data
                    shuffleArray(cards);
                    break;
                case 'oldest':
                    // Simulating sort by date (oldest first)
                    shuffleArray(cards);
                    cards.reverse();
                    break;
                case 'popular':
                    // Sort by likes count
                    cards.sort((a, b) => {
                        const aLikes = parseInt(a.querySelector('.work-meta span:first-child').textContent.match(/\d+/)[0]);
                        const bLikes = parseInt(b.querySelector('.work-meta span:first-child').textContent.match(/\d+/)[0]);
                        return bLikes - aLikes;
                    });
                    break;
                case 'comments':
                    // Sort by comments count
                    cards.sort((a, b) => {
                        const aComments = parseInt(a.querySelector('.work-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
                        const bComments = parseInt(b.querySelector('.work-meta span:nth-child(2)').textContent.match(/\d+/)[0]);
                        return bComments - aComments;
                    });
                    break;
            }
            
            // Reappend sorted cards
            cards.forEach(card => {
                worksContainer.appendChild(card);
            });
            
            // Animate cards
            animateCards();
        });
    }
    
    // Time period filter
    const timeSelect = document.querySelector('.time-select');
    
    if (timeSelect) {
        timeSelect.addEventListener('change', function() {
            // In a real app, you would filter by actual date data
            // For demo purposes, we'll just shuffle the cards
            shuffleArray(Array.from(workCards));
            animateCards();
        });
    }
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchBar && searchBtn) {
        // Search on button click
        searchBtn.addEventListener('click', performSearch);
        
        // Search on Enter key
        searchBar.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
    
    function performSearch() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        
        if (searchTerm === '') {
            // If search is empty, show all cards
            workCards.forEach(card => {
                card.style.display = 'flex';
            });
            return;
        }
        
        // Filter cards based on search term
        workCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const author = card.querySelector('.work-author').textContent.toLowerCase();
            const excerpt = card.querySelector('.work-excerpt').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || author.includes(searchTerm) || excerpt.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
        
        // Animate visible cards
        animateCards();
    }
    
    // Load more functionality
    const loadMoreBtn = document.querySelector('.load-more-btn');
    
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            // Show loading state
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            this.disabled = true;
            
            // Simulate loading delay
            setTimeout(() => {
                // In a real app, you would fetch more items from the server
                // For demo purposes, we'll clone existing cards
                const worksContainer = document.querySelector('.works-container');
                const visibleCards = Array.from(document.querySelectorAll('.work-card[style*="flex"]'));
                
                // Clone first 4 visible cards (or less if fewer are visible)
                const cardsToClone = visibleCards.slice(0, Math.min(4, visibleCards.length));
                
                cardsToClone.forEach(card => {
                    const clone = card.cloneNode(true);
                    
                    // Modify clone to make it look different
                    const title = clone.querySelector('h3');
                    title.textContent = 'New ' + title.textContent;
                    
                    // Randomize stats
                    const likes = Math.floor(Math.random() * 300) + 50;
                    const comments = Math.floor(Math.random() * 50) + 5;
                    clone.querySelector('.work-meta span:first-child').innerHTML = `<i class="fas fa-heart"></i> ${likes}`;
                    clone.querySelector('.work-meta span:nth-child(2)').innerHTML = `<i class="fas fa-comment"></i> ${comments}`;
                    
                    // Add to container with animation
                    clone.style.opacity = '0';
                    clone.style.transform = 'translateY(20px)';
                    worksContainer.appendChild(clone);
                    
                    // Trigger animation
                    setTimeout(() => {
                        clone.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                        clone.style.opacity = '1';
                        clone.style.transform = 'translateY(0)';
                    }, 10);
                });
                
                // Reset button
                this.innerHTML = '<i class="fas fa-plus"></i> Load More';
                this.disabled = false;
                
                // If we've loaded a lot of items, maybe hide the button
                const totalCards = document.querySelectorAll('.work-card').length;
                if (totalCards > 20) {
                    this.style.display = 'none';
                    
                    // Show a message
                    const message = document.createElement('p');
                    message.textContent = 'You\'ve reached the end of the current works. Check back soon for more!';
                    message.style.textAlign = 'center';
                    message.style.marginTop = '2rem';
                    message.style.color = 'var(--secondary-color)';
                    message.style.fontStyle = 'italic';
                    this.parentNode.appendChild(message);
                }
            }, 1500);
        });
    }
    
    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Helper function to animate cards
    function animateCards() {
        const visibleCards = document.querySelectorAll('.work-card[style*="flex"]');
        
        visibleCards.forEach((card, index) => {
            // Reset animation
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            // Trigger animation with staggered delay
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Helper function to shuffle array
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    // Initialize animations
    animateCards();
    
    // Newsletter form submission
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) return;
            
            // Show loading state
            const submitBtn = this.querySelector('button');
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            // Simulate API call
            setTimeout(() => {
                // Reset button
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                
                // Clear input
                emailInput.value = '';
                
                // Show success message
                showNotification('Thank you for subscribing to our newsletter!', 'success');
            }, 1500);
        });
    });
    
    // Notification function
    function showNotification(message, type = 'info') {
        // Create notification element if it doesn't exist
        let notification = document.querySelector('.notification');
        if (!notification) {
            notification = document.createElement('div');
            notification.className = 'notification';
            document.body.appendChild(notification);
        }
        
        // Set message and type
        notification.textContent = message;
        notification.className = `notification ${type}`;
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Hide notification after delay
        setTimeout(() => {
            notification.classList.remove('show');
            
            // Remove from DOM after animation
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    // Add styles for notifications
    const notificationStyles = document.createElement('style');
    notificationStyles.textContent = `
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: var(--border-radius-md);
            color: white;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(120%);
            transition: transform 0.3s ease;
            z-index: 9999;
        }
        
        .notification.show {
            transform: translateX(0);
        }
        
        .notification.success {
            background-color: #4CAF50;
        }
        
        .notification.error {
            background-color: #F44336;
        }
        
        .notification.info {
            background-color: #2196F3;
        }
    `;
    document.head.appendChild(notificationStyles);
});
