/**
 * Main JavaScript
 * Site-wide functionality and utilities
 * 
 * @author Kyle Krause
 */

(function() {
    'use strict';

    /* ============================================
       Configuration
       ============================================ */
    const CONFIG = {
        breakpoints: {
            mobile: 480,
            tablet: 768,
            desktop: 1024
        },
        debounceDelay: 150
    };

    /* ============================================
       Utility Functions
       ============================================ */
    
    /**
     * Debounce function to limit execution rate
     * @param {Function} fn - Function to debounce
     * @param {number} delay - Delay in milliseconds
     * @returns {Function}
     */
    function debounce(fn, delay = CONFIG.debounceDelay) {
        let timeoutId;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    }

    /**
     * Get current breakpoint name
     * @returns {string} 'mobile' | 'tablet' | 'desktop'
     */
    function getBreakpoint() {
        const width = window.innerWidth;
        if (width < CONFIG.breakpoints.mobile) return 'mobile';
        if (width < CONFIG.breakpoints.tablet) return 'tablet';
        return 'desktop';
    }

    /**
     * Smooth scroll to element
     * @param {string|Element} target - CSS selector or element
     * @param {Object} options - Scroll options
     */
    function smoothScrollTo(target, options = {}) {
        const element = typeof target === 'string' 
            ? document.querySelector(target) 
            : target;
            
        if (!element) return;
        
        const defaults = {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        };
        
        element.scrollIntoView({ ...defaults, ...options });
    }

    /**
     * Check if user prefers reduced motion
     * @returns {boolean}
     */
    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    /* ============================================
       Responsive Handler
       ============================================ */
    
    let currentBreakpoint = '';

    function handleResponsive() {
        const newBreakpoint = getBreakpoint();
        
        // Only update if breakpoint changed
        if (newBreakpoint !== currentBreakpoint) {
            // Update body classes
            document.body.classList.remove('mobile', 'tablet', 'desktop');
            document.body.classList.add(newBreakpoint);
            
            // Dispatch custom event for components to listen to
            window.dispatchEvent(new CustomEvent('breakpointChange', {
                detail: { 
                    previous: currentBreakpoint, 
                    current: newBreakpoint 
                }
            }));
            
            currentBreakpoint = newBreakpoint;
        }
    }

    /* ============================================
       Initialization
       ============================================ */
    
    function init() {
        // Set initial breakpoint
        handleResponsive();
        
        // Listen for resize with debounce
        window.addEventListener('resize', debounce(handleResponsive));
        
        // Handle visibility change (for performance)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                handleResponsive();
            }
        });
    }

    /* ============================================
       Public API
       ============================================ */
    
    window.siteUtils = {
        smoothScrollTo,
        getBreakpoint,
        prefersReducedMotion,
        debounce
    };

    /* ============================================
       DOM Ready
       ============================================ */
    
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
