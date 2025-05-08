auth
/* 
   Poetic Haven - Authentication JavaScript
   Handles login and signup functionality
*/

document.addEventListener('DOMContentLoaded', function() {
    // Toggle password visibility
    const togglePassword = document.querySelector('.toggle-password');
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const passwordInput = document.querySelector('#password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Toggle eye icon
            this.classList.toggle('fa-eye');
            this.classList.toggle('fa-eye-slash');
        });
    }
    
    // Form validation
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formValues = Object.fromEntries(formData.entries());
            
            // Simple validation
            let isValid = true;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            // Email validation
            if (!emailRegex.test(formValues.email)) {
                showError('email', 'Please enter a valid email address');
                isValid = false;
            } else {
                removeError('email');
            }
            
            // Password validation
            if (formValues.password.length < 6) {
                showError('password', 'Password must be at least 6 characters');
                isValid = false;
            } else {
                removeError('password');
            }
            
            // Check terms agreement for signup
            if (formValues.terms === undefined && document.querySelector('#terms')) {
                showError('terms', 'You must agree to the terms and conditions');
                isValid = false;
            } else if (document.querySelector('#terms')) {
                removeError('terms');
            }
            
            // If form is valid, simulate login/signup
            if (isValid) {
                // Show loading state
                const submitBtn = this.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                
                // Simulate API call
                setTimeout(() => {
                    // Reset button
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                    
                    // Show success message
                    showNotification('Success! Redirecting...', 'success');
                    
                    // Redirect after delay
                    setTimeout(() => {
                        window.location.href = '../index.html';
                    }, 1500);
                }, 2000);
            }
        });
    }
    
    // Social login buttons
    const socialButtons = document.querySelectorAll('.social-btn');
    socialButtons.forEach(button => {
        button.addEventListener('click', function() {
            const provider = this.classList.contains('google-btn') ? 'Google' : 'Facebook';
            
            // Show loading state
            const originalHTML = this.innerHTML;
            this.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Connecting...`;
            this.disabled = true;
            
            // Simulate authentication
            setTimeout(() => {
                // Reset button
                this.innerHTML = originalHTML;
                this.disabled = false;
                
                // Show success message
                showNotification(`Successfully authenticated with ${provider}! Redirecting...`, 'success');
                
                // Redirect after delay
                setTimeout(() => {
                    window.location.href = '../index.html';
                }, 1500);
            }, 2000);
        });
    });
    
    // Helper functions
    function showError(inputId, message) {
        const input = document.getElementById(inputId);
        const errorElement = input.parentElement.querySelector('.error-message') || 
                            input.closest('.form-group').querySelector('.error-message');
        
        if (!errorElement) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            
            if (inputId === 'terms') {
                input.closest('.terms-agreement').appendChild(errorDiv);
            } else {
                input.parentElement.appendChild(errorDiv);
            }
            
            input.classList.add('input-error');
        }
    }
    
    function removeError(inputId) {
        const input = document.getElementById(inputId);
        const errorElement = input.parentElement.querySelector('.error-message') || 
                            input.closest('.form-group').querySelector('.error-message') ||
                            (inputId === 'terms' ? input.closest('.terms-agreement').querySelector('.error-message') : null);
        
        if (errorElement) {
            errorElement.remove();
            input.classList.remove('input-error');
        }
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
    
    // Add styles for notifications and errors
    const style = document.createElement('style');
    style.textContent = `
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
        
        .error-message {
            color: #F44336;
            font-size: 0.85rem;
            margin-top: 5px;
            animation: fadeIn 0.3s ease;
        }
        
        .input-error {
            border-color: #F44336 !important;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
