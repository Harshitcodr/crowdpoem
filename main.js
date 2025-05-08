main
/* 
   CrowdPoem - Main JavaScript
   Handles animations, interactions, and UI functionality
*/

document.addEventListener('DOMContentLoaded', function() {
    // Initialize variables
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const authButtons = document.querySelector('.auth-buttons');
    const parallaxElements = document.querySelectorAll('.parallax-element');
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-text-delay');
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
            authButtons.classList.toggle('active');
        });
    }
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Reveal animations on scroll
        revealElements.forEach(element => {
            if (isElementInViewport(element) && !element.classList.contains('revealed')) {
                element.classList.add('revealed');
                
                // Add animation to the pseudo-element
                const pseudoAnimation = document.createElement('style');
                pseudoAnimation.innerHTML = `
                    .revealed::before {
                        animation: reveal 1.5s ease forwards;
                    }
                    
                    .revealed.reveal-text-delay::before {
                        animation-delay: 0.5s;
                    }
                `;
                document.head.appendChild(pseudoAnimation);
            }
        });
    });
    
    // Parallax effect on mouse move
    document.addEventListener('mousemove', function(e) {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        parallaxElements.forEach(element => {
            const elementDepth = element.getAttribute('data-depth') || 0.1;
            const moveX = (mouseX * elementDepth * 50) - (elementDepth * 25);
            const moveY = (mouseY * elementDepth * 50) - (elementDepth * 25);
            
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;
        });
    });
    
    // Typing animation for logo
    const typingLogo = document.querySelector('.typing-logo');
    if (typingLogo) {
        const text = typingLogo.textContent;
        typingLogo.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                typingLogo.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 150);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }
    
    // Helper function to check if element is in viewport
    function isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    }
    
    // Initialize animations on page load
    initAnimations();
    
    function initAnimations() {
        // Trigger reveal animations for elements already in viewport
        setTimeout(() => {
            revealElements.forEach(element => {
                if (isElementInViewport(element)) {
                    element.classList.add('revealed');
                }
            });
        }, 300);
    }
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});
