/**
 * Main Panel Component
 * Wii Fit-inspired skeuomorphic content boxes
 * 
 * Provides optional interactivity and animations
 */

(function() {
    'use strict';

    /**
     * Initialize all main panels
     */
    function initMainPanels() {
        const panels = document.querySelectorAll('.main-panel');
        
        panels.forEach((panel, index) => {
            // Add staggered animation on load if animate class is present
            if (panel.classList.contains('main-panel--animate')) {
                panel.style.animationDelay = `${index * 0.1}s`;
            }
            
            // Add focus styles for accessibility on interactive panels
            if (panel.classList.contains('main-panel--interactive')) {
                setupInteractivePanel(panel);
            }
        });
    }

    /**
     * Setup interactive panel behaviors
     * @param {HTMLElement} panel 
     */
    function setupInteractivePanel(panel) {
        // Make focusable if not already
        if (!panel.hasAttribute('tabindex')) {
            panel.setAttribute('tabindex', '0');
        }
        
        // Add keyboard support
        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                panel.click();
            }
        });
        
        // Add subtle sound effect feedback (optional)
        panel.addEventListener('mouseenter', () => {
            // Could trigger a subtle hover sound here
            panel.setAttribute('data-hovered', 'true');
        });
        
        panel.addEventListener('mouseleave', () => {
            panel.removeAttribute('data-hovered');
        });
    }

    /**
     * Animate panels into view using Intersection Observer
     * @param {string} selector - CSS selector for panels to observe
     */
    function setupScrollAnimation(selector = '.main-panel--scroll-animate') {
        const panels = document.querySelectorAll(selector);
        
        if (!panels.length || !('IntersectionObserver' in window)) {
            return;
        }
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('main-panel--visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        panels.forEach((panel) => {
            observer.observe(panel);
        });
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            initMainPanels();
            setupScrollAnimation();
        });
    } else {
        initMainPanels();
        setupScrollAnimation();
    }

    // Expose functions globally for manual use
    window.MainPanel = {
        init: initMainPanels,
        setupScrollAnimation: setupScrollAnimation
    };
})();

