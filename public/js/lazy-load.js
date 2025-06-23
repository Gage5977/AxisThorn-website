// Lazy Loading Implementation
(function() {
    'use strict';

    // Configuration
    const config = {
        rootMargin: '50px 0px',
        threshold: 0.01,
        loadingClass: 'lazy-loading',
        loadedClass: 'lazy-loaded',
        errorClass: 'lazy-error',
        defaultPlaceholder: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect width="100" height="100" fill="%23111"%3E%3C/rect%3E%3C/svg%3E'
    };

    // Image observer
    let imageObserver = null;

    // Initialize lazy loading
    function init() {
        if ('IntersectionObserver' in window) {
            setupIntersectionObserver();
            observeImages();
            observeDynamicContent();
        } else {
            // Fallback for browsers without IntersectionObserver
            loadAllImages();
        }
    }

    // Setup Intersection Observer
    function setupIntersectionObserver() {
        imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        });
    }

    // Load image
    function loadImage(img) {
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;
        const sizes = img.dataset.sizes;

        if (!src && !srcset) return;

        // Add loading class
        img.classList.add(config.loadingClass);

        // Create temporary image to load
        const tempImg = new Image();

        // Set up load handler
        tempImg.onload = () => {
            // Apply sources
            if (src) img.src = src;
            if (srcset) img.srcset = srcset;
            if (sizes) img.sizes = sizes;

            // Update classes
            img.classList.remove(config.loadingClass);
            img.classList.add(config.loadedClass);

            // Clean up data attributes
            delete img.dataset.src;
            delete img.dataset.srcset;
            delete img.dataset.sizes;

            // Trigger custom event
            img.dispatchEvent(new CustomEvent('lazyloaded', {
                detail: { src, srcset, sizes }
            }));
        };

        // Set up error handler
        tempImg.onerror = () => {
            img.classList.remove(config.loadingClass);
            img.classList.add(config.errorClass);

            // Set error placeholder if provided
            if (img.dataset.error) {
                img.src = img.dataset.error;
            }

            // Trigger custom event
            img.dispatchEvent(new CustomEvent('lazyerror', {
                detail: { src, srcset, sizes }
            }));
        };

        // Start loading
        if (srcset) tempImg.srcset = srcset;
        tempImg.src = src || img.src;
    }

    // Observe all lazy images
    function observeImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        lazyImages.forEach(img => {
            // Set placeholder if not already set
            if (!img.src && !img.dataset.placeholder) {
                img.src = config.defaultPlaceholder;
            } else if (img.dataset.placeholder) {
                img.src = img.dataset.placeholder;
            }

            // Add to observer
            imageObserver.observe(img);
        });
    }

    // Observe dynamically added content
    function observeDynamicContent() {
        const mutationObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // Element node
                        // Check if it's a lazy image
                        if (node.tagName === 'IMG' && (node.dataset.src || node.dataset.srcset)) {
                            imageObserver.observe(node);
                        }

                        // Check for lazy images in descendants
                        const lazyImages = node.querySelectorAll('img[data-src], img[data-srcset]');
                        lazyImages.forEach(img => imageObserver.observe(img));
                    }
                });
            });
        });

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Fallback: Load all images immediately
    function loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[data-srcset]');
        lazyImages.forEach(loadImage);
    }

    // Lazy load background images
    function lazyLoadBackgroundImage(element) {
        const bgImage = element.dataset.bgSrc;
        if (!bgImage) return;

        const tempImg = new Image();
        tempImg.onload = () => {
            element.style.backgroundImage = `url(${bgImage})`;
            element.classList.add(config.loadedClass);
            delete element.dataset.bgSrc;
        };
        tempImg.src = bgImage;
    }

    // Setup background image lazy loading
    function setupBackgroundLazyLoad() {
        const bgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    lazyLoadBackgroundImage(entry.target);
                    bgObserver.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: config.rootMargin,
            threshold: config.threshold
        });

        const lazyBackgrounds = document.querySelectorAll('[data-bg-src]');
        lazyBackgrounds.forEach(el => bgObserver.observe(el));
    }

    // Preload image
    function preloadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    }

    // Preload multiple images
    function preloadImages(sources) {
        return Promise.all(sources.map(preloadImage));
    }

    // Add custom styles
    const style = document.createElement('style');
    style.textContent = `
        img[data-src],
        img[data-srcset] {
            display: block;
            min-height: 1px;
        }
        
        .lazy-loading {
            filter: blur(5px);
            transition: filter 0.3s;
        }
        
        .lazy-loaded {
            filter: blur(0);
            animation: fadeIn 0.3s;
        }
        
        .lazy-error {
            filter: blur(0);
            opacity: 0.5;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            setupBackgroundLazyLoad();
        });
    } else {
        init();
        setupBackgroundLazyLoad();
    }

    // Export global API
    window.LazyLoad = {
        observe: (element) => {
            if (imageObserver && element) {
                imageObserver.observe(element);
            }
        },
        load: loadImage,
        loadAll: loadAllImages,
        preload: preloadImage,
        preloadMultiple: preloadImages
    };
})();