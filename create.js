create
/* 
   Poetic Haven - Create Page JavaScript
   Handles the rich text editor and creation functionality
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Quill editor
    const quill = new Quill('#editor', {
        modules: {
            toolbar: [
                [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'color': [] }, { 'background': [] }],
                [{ 'align': [] }],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['blockquote', 'code-block'],
                ['link', 'image'],
                ['clean']
            ]
        },
        placeholder: 'Begin writing your masterpiece...',
        theme: 'snow'
    });
    
    // Add custom styles to Quill
    const customStyles = document.createElement('style');
    customStyles.textContent = `
        .ql-editor {
            font-size: 1.1rem;
            line-height: 1.8;
            padding: 2rem;
        }
        .ql-editor h1, .ql-editor h2, .ql-editor h3, .ql-editor h4, .ql-editor h5, .ql-editor h6 {
            font-family: var(--heading-font);
            color: var(--secondary-color);
        }
        .ql-editor p {
            margin-bottom: 1.2rem;
        }
        .ql-editor blockquote {
            border-left: 4px solid var(--accent-color);
            padding-left: 1rem;
            font-style: italic;
            color: var(--secondary-color);
        }
    `;
    document.head.appendChild(customStyles);
    
    // Tab switching
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Update active tab button
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(`${tabName}-tab`).classList.add('active');
            
            // If preview tab is selected, update preview content
            if (tabName === 'preview') {
                updatePreview();
            }
        });
    });
    
    // Update preview content
    function updatePreview() {
        const title = document.getElementById('title').value || 'Your Title Will Appear Here';
        const content = quill.root.innerHTML;
        const category = document.getElementById('category').value;
        
        document.querySelector('.preview-title').textContent = title;
        document.querySelector('.preview-content').innerHTML = content;
        
        // Format the current date
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = now.toLocaleDateString('en-US', options);
        document.querySelector('.preview-date').textContent = formattedDate;
    }
    
    // Cover image upload
    const coverImageInput = document.getElementById('coverImage');
    const imagePreview = document.getElementById('imagePreview');
    
    coverImageInput.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Clear the preview
                imagePreview.innerHTML = '';
                
                // Create image element
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePreview.appendChild(img);
            };
            
            reader.readAsDataURL(file);
        }
    });
    
    // Save draft functionality
    const saveDraftBtn = document.querySelector('.save-draft-btn');
    
    saveDraftBtn.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const content = quill.root.innerHTML;
        const category = document.getElementById('category').value;
        const tags = document.getElementById('tags').value;
        const visibility = document.getElementById('visibility').value;
        const allowComments = document.getElementById('comments').checked;
        
        // Create draft object
        const draft = {
            title,
            content,
            category,
            tags,
            visibility,
            allowComments,
            lastSaved: new Date().toISOString()
        };
        
        // Save to localStorage
        localStorage.setItem('poeticHavenDraft', JSON.stringify(draft));
        
        // Show notification
        showNotification('Draft saved successfully!', 'success');
        
        // Add animation to button
        this.classList.add('saved');
        setTimeout(() => {
            this.classList.remove('saved');
        }, 2000);
    });
    
    // Load draft if exists
    const loadDraft = function() {
        const savedDraft = localStorage.getItem('poeticHavenDraft');
        
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            
            // Populate form fields
            document.getElementById('title').value = draft.title || '';
            document.getElementById('category').value = draft.category || 'poem';
            document.getElementById('tags').value = draft.tags || '';
            document.getElementById('visibility').value = draft.visibility || 'public';
            document.getElementById('comments').checked = draft.allowComments !== undefined ? draft.allowComments : true;
            
            // Set editor content
            if (draft.content) {
                quill.root.innerHTML = draft.content;
            }
            
            // Show notification
            showNotification('Draft loaded successfully!', 'info');
        }
    };
    
    // Load draft on page load
    loadDraft();
    
    // Publish functionality
    const publishBtn = document.querySelector('.publish-btn');
    const publishModal = document.getElementById('publishModal');
    const closeModalBtn = document.querySelector('.close-modal');
    const cancelBtn = document.querySelector('.cancel-btn');
    const confirmPublishBtn = document.querySelector('.confirm-publish-btn');
    
    // Open publish modal
    publishBtn.addEventListener('click', function() {
        const title = document.getElementById('title').value;
        const category = document.getElementById('category').value;
        const visibility = document.getElementById('visibility').value;
        const allowComments = document.getElementById('comments').checked;
        
        // Validate form
        if (!title.trim()) {
            showNotification('Please enter a title for your work', 'error');
            document.getElementById('title').focus();
            return;
        }
        
        if (quill.getText().trim().length < 10) {
            showNotification('Please add some content to your work', 'error');
            quill.focus();
            return;
        }
        
        // Update modal content
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-category').textContent = getCategoryName(category);
        document.getElementById('modal-visibility').textContent = getVisibilityName(visibility);
        document.getElementById('modal-comments').textContent = allowComments ? 'Enabled' : 'Disabled';
        
        // Show modal
        publishModal.classList.add('active');
    });
    
    // Close modal functions
    function closeModal() {
        publishModal.classList.remove('active');
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    publishModal.addEventListener('click', function(e) {
        if (e.target === publishModal) {
            closeModal();
        }
    });
    
    // Confirm publish
    confirmPublishBtn.addEventListener('click', function() {
        // Show loading state
        this.disabled = true;
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Publishing...';
        
        // Simulate publishing process
        setTimeout(() => {
            // Reset button
            this.disabled = false;
            this.innerHTML = 'Publish Now';
            
            // Close modal
            closeModal();
            
            // Show success notification
            showNotification('Your work has been published successfully!', 'success');
            
            // Clear draft from localStorage
            localStorage.removeItem('poeticHavenDraft');
            
            // Redirect to published work (simulated)
            setTimeout(() => {
                window.location.href = 'explore.html';
            }, 2000);
        }, 2000);
    });
    
    // Helper functions
    function getCategoryName(value) {
        const categories = {
            'poem': 'Poem',
            'short-story': 'Short Story',
            'essay': 'Essay',
            'article': 'Article',
            'other': 'Other'
        };
        return categories[value] || value;
    }
    
    function getVisibilityName(value) {
        const visibilities = {
            'public': 'Public - Anyone can view',
            'members': 'Members Only',
            'private': 'Private - Only me'
        };
        return visibilities[value] || value;
    }
    
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
        
        .save-draft-btn.saved {
            background-color: rgba(76, 175, 80, 0.1);
            color: #4CAF50;
            border-color: #4CAF50;
        }
    `;
    document.head.appendChild(notificationStyles);
    
    // Auto-save draft every 30 seconds
    setInterval(() => {
        const title = document.getElementById('title').value;
        const content = quill.root.innerHTML;
        
        // Only auto-save if there's content
        if (title || content.length > 30) {
            const category = document.getElementById('category').value;
            const tags = document.getElementById('tags').value;
            const visibility = document.getElementById('visibility').value;
            const allowComments = document.getElementById('comments').checked;
            
            // Create draft object
            const draft = {
                title,
                content,
                category,
                tags,
                visibility,
                allowComments,
                lastSaved: new Date().toISOString()
            };
            
            // Save to localStorage
            localStorage.setItem('poeticHavenDraft', JSON.stringify(draft));
            
            // Show subtle indicator
            const saveDraftBtn = document.querySelector('.save-draft-btn');
            saveDraftBtn.classList.add('saved');
            setTimeout(() => {
                saveDraftBtn.classList.remove('saved');
            }, 1000);
        }
    }, 30000);
});
