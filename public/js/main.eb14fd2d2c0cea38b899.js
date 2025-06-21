/******/ (() => { // webpackBootstrap
/******/ 	
  /******/ 	var __webpack_modules__ = ({

    /***/ 101:
    /***/ ((module) => {

      module.exports = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath stroke=%27%238b1538%27 stroke-width=%271.5%27 d=%27M12 2 2 7l10 5 10-5zM2 17l10 5 10-5M2 12l10 5 10-5%27/%3E%3C/svg%3E';

      /***/ }),

    /***/ 417:
    /***/ ((module) => {



      module.exports = function (url, options) {
        if (!options) {
          options = {};
        }
        if (!url) {
          return url;
        }
        url = String(url.__esModule ? url.default : url);

        // If url is already wrapped in quotes, remove them
        if (/^['"].*['"]$/.test(url)) {
          url = url.slice(1, -1);
        }
        if (options.hash) {
          url += options.hash;
        }

        // Should url be wrapped?
        // See https://drafts.csswg.org/css-values-3/#urls
        if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
          return '"'.concat(url.replace(/"/g, '\\"').replace(/\n/g, '\\n'), '"');
        }
        return url;
      };

      /***/ }),

    /***/ 510:
    /***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


      // UNUSED EXPORTS: initializeApp

      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js
      var injectStylesIntoStyleTag = __webpack_require__(72);
      var injectStylesIntoStyleTag_default = /*#__PURE__*/__webpack_require__.n(injectStylesIntoStyleTag);
      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleDomAPI.js
      var styleDomAPI = __webpack_require__(825);
      var styleDomAPI_default = /*#__PURE__*/__webpack_require__.n(styleDomAPI);
      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertBySelector.js
      var insertBySelector = __webpack_require__(659);
      var insertBySelector_default = /*#__PURE__*/__webpack_require__.n(insertBySelector);
      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js
      var setAttributesWithoutAttributes = __webpack_require__(56);
      var setAttributesWithoutAttributes_default = /*#__PURE__*/__webpack_require__.n(setAttributesWithoutAttributes);
      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/insertStyleElement.js
      var insertStyleElement = __webpack_require__(540);
      var insertStyleElement_default = /*#__PURE__*/__webpack_require__.n(insertStyleElement);
      // EXTERNAL MODULE: ./node_modules/style-loader/dist/runtime/styleTagTransform.js
      var styleTagTransform = __webpack_require__(113);
      var styleTagTransform_default = /*#__PURE__*/__webpack_require__.n(styleTagTransform);
      // EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/css/styles.css
      var styles = __webpack_require__(824);
      // ./src/css/styles.css

      
      
      
      
      
      
      
      
      

      var options = {};

      options.styleTagTransform = (styleTagTransform_default());
      options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, 'head');
    
      options.domAPI = (styleDomAPI_default());
      options.insertStyleElement = (insertStyleElement_default());

      var update = injectStylesIntoStyleTag_default()(styles/* default */.A, options);




      /* harmony default export */ const css_styles = (styles/* default */.A && styles/* default */.A.locals ? styles/* default */.A.locals : undefined);

      // EXTERNAL MODULE: ./src/js/navigation.js
      var navigation = __webpack_require__(749);
      // ./src/js/animation.js
      // Animation Module
      var AnimationModule = {
        observer: null,
        init: function init() {
          this.setupIntersectionObserver();
          this.observeElements();
        },
        setupIntersectionObserver: function setupIntersectionObserver() {
          var observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
          };
          this.observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
              }
            });
          }, observerOptions);
        },
        observeElements: function observeElements() {
          var _this = this;
          var serviceCards = document.querySelectorAll('.service-card');
          var aboutSection = document.querySelector('.about-text');
          var contactSection = document.querySelector('.contact-info');
          serviceCards.forEach(function (card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(50px)';
            card.style.transition = 'opacity 0.8s ease-out '.concat(index * 0.2, 's, transform 0.8s ease-out ').concat(index * 0.2, 's');
            _this.observer.observe(card);
          });
          if (aboutSection) {
            aboutSection.style.opacity = '0';
            aboutSection.style.transform = 'translateY(30px)';
            aboutSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            this.observer.observe(aboutSection);
          }
          if (contactSection) {
            contactSection.style.opacity = '0';
            contactSection.style.transform = 'translateY(30px)';
            contactSection.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            this.observer.observe(contactSection);
          }
        }
      };
      /* harmony default export */ const animation = (AnimationModule);
      // EXTERNAL MODULE: ./src/js/form.js
      var js_form = __webpack_require__(777);
      // ./src/js/visual-effects.js
      // Visual Effects Module
      var VisualEffects = {
        init: function init() {
          this.initParallax();
          this.initServiceCardEffects();
          this.initGlitchEffect();
        },
        initParallax: function initParallax() {
          window.addEventListener('scroll', function () {
            var scrolled = window.pageYOffset || document.documentElement.scrollTop;
            var thornPattern = document.querySelector('.thorn-pattern');
            var heroVisual = document.querySelector('.hero-visual');
            if (thornPattern && heroVisual) {
              var rate = scrolled * -0.5;
              thornPattern.style.transform = 'translateY('.concat(rate, 'px) rotate(').concat(scrolled * 0.1, 'deg)');
            }
          });
        },
        initServiceCardEffects: function initServiceCardEffects() {
          document.querySelectorAll('.service-card').forEach(function (card) {
            var icon = card.querySelector('.service-icon > div');
            card.addEventListener('mouseenter', function () {
              if (icon) {
                icon.style.transform = 'scale(1.1) rotate(10deg)';
                icon.style.filter = 'brightness(1.2)';
              }
            });
            card.addEventListener('mouseleave', function () {
              if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
                icon.style.filter = 'brightness(1)';
              }
            });
          });
        },
        initGlitchEffect: function initGlitchEffect() {
          var heroTitle = document.querySelector('.hero-title');
          if (!heroTitle) {return;}
          var glitchTimeout;
          heroTitle.addEventListener('mouseenter', function () {
            heroTitle.style.textShadow = '\n                2px 0 #d4af37,\n                -2px 0 #8b0000,\n                0 2px #c0c0c0\n            ';
            glitchTimeout = setTimeout(function () {
              heroTitle.style.textShadow = 'none';
            }, 200);
          });
          heroTitle.addEventListener('mouseleave', function () {
            clearTimeout(glitchTimeout);
            heroTitle.style.textShadow = 'none';
          });
        }
      };
      /* harmony default export */ const visual_effects = (VisualEffects);
      // EXTERNAL MODULE: ./src/js/notification.js
      var notification = __webpack_require__(236);
      // ./src/js/admin-services.js
      // Administrative Services Module

      var AdminServices = {
        init: function init() {
          this.initTaxIdFormatting();
          this.initBankingRequests();
        },
        initTaxIdFormatting: function initTaxIdFormatting() {
          var taxIdInput = document.getElementById('taxId');
          if (!taxIdInput) {return;}
          taxIdInput.addEventListener('input', function (e) {
            var value = e.target.value.replace(/\D/g, '');
            if (value.length <= 9) {
              // SSN format: XXX-XX-XXXX
              if (value.length >= 6) {
                value = value.slice(0, 3) + '-' + value.slice(3, 5) + '-' + value.slice(5);
              } else if (value.length >= 4) {
                value = value.slice(0, 3) + '-' + value.slice(3);
              }
            } else {
              // EIN format: XX-XXXXXXX
              value = value.slice(0, 2) + '-' + value.slice(2, 9);
            }
            e.target.value = value;
          });
        },
        initBankingRequests: function initBankingRequests() {
          var secureElements = document.querySelectorAll('.detail-value.secure');
          secureElements.forEach(function (element) {
            element.style.cursor = 'pointer';
            element.title = 'Click to request banking details';
            element.addEventListener('click', function () {
              var paymentType = this.getAttribute('data-payment-type');
              var paymentMethod = this.closest('.payment-method').querySelector('h5').textContent;
              AdminServices.requestBankingDetails(paymentMethod, paymentType);
            });
          });
        },
        requestBankingDetails: function requestBankingDetails(paymentMethod, paymentType) {
          var subject = encodeURIComponent('Banking Instructions Request - '.concat(paymentMethod));
          var body = encodeURIComponent('Hello,\n\nI am requesting banking instructions for: '.concat(paymentMethod, '\nPayment Type: ').concat(paymentType || 'Standard', '\n\nPlease provide secure banking details for payment processing.\n\nInvoice/Reference Number: [Please specify]\nExpected Payment Amount: [Please specify]\nPayment Date: [Please specify]\n\nThank you.'));
          var mailtoLink = 'mailto:AI.info@axisthorn.com?subject='.concat(subject, '&body=').concat(body);
          window.location.href = mailtoLink;
          (0,notification/* showNotification */.Ds)('Email client opened. Banking details will be provided via encrypted email within 2 hours.', 'info');
        }
      };
      /* harmony default export */ const admin_services = (AdminServices);
      // ./src/js/mobile.js
      // Mobile Module
      var MobileModule = {
        init: function init() {
          if (window.innerWidth <= 768) {
            this.createMobileNav();
            this.addTouchSupport();
          }
        },
        createMobileNav: function createMobileNav() {
          var nav = document.querySelector('.navigation');
          var navMenu = document.querySelector('.nav-menu');

          // Create mobile menu toggle button
          var mobileToggle = document.createElement('button');
          mobileToggle.className = 'mobile-nav-toggle';
          mobileToggle.innerHTML = '\n            <span class="hamburger-line"></span>\n            <span class="hamburger-line"></span>\n            <span class="hamburger-line"></span>\n        ';
          mobileToggle.setAttribute('aria-label', 'Toggle mobile navigation');

          // Add toggle button to nav
          var navContainer = document.querySelector('.nav-container');
          navContainer.appendChild(mobileToggle);

          // Toggle functionality
          var isMenuOpen = false;
          mobileToggle.addEventListener('click', function () {
            isMenuOpen = !isMenuOpen;
            mobileToggle.classList.toggle('active', isMenuOpen);
            navMenu.classList.toggle('mobile-open', isMenuOpen);
            document.body.classList.toggle('mobile-nav-open', isMenuOpen);

            // Animate hamburger lines
            var lines = mobileToggle.querySelectorAll('.hamburger-line');
            lines.forEach(function (line, index) {
              line.style.transform = isMenuOpen ? index === 0 ? 'rotate(45deg) translate(6px, 6px)' : index === 1 ? 'opacity(0)' : 'rotate(-45deg) translate(6px, -6px)' : '';
            });

            // Track mobile nav usage
            if (typeof trackEvent === 'function') {
              trackEvent('mobile_nav_toggle', 'navigation', isMenuOpen ? 'open' : 'close');
            }
          });

          // Close menu on link click
          navMenu.querySelectorAll('.nav-link').forEach(function (link) {
            link.addEventListener('click', function () {
              isMenuOpen = false;
              mobileToggle.classList.remove('active');
              navMenu.classList.remove('mobile-open');
              document.body.classList.remove('mobile-nav-open');
            });
          });

          // Close menu on outside click
          document.addEventListener('click', function (e) {
            if (isMenuOpen && !nav.contains(e.target)) {
              isMenuOpen = false;
              mobileToggle.classList.remove('active');
              navMenu.classList.remove('mobile-open');
              document.body.classList.remove('mobile-nav-open');
            }
          });
        },
        addTouchSupport: function addTouchSupport() {
          var _this = this;
          var touchStartX = 0;
          var touchStartY = 0;
          var touchEndX = 0;
          var touchEndY = 0;
          document.addEventListener('touchstart', function (e) {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
          });
          document.addEventListener('touchend', function (e) {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            _this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY);
          });
        },
        handleSwipe: function handleSwipe(startX, startY, endX, endY) {
          var deltaX = endX - startX;
          var deltaY = endY - startY;
          var minSwipeDistance = 50;

          // Horizontal swipes
          if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
              // Swipe right - could trigger navigation
              if (typeof trackEvent === 'function') {
                trackEvent('swipe_right', 'gesture', 'mobile');
              }
            } else {
              // Swipe left
              if (typeof trackEvent === 'function') {
                trackEvent('swipe_left', 'gesture', 'mobile');
              }
            }
          }
        }
      };
      /* harmony default export */ const mobile = (MobileModule);
      // EXTERNAL MODULE: ./src/js/performance.js
      var performance = __webpack_require__(785);
      // ./src/js/main.js
      // Main Application Module - Entry point for main website


      // Import modules









      // Make showNotification globally available for inline event handlers
      window.showNotification = notification/* showNotification */.Ds;

      // Initialize all modules when DOM is ready
      function initializeApp() {
        // Initialize all modules
        navigation/* default */.A.init();
        animation.init();
        js_form/* default */.A.init();
        visual_effects.init();
        admin_services.init();
        mobile.init();

        // Optimize scroll performance
        performance/* default */.A.optimizeScrollPerformance();

        // Track page load
        if (typeof trackEvent === 'function') {
          trackEvent('page_load', 'engagement', document.title);
        }
      }

      // Auto-initialize when DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeApp);
      } else {
        // DOM is already loaded
        initializeApp();
      }

      /***/ }),

    /***/ 761:
    /***/ ((module) => {

      module.exports = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27currentColor%27 d=%27M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11z%27/%3E%3C/svg%3E';

      /***/ }),

    /***/ 805:
    /***/ ((module) => {

      module.exports = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27currentColor%27 d=%27M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8M11 7h2v6h-2zm0 8h2v2h-2z%27/%3E%3C/svg%3E';

      /***/ }),

    /***/ 824:
    /***/ ((module, __webpack_exports__, __webpack_require__) => {

      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ A: () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ });
      /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(417);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
      // Imports



      var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(101), __webpack_require__.b);
      var ___CSS_LOADER_URL_IMPORT_1___ = new URL(/* asset import */ __webpack_require__(905), __webpack_require__.b);
      var ___CSS_LOADER_URL_IMPORT_2___ = new URL(/* asset import */ __webpack_require__(991), __webpack_require__.b);
      var ___CSS_LOADER_URL_IMPORT_3___ = new URL(/* asset import */ __webpack_require__(805), __webpack_require__.b);
      var ___CSS_LOADER_URL_IMPORT_4___ = new URL(/* asset import */ __webpack_require__(761), __webpack_require__.b);
      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
      var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
      var ___CSS_LOADER_URL_REPLACEMENT_1___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_1___);
      var ___CSS_LOADER_URL_REPLACEMENT_2___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_2___);
      var ___CSS_LOADER_URL_REPLACEMENT_3___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_3___);
      var ___CSS_LOADER_URL_REPLACEMENT_4___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_4___);
      // Module
      ___CSS_LOADER_EXPORT___.push([module.id, `*{box-sizing:border-box;margin:0;padding:0}.visually-hidden{height:1px;margin:-1px;overflow:hidden;padding:0;position:absolute;width:1px;clip:rect(0,0,0,0);border:0;white-space:nowrap}.text-center{text-align:center}.text-primary{color:var(--text-primary)!important}.text-secondary{color:var(--text-secondary)!important}.text-xl{font-size:1.25rem}.text-5xl{font-size:3rem}.font-display{font-family:var(--font-display)}.mb-1{margin-bottom:1rem}.mb-3{margin-bottom:3rem}.flex{display:flex}.gap-2{gap:.5rem}.gap-8{gap:2rem}.justify-center{justify-content:center}.grid{display:grid}.grid-cols-1{grid-template-columns:repeat(1,1fr)}.bg-white{background:#fff}.p-0\\.5{padding:.125rem}.rounded-xl{border-radius:.75rem}@media (min-width:768px){.md\\:grid-cols-2{grid-template-columns:repeat(2,1fr)}}:root{--primary-dark:#0a0f1c;--secondary-dark:#0d1420;--accent-dark:#111825;--text-primary:#e6f8ff;--text-secondary:#a0aec0;--text-muted:#64748b;--accent-primary:#3f72af;--accent-secondary:#2563eb;--accent-tertiary:#1e40af;--accent-cyan:#06b6d4;--accent-electric:#00d9ff;--gradient-dark:linear-gradient(135deg,#0a0f1c,#0d1420,#0a0f1c);--gradient-accent:linear-gradient(135deg,#3f72af,#06b6d4);--shadow-harsh:0 8px 32px var(--accent-cyan-03);--shadow-subtle:0 2px 8px var(--accent-primary-02);--shadow-glow:0 0 20px rgba(0,217,255,.5);--transition-smooth:all 0.3s cubic-bezier(0.4,0,0.2,1);--font-primary:"Inter","Space Grotesk",sans-serif;--font-display:"Satoshi","Inter",serif;--accent-cyan-rgb:6,182,212;--accent-cyan-01:rgba(var(--accent-cyan-rgb),0.1);--accent-cyan-02:rgba(var(--accent-cyan-rgb),0.2);--accent-cyan-03:rgba(var(--accent-cyan-rgb),0.3);--accent-cyan-04:rgba(var(--accent-cyan-rgb),0.4);--accent-cyan-05:rgba(var(--accent-cyan-rgb),0.5);--accent-cyan-08:rgba(var(--accent-cyan-rgb),0.8);--accent-primary-rgb:63,114,175;--accent-primary-01:rgba(var(--accent-primary-rgb),0.1);--accent-primary-02:rgba(var(--accent-primary-rgb),0.2);--accent-primary-03:rgba(var(--accent-primary-rgb),0.3);--accent-primary-05:rgba(var(--accent-primary-rgb),0.5)}body{background:var(--gradient-dark);color:var(--text-primary);font-family:var(--font-primary);line-height:1.6;overflow-x:hidden}*{color:inherit}:not(.cta-button):not(.submit-button){color:var(--text-primary)}[style*="color: #000"],[style*="color: #000000"],[style*="color: black"],[style*="color: rgb(0, 0, 0)"]{color:var(--text-primary)!important}.perfect-grid{align-items:stretch;box-sizing:border-box;display:grid;justify-content:center}.perfect-card{align-items:flex-start;box-sizing:border-box;display:flex;flex-direction:column;height:100%;justify-content:space-between}.perfect-center{align-items:center;display:flex;justify-content:center;text-align:center}*,a,article,aside,body,button,div,footer,h1,h2,h3,h4,h5,h6,header,html,input,label,li,main,nav,ol,option,p,section,select,span,textarea,ul{color:var(--text-primary)!important}.about-description,.contact-info p,.hero .title-line:nth-child(2),.hero-subtitle,.nav-link,.service-card p{color:var(--text-secondary)!important}.contact-label,.footer-text p,.form-group input::placeholder,.form-group textarea::placeholder,.service-details li{color:var(--text-muted)!important}.cta-button,.submit-button{color:var(--accent-primary)!important}.cta-button:hover,.submit-button:hover{color:var(--primary-dark)!important}.contact-value{color:var(--text-primary)!important}.about *,.contact *,.footer *,.hero *,.navigation *,.services *,a,button,div,h1,h2,h3,h4,h5,h6,input,label,li,p,select,span,textarea{color:inherit}.about,.about *,.contact,.contact *,.footer,.footer *,.hero,.hero *,.navigation,.navigation *,.services,.services *{color:var(--text-primary)!important}.hero .title-line:nth-child(2){color:var(--text-secondary)!important}.hero .title-line:nth-child(3){color:#a1171e!important}.about-description,.hero-subtitle,.service-card p{color:var(--text-secondary)!important}.service-details li{color:var(--text-muted)!important}.contact-info p{color:var(--text-secondary)!important}.contact-label,.footer-text p{color:var(--text-muted)!important}.nav-link{color:var(--text-secondary)!important}.nav-link:hover{color:var(--text-primary)!important}.container{margin:0 auto;max-width:1200px;padding:0 2rem}.navigation{backdrop-filter:blur(24px) saturate(180%);-webkit-backdrop-filter:blur(24px) saturate(180%);background:rgba(10,15,28,.95);border-bottom:1px solid var(--accent-cyan-02);box-shadow:0 8px 32px rgba(0,0,0,.4);left:0;position:fixed;right:0;top:0;transition:all .4s cubic-bezier(.25,.46,.45,.94);z-index:1000}.nav-container{gap:3rem;justify-content:space-between;margin:0 auto;max-width:1200px;padding:1rem 2rem}.logo,.nav-container{align-items:center;display:flex}.logo{flex-shrink:0;gap:.75rem;margin-right:2rem}.logo-img{border-radius:6px;filter:brightness(1.1) saturate(1.2);height:60px;padding:4px;width:60px}.logo-text{color:var(--text-primary);font-size:1.5rem;font-weight:600;letter-spacing:-.02em}.nav-menu{display:flex;gap:2rem;list-style:none}.nav-link{color:var(--text-secondary);font-weight:500;letter-spacing:.02em;position:relative;text-decoration:none;transition:var(--transition-smooth)}.nav-link:hover{color:var(--text-primary)}.nav-link:after{background:var(--accent-primary);bottom:-4px;content:"";height:1px;left:0;position:absolute;transition:var(--transition-smooth);width:0}.nav-link:hover:after{width:100%}.hero{align-items:center;background:var(--gradient-dark);background-image:radial-gradient(circle at 20% 20%,var(--accent-cyan-01) 0,transparent 50%),radial-gradient(circle at 80% 80%,rgba(63,114,175,.1) 0,transparent 50%);display:flex;min-height:100vh;overflow:hidden;padding:6rem 2rem 2rem;position:relative}.hero-content{max-width:800px;position:relative;z-index:2}.hero-title{color:var(--text-primary);font-family:var(--font-display);font-size:clamp(4rem,10vw,8rem);font-weight:700;letter-spacing:-.04em;line-height:.85;margin-bottom:2rem}.title-line{animation:fadeInUp 1.2s ease-out forwards;display:block;opacity:0;transform:translateY(50px)}.title-line:nth-child(2){animation-delay:.3s;color:var(--text-secondary)}.title-line:nth-child(3){animation-delay:.6s;color:#a1171e}.hero-subtitle{animation:fadeInUp 1.2s ease-out .9s forwards;color:var(--text-secondary);font-size:1.25rem;font-weight:300;letter-spacing:.02em;margin-bottom:3rem;opacity:0}.hero-cta{animation:fadeInUp 1.2s ease-out 1.2s forwards;opacity:0}.cta-button{animation:ctaPulse 3s ease-in-out infinite;background:var(--accent-primary);border:2px solid var(--accent-cyan);border-radius:4px;box-shadow:0 0 20px var(--accent-cyan-03);color:var(--accent-cyan);display:inline-flex;font-size:.9rem;font-weight:500;letter-spacing:.1em;overflow:hidden;padding:1rem 2.5rem;position:relative;text-transform:uppercase;transition:all .4s cubic-bezier(.25,.46,.45,.94)}.cta-button:before{background:var(--accent-secondary);content:"";height:100%;left:-100%;position:absolute;top:0;transition:var(--transition-smooth);width:100%;z-index:-1}.cta-button:hover:before{left:0}.cta-button:hover{border-color:var(--accent-electric);box-shadow:0 0 40px var(--accent-cyan-08),0 0 60px rgba(0,217,255,.6),0 8px 32px rgba(0,0,0,.4);color:var(--accent-electric);text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px) scale(1.02)}.hero-visual{height:80%;opacity:.1;position:absolute;right:-20%;top:50%;transform:translateY(-50%);width:60%;z-index:1}.thorn-pattern{animation:rotatePattern 20s linear infinite;background-image:radial-gradient(circle at 20% 20%,rgba(74,0,0,.1) 0,transparent 50%),radial-gradient(circle at 80% 80%,rgba(74,0,0,.1) 0,transparent 50%),linear-gradient(45deg,transparent 40%,hsla(0,0%,100%,.02) 50%,transparent 60%);height:100%;width:100%}.services{background:var(--secondary-dark);padding:8rem 0;position:relative}.section-title{color:var(--text-primary);font-family:var(--font-display);font-size:3rem;font-weight:700;letter-spacing:-.025em;line-height:1.1;margin-bottom:4rem;position:relative;text-align:center}.section-title:after{background:var(--accent-primary);bottom:-1rem;content:"";height:2px;left:50%;position:absolute;transform:translateX(-50%);width:60px}.services-grid{align-items:stretch;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));justify-content:center;margin-top:5rem;perspective:1000px}.service-card{align-items:flex-start;-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px);background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.8));border:1px solid var(--accent-cyan-01);border-radius:16px;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:space-between;overflow:hidden;padding:3rem;position:relative;transform-style:preserve-3d;transition:all .4s cubic-bezier(.4,0,.2,1)}.service-card:before{background:linear-gradient(145deg,rgba(6,182,212,.03),transparent 50%,rgba(6,182,212,.03));border-radius:16px;bottom:0;left:0;right:0;top:0}.service-card:after,.service-card:before{content:"";opacity:0;position:absolute;transition:var(--transition-smooth)}.service-card:after{background:linear-gradient(45deg,var(--accent-primary),var(--accent-secondary),var(--accent-tertiary),var(--accent-primary));border-radius:18px;bottom:-2px;left:-2px;right:-2px;top:-2px;z-index:-1}.service-card:hover:before{opacity:1}.service-card:hover:after{opacity:.6}.service-card:hover{border-color:var(--accent-cyan-04);box-shadow:0 20px 40px rgba(0,0,0,.4),0 10px 20px var(--accent-cyan-02);transform:translateY(-12px) rotateX(5deg) rotateY(-2deg)}.service-icon{align-items:center;display:flex;height:80px;justify-content:center;margin-bottom:2.5rem;position:relative;width:80px}.service-icon:before{background:radial-gradient(circle,var(--accent-cyan-02) 0,transparent 70%);border-radius:50%;content:"";height:120%;position:absolute;transition:var(--transition-smooth);width:120%;z-index:-1}.service-card:hover .service-icon:before{background:radial-gradient(circle,var(--accent-cyan-04) 0,transparent 70%);transform:scale(1.2)}.icon-accounting,.icon-contract,.icon-investment{background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary));clip-path:polygon(50% 0,0 100%,100% 100%);filter:drop-shadow(0 4px 8px var(--accent-cyan-03));height:100%;position:relative;transition:all .4s cubic-bezier(.4,0,.2,1);width:100%}.icon-accounting:after{background:linear-gradient(135deg,var(--accent-secondary),var(--accent-tertiary));clip-path:polygon(50% 20%,20% 80%,80% 80%);content:"";height:60%;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:60%}.icon-investment{background:linear-gradient(45deg,var(--accent-primary),var(--accent-tertiary));clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)}.icon-investment:after{background:linear-gradient(45deg,var(--accent-secondary),var(--accent-primary));clip-path:polygon(30% 20%,70% 20%,80% 50%,70% 80%,30% 80%,20% 50%);content:"";height:50%;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:50%}.icon-contract{background:linear-gradient(90deg,var(--accent-tertiary),var(--accent-primary));clip-path:polygon(20% 0,80% 0,100% 20%,100% 80%,80% 100%,20% 100%,0 80%,0 20%)}.icon-contract:after{background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));clip-path:polygon(25% 10%,75% 10%,90% 25%,90% 75%,75% 90%,25% 90%,10% 75%,10% 25%);content:"";height:60%;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:60%}.service-card:hover .icon-accounting,.service-card:hover .icon-contract,.service-card:hover .icon-investment{filter:drop-shadow(0 8px 16px var(--accent-cyan-05));transform:scale(1.1) rotateY(15deg)}.service-card h3{background:linear-gradient(135deg,var(--text-primary),var(--text-secondary));background-clip:text;-webkit-background-clip:text;color:var(--text-primary)!important;font-size:1.75rem;font-weight:600;letter-spacing:-.02em;margin-bottom:1.5rem;transition:var(--transition-smooth)}.service-card:hover h3{background:linear-gradient(135deg,var(--accent-primary),var(--text-primary));background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;transform:translateX(8px)}.service-card p{color:var(--text-secondary);font-size:1.05rem;font-style:italic;line-height:1.8;margin-bottom:2.5rem;transition:var(--transition-smooth)}.service-card:hover p{color:hsla(0,0%,100%,.9);transform:translateX(4px)}.service-details{list-style:none;padding:0}.service-details li{color:var(--text-muted);font-size:.95rem;line-height:1.6;margin-bottom:.75rem;padding-left:2rem;position:relative;transition:var(--transition-smooth)}.service-details li:before{color:var(--accent-primary);content:"◆";font-size:.8rem;left:0;position:absolute;top:.1rem;transition:var(--transition-smooth)}.service-card:hover .service-details li{color:var(--text-secondary);transform:translateX(6px)}.service-card:hover .service-details li:before{color:var(--accent-secondary);transform:scale(1.2)}.about{background:var(--primary-dark);padding:8rem 0}.about-content{align-items:center;display:grid;gap:6rem;grid-template-columns:1fr 1fr}.about-text .section-title{color:var(--text-primary);font-size:3.5rem;line-height:1;margin-bottom:2rem;text-align:left}.about-text .section-title:after{display:none}.about-description{color:var(--text-secondary);font-size:1.15rem;font-weight:400;letter-spacing:-.01em;line-height:1.7;margin-bottom:2rem}.about-text *{color:inherit}.about-visual{height:400px;position:relative}.geometric-pattern{align-items:center;background:radial-gradient(circle at 25% 25%,rgba(6,182,212,.05) 0,transparent 50%),radial-gradient(circle at 75% 75%,rgba(6,182,212,.03) 0,transparent 60%),linear-gradient(45deg,rgba(0,0,0,.1),transparent);border:2px solid hsla(0,0%,100%,.1);display:flex;height:100%;justify-content:center;overflow:hidden;perspective:1500px;position:relative;width:100%}.neural-matrix{animation:neuralMatrixRotate 30s linear infinite;height:350px;position:absolute;transform-origin:center center;transform-style:preserve-3d;width:350px}.neural-node{animation:nodePulse 2s ease-in-out infinite;background:radial-gradient(circle,var(--accent-primary),var(--accent-secondary));border-radius:50%;box-shadow:0 0 15px var(--accent-cyan-08);height:8px;position:absolute;width:8px}.neural-connection{animation:dataFlow 3s linear infinite;background:linear-gradient(90deg,transparent,var(--accent-primary),var(--accent-secondary),var(--accent-primary),transparent);height:1px;opacity:.6;position:absolute}.matrix-layer{height:100%;position:absolute;transform-style:preserve-3d;width:100%}.layer-1{animation:matrixLayer1 15s linear infinite}.layer-2{animation:matrixLayer2 18s linear infinite reverse}.layer-3{animation:matrixLayer3 22s linear infinite}.geometric-frame{background:rgba(6,182,212,.02);border:1px solid var(--accent-cyan-03);position:absolute;transform-style:preserve-3d;transition:all .3s ease}.frame-cube{animation:framePulse 4s ease-in-out infinite;height:100px;left:50%;top:50%;transform:translate(-50%,-50%) rotateX(45deg) rotateY(45deg);width:100px}.frame-diamond{animation:diamondSpin 8s linear infinite;clip-path:polygon(50% 0,100% 50%,50% 100%,0 50%);height:80px;left:50%;top:50%;transform:translate(-50%,-50%) rotate(45deg) scale(.8);width:80px}.frame-hexagon{animation:hexagonFloat 6s ease-in-out infinite;clip-path:polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%);height:120px;left:50%;top:50%;transform:translate(-50%,-50%) scale(1.2);width:120px}.quantum-core{animation:quantumPulse 3s ease-in-out infinite;background:conic-gradient(from 0deg at 50% 50%,#8b1538,#e61651,#ff4d7d,#e61651,#8b1538);box-shadow:0 0 60px #06b6d4,0 0 100px rgba(230,22,81,.5),inset 0 0 30px rgba(0,0,0,.8);filter:blur(0);height:60px;left:50%;top:50%;transform:translate(-50%,-50%) rotateX(60deg);width:60px}.quantum-core,.quantum-core:after{border-radius:50%;position:absolute}.quantum-core:after{animation:quantumRing 2s ease-in-out infinite;background:radial-gradient(circle at 50% 50%,transparent 30%,var(--accent-cyan-02) 50%,transparent 70%);content:"";inset:-10px}.data-stream{animation:streamFlow 2s linear infinite;background:linear-gradient(to bottom,transparent,var(--accent-primary),var(--accent-secondary),transparent);height:100px;position:absolute;width:2px}.stream-1{animation-delay:0s;left:20%}.stream-2{animation-delay:.5s;left:40%}.stream-3{animation-delay:1s;left:60%}.stream-4{animation-delay:1.5s;left:80%}.contact{background:var(--secondary-dark);padding:8rem 0}.contact-content{display:grid;gap:6rem;grid-template-columns:1fr 1fr;margin-top:4rem}.contact-info h3{color:var(--text-primary);font-size:1.8rem;margin-bottom:1rem}.contact-info p{color:var(--text-secondary);line-height:1.7;margin-bottom:2rem}.contact-details{display:flex;flex-direction:column;gap:1rem}.contact-item{border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;justify-content:space-between;padding:1rem 0}.contact-label{color:var(--text-muted);font-size:.9rem;letter-spacing:.1em;text-transform:uppercase}.contact-value{color:var(--text-primary);font-weight:500}.contact-form{display:flex;flex-direction:column;gap:1.5rem}.form-group{position:relative}.form-group input,.form-group select,.form-group textarea{background:rgba(26,26,26,.8);border-radius:4px;color:var(--text-primary);font-family:var(--font-primary);padding:1rem;transition:var(--transition-smooth);width:100%}.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--accent-cyan);box-shadow:0 0 0 2px var(--accent-cyan-02)}.form-group input::-moz-placeholder,.form-group textarea::-moz-placeholder{color:var(--text-muted)!important}.form-group input::placeholder,.form-group textarea::placeholder{color:var(--text-muted)!important}.form-group input,.form-group select,.form-group textarea{color:var(--text-primary)!important}.cta-button{color:var(--accent-primary)!important}.cta-button:hover{color:var(--primary-dark)!important}.submit-button{color:var(--accent-primary)!important}.submit-button:hover{color:var(--primary-dark)!important}.client-services{background:var(--gradient-dark);padding:5rem 0;position:relative}.client-services:before{background:radial-gradient(circle at 30% 20%,rgba(6,182,212,.05) 0,transparent 50%),radial-gradient(circle at 70% 80%,rgba(6,182,212,.05) 0,transparent 50%);content:"";height:100%;left:0;position:absolute;top:0;width:100%;z-index:0}.client-services .container{position:relative;z-index:1}.client-services-grid{align-items:stretch;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));justify-content:center;margin-bottom:4rem}.client-service-card{align-items:flex-start;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:rgba(13,20,32,.8);border:1px solid var(--accent-cyan-02);border-radius:16px;display:flex;flex-direction:column;height:100%;justify-content:space-between;overflow:hidden;padding:3rem;position:relative;transition:var(--transition-smooth)}.client-service-card:before{background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));content:"";height:2px;left:0;opacity:0;position:absolute;top:0;transition:var(--transition-smooth);width:100%}.client-service-card:hover{border-color:var(--accent-cyan);box-shadow:var(--shadow-harsh);transform:translateY(-5px)}.client-service-card:hover:before{opacity:1}.client-service-card .service-icon{align-items:center;background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03);border-radius:12px;display:flex;height:60px;justify-content:center;margin-bottom:1.5rem;width:60px}.icon-consultation,.icon-implementation,.icon-support{background:var(--accent-cyan);border-radius:4px;height:30px;position:relative;width:30px}.icon-consultation:before{border:2px solid var(--text-primary);border-radius:50%;content:"";height:16px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:16px}.icon-implementation:before{clip-path:polygon(50% 0,0 100%,100% 100%);height:18px;left:6px;top:6px;width:18px}.icon-implementation:before,.icon-support:before{background:var(--text-primary);content:"";position:absolute}.icon-support:before{border-radius:50%;height:14px;left:8px;top:8px;width:14px}.client-service-card h3{color:var(--text-primary)!important;font-family:var(--font-display);font-size:1.5rem;margin-bottom:1rem}.client-service-card p{color:var(--text-secondary)!important;line-height:1.6;margin-bottom:1.5rem}.service-cta{margin-top:2rem}.service-button{background:var(--accent-primary);border:2px solid var(--accent-cyan);border-radius:6px;box-shadow:0 0 15px var(--accent-cyan-03);color:var(--accent-cyan)!important;display:inline-block;font-size:.9rem;font-weight:500;letter-spacing:.5px;overflow:hidden;padding:.75rem 1.5rem;position:relative;text-decoration:none;text-transform:uppercase;transition:var(--transition-smooth)}.service-button:before{background:var(--accent-secondary);content:"";height:100%;left:-100%;position:absolute;top:0;transition:var(--transition-smooth);width:100%;z-index:-1}.service-button:hover{border-color:var(--accent-electric);box-shadow:0 0 30px var(--accent-cyan-08),0 0 50px rgba(0,217,255,.5);color:var(--accent-electric)!important;text-shadow:0 0 8px rgba(0,217,255,.8);transform:translateY(-2px)}.service-button:hover:before{left:0}.client-value-proposition{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:rgba(0,0,0,.5);border:1px solid hsla(0,0%,100%,.1);border-radius:12px;padding:3rem}.value-content h3{color:var(--text-primary)!important;font-family:var(--font-display);font-size:2rem;margin-bottom:1rem;text-align:center}.value-content p{color:var(--text-secondary)!important;font-size:1.1rem;margin-bottom:2.5rem;text-align:center}.metrics-grid{align-items:stretch;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.metric,.metrics-grid{justify-content:center}.metric{align-items:center;background:rgba(26,26,26,.6);border:1px solid hsla(0,0%,100%,.05);border-radius:16px;display:flex;flex-direction:column;height:100%;padding:1.5rem;text-align:center}.metric-value{color:var(--accent-primary)!important;display:block;font-family:var(--font-display);font-size:2.5rem;margin-bottom:.5rem}.metric-label{color:var(--text-muted)!important;font-size:.9rem;letter-spacing:.5px;text-transform:uppercase}.admin-services-section{border-top:1px solid var(--accent-cyan-02);margin-top:4rem;padding-top:4rem;position:relative}.section-subtitle{color:var(--text-primary)!important;font-family:var(--font-display);font-size:2.5rem;font-weight:600;letter-spacing:-.02em;margin-bottom:3rem;position:relative;text-align:center}.section-subtitle:after{background:linear-gradient(90deg,var(--accent-primary),var(--accent-secondary));bottom:-.75rem;content:"";height:2px;left:50%;position:absolute;transform:translateX(-50%);width:40px}.admin-services-grid{align-items:stretch;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(400px,1fr));justify-content:center;margin-bottom:4rem}.admin-service-card{align-items:flex-start;-webkit-backdrop-filter:blur(25px);backdrop-filter:blur(25px);background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.85));border:1px solid var(--accent-cyan-02);border-radius:16px;cursor:pointer;display:flex;flex-direction:column;height:100%;justify-content:space-between;overflow:hidden;padding:3rem;position:relative;transition:all .4s cubic-bezier(.4,0,.2,1)}.admin-service-card:before{background:linear-gradient(145deg,rgba(6,182,212,.02),transparent 50%,rgba(6,182,212,.02));border-radius:20px;bottom:0;left:0;right:0;top:0}.admin-service-card:after,.admin-service-card:before{content:"";opacity:0;position:absolute;transition:var(--transition-smooth)}.admin-service-card:after{background:linear-gradient(135deg,var(--accent-primary),var(--accent-secondary),var(--accent-tertiary));border-radius:21px;bottom:-1px;left:-1px;right:-1px;top:-1px;z-index:-1}.admin-service-card:hover{border-color:var(--accent-cyan-04);box-shadow:0 20px 60px rgba(0,0,0,.4),0 10px 30px var(--accent-cyan-02);transform:translateY(-8px) scale(1.02)}.admin-service-card:hover:before{opacity:1}.admin-service-card:hover:after{opacity:.3}.admin-service-header{align-items:center;border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;gap:1.5rem;margin-bottom:2rem;padding-bottom:1.5rem}.admin-service-title h4{color:var(--text-primary)!important;font-family:var(--font-display);font-size:1.6rem;font-weight:600;letter-spacing:-.02em;margin-bottom:.5rem}.admin-service-title p{color:var(--text-secondary)!important;font-size:.95rem;line-height:1.5;margin:0}.admin-service-content{margin-top:2rem}.admin-service-content>p{color:var(--text-secondary)!important;font-size:1.05rem;font-style:italic;line-height:1.6;margin-bottom:1.5rem}.service-features{list-style:none;margin:0 0 2rem;padding:0}.service-features li{color:var(--text-muted)!important;font-size:.95rem;line-height:1.5;margin-bottom:.75rem;padding-left:2rem;position:relative;transition:var(--transition-smooth)}.service-features li:before{color:var(--accent-primary);content:"◆";font-size:.8rem;left:0;position:absolute;top:.1rem;transition:var(--transition-smooth)}.admin-service-card:hover .service-features li{color:var(--text-secondary)!important;transform:translateX(4px)}.admin-service-card:hover .service-features li:before{color:var(--accent-secondary);transform:scale(1.2)}.icon-banking,.icon-documents{background:var(--accent-primary);border-radius:6px;height:30px;position:relative;width:30px}.icon-documents:before{clip-path:polygon(0 0,70% 0,100% 30%,100% 100%,0 100%)}.icon-banking:before,.icon-documents:before{background:var(--text-primary);content:"";height:18px;left:6px;position:absolute;top:6px;width:18px}.icon-banking:before{clip-path:polygon(0 30%,100% 30%,100% 70%,0 70%)}.admin-service-content{display:grid;gap:2rem}.access-portal h4,.banking-portal h4{color:var(--text-primary)!important;font-size:1.4rem;margin-bottom:1rem}.admin-form{background:rgba(0,0,0,.3);border:1px solid hsla(0,0%,100%,.1);border-radius:12px;margin-bottom:2rem;padding:2rem}.form-row{display:grid;gap:1.5rem;grid-template-columns:1fr 1fr}.admin-form .form-group,.form-row{margin-bottom:1.5rem}.admin-form label{color:var(--text-primary)!important;display:block;font-weight:500;margin-bottom:.5rem}.admin-form input{background:rgba(26,26,26,.8);border:1px solid hsla(0,0%,100%,.2);border-radius:6px;color:var(--text-primary)!important;font-family:var(--font-primary);padding:.75rem;transition:var(--transition-smooth);width:100%}.admin-form input:focus{border-color:var(--accent-cyan);box-shadow:0 0 0 2px var(--accent-cyan-02);outline:none}.admin-button{background:var(--accent-primary);border:2px solid var(--accent-cyan);border-radius:6px;box-shadow:0 0 20px var(--accent-cyan-03);color:var(--accent-cyan)!important;cursor:pointer;font-size:.9rem;font-weight:500;letter-spacing:.1em;overflow:hidden;padding:1rem 2rem;position:relative;text-transform:uppercase}.admin-button,.admin-button:before{transition:var(--transition-smooth)}.admin-button:before{background:var(--accent-secondary);content:"";height:100%;left:-100%;position:absolute;top:0;width:100%;z-index:-1}.admin-button:hover{border-color:var(--accent-electric);box-shadow:0 0 40px var(--accent-cyan-08),0 0 60px rgba(0,217,255,.6);color:var(--accent-electric)!important;text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px)}.admin-button:hover:before{left:0}.admin-info-grid{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}.info-item{background:rgba(0,0,0,.3);border:1px solid hsla(0,0%,100%,.1);border-radius:8px;padding:1.5rem}.info-item h5{color:var(--text-primary)!important;font-size:1.1rem;margin-bottom:.75rem}.info-item p{color:var(--text-secondary)!important;margin-bottom:1rem}.info-item ul{list-style:none;margin:0;padding:0}.info-item li{color:var(--text-muted)!important;margin-bottom:.5rem;padding-left:1.5rem;position:relative}.info-item li:before{color:var(--accent-primary);content:"◆";font-size:.8rem;left:0;position:absolute}.payment-methods-grid{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin-bottom:2rem}.payment-method{background:rgba(0,0,0,.3);border:1px solid hsla(0,0%,100%,.1);border-radius:12px;padding:2rem;transition:var(--transition-smooth)}.payment-method.primary{background:rgba(6,182,212,.05);border-color:var(--accent-cyan-03)}.payment-method:hover{border-color:var(--accent-cyan-04);transform:translateY(-2px)}.method-header h5{color:var(--text-primary)!important;font-size:1.2rem;margin:0}.method-badge.primary{background:var(--accent-cyan-03);color:var(--accent-secondary)}.method-details{margin-bottom:1.5rem}.detail-item{align-items:center;border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;justify-content:space-between;padding:.75rem 0}.detail-label{color:var(--text-muted)!important}.detail-value{color:var(--text-primary)!important}.detail-value.secure{color:var(--accent-primary)!important;cursor:pointer;text-decoration:underline}.detail-value.secure:hover{color:var(--accent-secondary)!important}.method-note{color:var(--text-secondary)!important;margin:0}.instruction-steps{gap:1.5rem;margin-bottom:2rem}.step-number{font-size:.9rem;height:32px;width:32px}.step-content h5{color:var(--text-primary)!important;font-size:1.1rem;margin-bottom:.5rem}.step-content p{color:var(--text-secondary)!important;margin:0}.security-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}.security-item{align-items:center;background:rgba(0,0,0,.2);border:1px solid hsla(0,0%,100%,.05);border-radius:8px;display:flex;gap:.75rem;padding:1rem}.security-icon{flex-shrink:0;font-size:1.2rem}.security-item span:last-child{color:var(--text-secondary)!important;font-size:.9rem}@media (max-width:768px){.admin-services-grid,.client-services-grid,.services-grid{gap:1.5rem;grid-template-columns:1fr;margin-left:auto;margin-right:auto;max-width:100%}.admin-service-card,.client-service-card,.service-card{margin:0 auto;max-width:100%;padding:2rem}.client-value-proposition{padding:2rem}.metrics-grid{gap:1rem;grid-template-columns:repeat(2,1fr)}.metric{padding:1rem}.metric-value{font-size:2rem}.admin-service-header{flex-direction:row;gap:1.5rem;text-align:left}.section-subtitle{font-size:2rem}.form-row{gap:1rem;grid-template-columns:1fr}.payment-methods-grid{gap:1.5rem;grid-template-columns:1fr}.admin-info-grid{gap:1rem;grid-template-columns:1fr}.security-grid{gap:.75rem;grid-template-columns:1fr}.step{gap:1rem}.step-content h5{font-size:1rem}}.submit-button{background:var(--accent-primary);border:2px solid var(--accent-cyan);box-shadow:0 0 20px var(--accent-cyan-03);color:var(--accent-cyan);cursor:pointer;font-weight:500;letter-spacing:.1em;overflow:hidden;padding:1rem 2rem;position:relative;text-transform:uppercase;transition:var(--transition-smooth)}.submit-button:before{background:var(--accent-secondary);content:"";height:100%;left:-100%;position:absolute;top:0;transition:var(--transition-smooth);width:100%;z-index:-1}.submit-button:hover:before{left:0}.submit-button:hover{border-color:var(--accent-electric);box-shadow:0 0 40px var(--accent-cyan-08),0 0 60px rgba(0,217,255,.6);color:var(--accent-electric);text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px)}.content-grid{grid-template-columns:1fr 350px}.main-content{min-width:0}.sidebar-content{height:-moz-fit-content;height:fit-content}@media (max-width:1024px){.content-grid{grid-template-columns:1fr}.sidebar-content{margin-top:2rem;position:static}}.footer{background:var(--primary-dark);border-top:1px solid hsla(0,0%,100%,.1)}.footer-content{align-items:center;display:flex;justify-content:space-between}.footer-text p{color:var(--text-muted);font-size:.9rem}@keyframes fadeInUp{0%{opacity:0;transform:translateY(50px)}to{opacity:1;transform:translateY(0)}}@keyframes rotatePattern{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}@keyframes neuralMatrixRotate{0%{transform:rotateX(0deg) rotateY(0deg) rotate(0deg)}25%{transform:rotateX(90deg) rotateY(60deg) rotate(30deg)}50%{transform:rotateX(180deg) rotateY(120deg) rotate(60deg)}75%{transform:rotateX(270deg) rotateY(180deg) rotate(90deg)}to{transform:rotateX(1turn) rotateY(240deg) rotate(120deg)}}@keyframes nodePulse{0%,to{box-shadow:0 0 15px rgba(230,208,41,.8);transform:scale(1)}50%{box-shadow:0 0 25px #06b6d4;transform:scale(1.5)}}@keyframes dataFlow{0%{opacity:0;transform:translateX(-100px)}50%{opacity:1}to{opacity:0;transform:translateX(100px)}}@keyframes matrixLayer1{0%{transform:rotateY(0deg) rotate(0deg)}to{transform:rotateY(1turn) rotate(180deg)}}@keyframes matrixLayer2{0%{transform:rotateX(0deg) rotate(0deg)}to{transform:rotateX(1turn) rotate(-180deg)}}@keyframes matrixLayer3{0%{transform:rotateX(0deg) rotateY(0deg)}to{transform:rotateX(180deg) rotateY(1turn)}}@keyframes framePulse{0%,to{border-color:var(--accent-cyan-03);transform:translate(-50%,-50%) rotateX(45deg) rotateY(45deg) scale(1)}50%{border-color:rgba(6,182,212,.6);transform:translate(-50%,-50%) rotateX(45deg) rotateY(45deg) scale(1.1)}}@keyframes diamondSpin{0%{transform:translate(-50%,-50%) rotate(45deg) scale(.8)}to{transform:translate(-50%,-50%) rotate(405deg) scale(.8)}}.page-header{background:linear-gradient(180deg,transparent,rgba(0,0,0,.5));margin-top:80px;padding:6rem 0 3rem}.page-title{background:linear-gradient(135deg,var(--text-primary),var(--accent-cyan));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.page-subtitle{color:var(--text-muted)}.content-section{min-height:calc(100vh - 400px);padding:4rem 0}.content-grid{align-items:start;gap:3rem;grid-template-columns:1fr 400px}.main-content{min-height:600px}.sidebar-content{max-width:400px;position:sticky;top:100px}.info-card{background:var(--secondary-dark);border:1px solid var(--accent-cyan-02);border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.3);margin-bottom:1.5rem;padding:2rem;transition:var(--transition-smooth)}.info-card:hover{border-color:var(--accent-cyan-04);box-shadow:0 6px 20px rgba(0,0,0,.4);transform:translateY(-2px)}.info-card h3{color:var(--accent-primary);font-family:var(--font-display);font-size:1.25rem;font-weight:600;margin-bottom:1.25rem}.status-dot.processing{background:#f59e0b}.year-list{list-style:none;margin:0;padding:0}.year-link{border-bottom:1px solid hsla(0,0%,100%,.1);display:block;padding:.5rem 0}.year-link:hover{color:var(--accent-primary);padding-left:.5rem}.doc-list{list-style:none;margin:0;padding:0}.doc-list li{border-bottom:1px solid hsla(0,0%,100%,.05);color:var(--text-secondary);padding:.5rem 0}.contact-card{background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03);border-radius:12px;margin-bottom:1.5rem;padding:2rem}.contact-details p{font-size:.9rem;margin:.5rem 0}.access-portal{background:var(--secondary-dark);border-radius:12px}.portal-description{color:var(--text-muted);margin-bottom:2rem}.login-form{margin-bottom:2rem}.access-button{background:var(--accent-primary);border:none;border-radius:8px;color:var(--text-primary);font-weight:600;letter-spacing:.05em;padding:1rem;width:100%}.access-button:hover:not(:disabled){background:var(--accent-secondary);box-shadow:0 4px 12px var(--accent-cyan-04);transform:translateY(-2px)}.access-button:disabled{cursor:not-allowed;opacity:.6}.security-notice{background:rgba(0,0,0,.5);border:1px solid hsla(0,0%,100%,.1);padding:1.5rem}.security-notice h3{color:var(--accent-primary);font-size:1.1rem}.security-notice li{padding:.5rem 0 .5rem 1.5rem}.security-notice li:before{color:var(--accent-primary);content:"•"}@media (max-width:1024px){.content-grid{grid-template-columns:1fr}.sidebar-content{margin-top:3rem;max-width:100%;position:relative;top:0}.contact-card,.info-card{margin-left:auto;margin-right:auto;max-width:600px}}.ai-stat{color:var(--text-muted);cursor:help;font-style:italic;position:relative;transition:var(--transition-smooth)}.ai-stat:after{background:var(--accent-primary);bottom:-2px;content:"";height:1px;left:0;position:absolute;transition:width .3s ease;width:0}.ai-stat:hover:after{width:100%}.ai-stat.loading{animation:pulse 2s infinite}.ai-stat.ready{color:var(--text-primary);font-style:normal}@keyframes hexagonFloat{0%,to{transform:translate(-50%,-50%) scale(1.2) translateY(0)}50%{transform:translate(-50%,-50%) scale(1.2) translateY(-10px)}}@keyframes quantumPulse{0%,to{box-shadow:0 0 60px #06b6d4,0 0 100px rgba(230,22,81,.5),inset 0 0 30px rgba(0,0,0,.8);transform:translate(-50%,-50%) rotateX(60deg) scale(1)}50%{box-shadow:0 0 80px #06b6d4,0 0 150px rgba(230,22,81,.8),inset 0 0 40px rgba(0,0,0,.9);transform:translate(-50%,-50%) rotateX(60deg) scale(1.3)}}@keyframes quantumRing{0%,to{opacity:.5;transform:scale(1) rotate(0deg)}50%{opacity:.8;transform:scale(1.2) rotate(180deg)}}@keyframes streamFlow{0%{opacity:0;transform:translateY(-50px)}50%{opacity:1}to{opacity:0;transform:translateY(150px)}}@keyframes ctaPulse{0%,to{box-shadow:0 0 20px var(--accent-cyan-03)}50%{box-shadow:0 0 30px var(--accent-cyan-05)}}.axis-ai-showcase{background:var(--bg-secondary)}.ai-badge{background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-02);border-radius:30px;color:var(--accent-primary);display:inline-block;font-size:.75rem;font-weight:600;letter-spacing:.1em;margin-bottom:1.5rem;padding:.5rem 1.5rem;text-transform:uppercase}.ai-showcase-title{font-size:3rem;font-weight:700}.gradient-text{background:linear-gradient(135deg,var(--accent-primary) 0,var(--accent-secondary) 100%)}.ai-showcase-description{margin-bottom:3rem}.ai-feature{background:rgba(0,0,0,.3);border:1px solid var(--accent-cyan-01)}.ai-feature:hover{background:rgba(0,0,0,.4);border-color:var(--accent-cyan-03)}.ai-feature-icon{background:linear-gradient(135deg,var(--accent-cyan-02),var(--accent-cyan-01));margin-bottom:1rem}.ai-feature-icon:after{background:url(${___CSS_LOADER_URL_REPLACEMENT_0___}) 50% no-repeat;background-size:30px;inset:0;opacity:.7}.ai-feature p{line-height:1.6}.ai-showcase-cta{margin-top:3rem}.ai-showcase{background:linear-gradient(180deg,var(--bg-light) 0,var(--bg-secondary) 100%);border-bottom:1px solid var(--accent-cyan-01);padding:5rem 0}.ai-header{margin-bottom:3rem;text-align:center}.ai-header .section-subtitle{color:var(--text-secondary);font-size:1.125rem;margin-top:.5rem}.ai-demo-card{align-items:center;display:grid;gap:4rem;grid-template-columns:1fr 2fr;margin-bottom:4rem}.ai-visual{height:300px;position:relative}.ai-brain{height:250px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:250px}.neural-layer{animation:neuralPulse 3s ease-in-out infinite;border:2px solid var(--accent-primary);border-radius:50%;height:100%;position:absolute;width:100%}.neural-layer.layer-1{animation-delay:0s;opacity:.3}.neural-layer.layer-2{animation-delay:1s;opacity:.5;transform:scale(.8)}.neural-layer.layer-3{animation-delay:2s;opacity:.7;transform:scale(.6)}.ai-core{background:var(--accent-primary);border-radius:50%;box-shadow:0 0 30px var(--accent-cyan-08);height:60px;left:50%;position:absolute;top:50%;transform:translate(-50%,-50%);width:60px}@keyframes neuralPulse{0%,to{opacity:.3;transform:scale(1)}50%{opacity:.8;transform:scale(1.1)}}.ai-features h3{color:var(--text-primary);font-size:2rem;margin-bottom:2rem}.feature-grid{display:grid;gap:2rem;grid-template-columns:repeat(3,1fr);margin-bottom:3rem}.ai-feature{text-align:center}.ai-feature .feature-icon{align-items:center;background:var(--accent-cyan-01);border-radius:12px;color:var(--accent-primary);display:flex;height:60px;justify-content:center;margin:0 auto 1rem;width:60px}.ai-feature h4{color:var(--text-primary);font-size:1.125rem;margin-bottom:.5rem}.ai-feature p{font-size:.875rem}.ai-cta{display:flex;gap:1rem;justify-content:center}.ai-button{align-items:center;border-radius:6px;display:inline-flex;font-weight:600;gap:.5rem;overflow:hidden;padding:1rem 2rem;position:relative;text-decoration:none;transition:all .3s ease}.ai-button.primary{background:var(--accent-primary);border:2px solid var(--accent-cyan);box-shadow:0 0 20px var(--accent-cyan-03);color:var(--accent-cyan)}.ai-button.primary:hover{background:var(--accent-secondary);border-color:var(--accent-electric);box-shadow:0 0 40px var(--accent-cyan-08),0 0 60px rgba(0,217,255,.6);color:var(--accent-electric);text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px)}.ai-button.secondary{background:rgba(63,114,175,.2);border:2px solid var(--accent-cyan);box-shadow:0 0 15px var(--accent-cyan-02);color:var(--accent-cyan)}.ai-button.secondary:hover{background:var(--accent-primary);border-color:var(--accent-electric);box-shadow:0 0 30px var(--accent-cyan-08),0 0 50px rgba(0,217,255,.5);color:var(--accent-electric);text-shadow:0 0 8px rgba(0,217,255,.8);transform:translateY(-2px)}.ai-stats-row{background:rgba(6,182,212,.05);border-radius:12px;display:grid;gap:2rem;grid-template-columns:repeat(4,1fr);padding:3rem}.ai-stat{text-align:center}.ai-stat .stat-number{color:var(--accent-primary);display:block;font-size:2.5rem;font-weight:700;margin-bottom:.5rem}.ai-stat .stat-label{color:var(--text-secondary);font-size:.875rem;letter-spacing:.05em;text-transform:uppercase}@media (max-width:768px){.ai-demo-card{gap:2rem;grid-template-columns:1fr}.ai-visual{height:200px}.ai-brain{height:150px;width:150px}.feature-grid{grid-template-columns:1fr}.ai-stats-row{grid-template-columns:repeat(2,1fr)}}.page-header{background:var(--gradient-dark);border-bottom:1px solid var(--accent-cyan-02);padding:8rem 0 4rem;text-align:center}.page-title{color:var(--text-primary);font-family:var(--font-display);font-size:3rem;font-weight:700;letter-spacing:-.025em;margin-bottom:1rem}.page-subtitle{color:var(--text-secondary);font-size:1.25rem;font-weight:300}.content-section{background:var(--secondary-dark);padding:6rem 0}.banking-grid,.content-grid{display:grid;gap:4rem;grid-template-columns:2fr 1fr;margin-top:2rem}.access-portal{-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px);background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.8));border:1px solid var(--accent-cyan-02);border-radius:16px;padding:3rem}.access-portal h2{color:var(--text-primary);font-size:1.8rem;margin-bottom:1rem}.portal-description{color:var(--text-secondary);line-height:1.6;margin-bottom:2.5rem}.login-form{display:flex;flex-direction:column;gap:1.5rem;margin-bottom:3rem}.login-form label{color:var(--text-primary);display:block;font-weight:500;margin-bottom:.5rem}.access-button{background:transparent;border:2px solid var(--accent-primary);border-radius:4px;color:var(--accent-primary);cursor:pointer;font-size:.9rem;font-weight:500;letter-spacing:.1em;padding:1rem 2rem;text-transform:uppercase;transition:var(--transition-smooth)}.access-button:hover{background:var(--accent-primary);color:var(--primary-dark)}.security-notice{background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03);border-radius:8px;padding:2rem}.security-notice h3{color:var(--text-primary);margin-bottom:1rem}.security-notice ul{list-style:none;padding:0}.security-notice li{color:var(--text-secondary);margin-bottom:.5rem;padding-left:1.5rem;position:relative}.security-notice li:before{content:"";left:0;position:absolute;top:0}.compliance-card,.contact-card,.info-card,.roadmap-card,.security-card{-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px);background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.8));border:1px solid var(--accent-cyan-01);border-radius:12px;margin-bottom:2rem;padding:2rem}.compliance-card h3,.contact-card h3,.info-card h3,.roadmap-card h3,.security-card h3{color:var(--text-primary);font-size:1.2rem;margin-bottom:1rem}.status-indicator{align-items:center;display:flex;gap:.5rem;margin-top:1rem}.status-dot{background:var(--accent-primary);border-radius:50%;height:8px;width:8px}.status-dot.processing{animation:pulse 2s infinite;background:orange}.doc-list,.security-list,.year-list{list-style:none;padding:0}.doc-list li,.security-list li,.year-list li{color:var(--text-secondary);margin-bottom:.5rem;padding-left:1.5rem;position:relative}.doc-list li:before,.security-list li:before,.year-list li:before{color:var(--accent-primary);content:"◆";font-size:.8rem;left:0;position:absolute}.year-link{color:var(--text-secondary);text-decoration:none;transition:var(--transition-smooth)}.year-link:hover{color:var(--text-primary)}.payment-methods{margin-bottom:4rem}.payment-methods h2{color:var(--text-primary);font-size:2rem;margin-bottom:2rem}.method-card{-webkit-backdrop-filter:blur(15px);backdrop-filter:blur(15px);background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.8));border:1px solid var(--accent-cyan-01);border-radius:16px;margin-bottom:2rem;padding:2.5rem;transition:var(--transition-smooth)}.method-card.primary{background:linear-gradient(145deg,rgba(6,182,212,.05),hsla(0,0%,8%,.9));border-color:var(--accent-cyan-04)}.method-card.digital{border-color:var(--accent-cyan-02);opacity:.7}.method-header{align-items:center;display:flex;justify-content:space-between;margin-bottom:1.5rem}.method-header h3{color:var(--text-primary);font-size:1.5rem}.method-badge{background:var(--accent-cyan-02);border-radius:12px;color:var(--accent-primary);font-size:.8rem;font-weight:500;letter-spacing:.05em;padding:.25rem .75rem;text-transform:uppercase}.banking-details{margin-bottom:1.5rem}.detail-row{border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;justify-content:space-between;padding:.75rem 0}.detail-label{color:var(--text-muted);font-weight:500}.detail-value{color:var(--text-primary);font-weight:400}.detail-value[data-sensitive=true]{color:var(--accent-primary);cursor:pointer;text-decoration:underline}.method-note{color:var(--text-secondary);font-style:italic;line-height:1.5}.digital-options{margin-bottom:1.5rem}.payment-option{color:var(--text-secondary);display:flex;justify-content:space-between;padding:.5rem 0}.option-status{color:var(--accent-primary);font-size:.9rem}.payment-instructions h2{color:var(--text-primary);font-size:2rem;margin-bottom:2rem}.instruction-steps{display:flex;flex-direction:column;gap:2rem}.step{align-items:flex-start;display:flex;gap:1.5rem}.step-number{align-items:center;background:var(--accent-primary);border-radius:50%;color:var(--primary-dark);display:flex;flex-shrink:0;font-weight:600;height:40px;justify-content:center;width:40px}.step-content h4{color:var(--text-primary);margin-bottom:.5rem}.step-content p{color:var(--text-secondary);line-height:1.6}.compliance-items,.support-details{display:flex;flex-direction:column;gap:1rem}.compliance-item,.support-item{align-items:center;display:flex;justify-content:space-between;padding:.5rem 0}.support-label{color:var(--text-muted);font-size:.9rem}.support-value{color:var(--text-primary);font-weight:500}.compliance-badge{background:var(--accent-cyan-02);border-radius:4px;color:var(--accent-primary);font-size:.75rem;font-weight:600;padding:.25rem .5rem}.roadmap-timeline{display:flex;flex-direction:column;gap:1rem}.timeline-item{align-items:center;border-radius:8px;display:flex;justify-content:space-between;padding:.75rem;transition:var(--transition-smooth)}.timeline-item.current{background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03)}.timeline-date{color:var(--accent-primary);font-size:.9rem;font-weight:600}.timeline-desc{color:var(--text-secondary);font-size:.9rem}@keyframes pulse{0%,to{opacity:1}50%{opacity:.5}}.service-detail-grid{display:grid;gap:4rem;grid-template-columns:2fr 1fr;margin-top:2rem}.service-icon-large{align-items:center;background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03);border-radius:20px;display:flex;height:120px;justify-content:center;margin-bottom:2rem;width:120px}.service-icon-large .icon-accounting,.service-icon-large .icon-consultation,.service-icon-large .icon-contract,.service-icon-large .icon-implementation,.service-icon-large .icon-investment,.service-icon-large .icon-support{height:60px;width:60px}.service-overview{background:linear-gradient(145deg,hsla(0,0%,4%,.95),hsla(0,0%,8%,.8));border:1px solid var(--accent-cyan-02);border-radius:20px;margin-bottom:3rem;padding:3rem}.overview-content h2{color:var(--text-primary);font-family:var(--font-display);font-size:2.5rem;margin-bottom:1.5rem}.overview-content>p{color:var(--text-secondary);font-size:1.2rem;line-height:1.7;margin-bottom:2.5rem}.capability-highlights,.implementation-pillars,.support-pillars{display:grid;gap:2rem}.area-item,.highlight-item,.pillar-item{background:rgba(0,0,0,.3);border:1px solid hsla(0,0%,100%,.1);border-radius:12px;padding:2rem}.area-item h4,.highlight-item h4,.pillar-item h4{color:var(--text-primary);font-size:1.3rem;margin-bottom:1rem}.area-item p,.highlight-item p,.pillar-item p{color:var(--text-secondary);line-height:1.6}.consultation-process,.deliverables-section,.implementation-phases,.monitoring-capabilities,.optimization-process,.strategy-types,.support-tiers,.technical-specs,.training-program{margin-bottom:3rem}.consultation-process h3,.deliverables-section h3,.implementation-phases h3,.monitoring-capabilities h3,.optimization-process h3,.strategy-types h3,.support-tiers h3,.technical-specs h3,.training-program h3{color:var(--text-primary);font-family:var(--font-display);font-size:2rem;margin-bottom:2rem}.capabilities-grid,.deliverables-grid,.process-grid,.specs-grid,.strategy-grid,.tiers-grid,.training-tracks{align-items:stretch;display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));justify-content:center}.capability-item,.deliverable-item,.process-phase,.spec-item,.strategy-card,.tier-card,.track-card{align-items:flex-start;background:hsla(0,0%,6%,.9);border:1px solid var(--accent-cyan-02);border-radius:16px;display:flex;flex-direction:column;height:100%;justify-content:space-between;padding:2rem;transition:var(--transition-smooth)}.capability-item:hover,.deliverable-item:hover,.process-phase:hover,.spec-item:hover,.strategy-card:hover,.tier-card:hover,.track-card:hover{border-color:var(--accent-cyan-04);transform:translateY(-2px)}.capability-item h5,.deliverable-item h5,.spec-item h5,.strategy-card h4,.track-card h4{color:var(--text-primary);font-size:1.2rem;margin-bottom:1rem}.capability-item ul,.spec-item ul,.track-modules{list-style:none;padding:0}.capability-item li,.spec-item li,.track-modules li{color:var(--text-muted);margin-bottom:.5rem;padding-left:1.5rem;position:relative}.capability-item li:before,.spec-item li:before,.track-modules li:before{color:var(--accent-primary);content:"◆";font-size:.8rem;left:0;position:absolute}.optimization-timeline,.phases-timeline,.process-timeline{display:flex;flex-direction:column;gap:2rem}.optimization-step,.phase-item,.timeline-step{align-items:flex-start;background:hsla(0,0%,6%,.9);border:1px solid var(--accent-cyan-02);border-radius:16px;display:flex;gap:2rem;padding:2.5rem}.phase-marker,.step-number{align-items:center;background:var(--accent-primary);border-radius:50%;color:var(--primary-dark);display:flex;flex-shrink:0;font-weight:600;height:40px;justify-content:center;width:40px}.step-icon{flex-shrink:0;font-size:2rem}.phase-content,.step-content{flex:1}.phase-content h4,.step-content h4{color:var(--text-primary);font-size:1.3rem;margin-bottom:.75rem}.phase-content p,.step-content p{color:var(--text-secondary);line-height:1.6;margin-bottom:1rem}.phase-timeline,.step-duration{color:var(--accent-primary);font-size:.9rem;font-weight:500}.phase-details{display:flex;flex-wrap:wrap;gap:.5rem;margin:1rem 0}.detail-item{background:var(--accent-cyan-01);border-radius:12px;color:var(--accent-primary);font-size:.85rem;padding:.25rem .75rem}.tier-header{align-items:center;display:flex;justify-content:space-between;margin-bottom:1.5rem}.tier-badge{background:var(--accent-cyan-02);border-radius:12px;color:var(--accent-primary);font-size:.8rem;letter-spacing:.05em;padding:.25rem .75rem;text-transform:uppercase}.tier-card.premium .tier-badge{background:var(--accent-cyan-03);color:var(--accent-secondary)}.tier-sla{border-top:1px solid hsla(0,0%,100%,.1);display:flex;gap:1rem;margin-top:1.5rem;padding-top:1.5rem}.sla-metric{color:var(--accent-primary);font-size:.9rem;font-weight:500}.metric-examples,.strategy-metrics{display:flex;flex-wrap:wrap;gap:.5rem;margin-top:1rem}.metric,.metric-tag{background:var(--accent-cyan-01);border-radius:12px;color:var(--accent-primary);font-size:.8rem;padding:.25rem .75rem}.cta-card{background:linear-gradient(145deg,var(--accent-cyan-01),rgba(6,182,212,.05));border:1px solid var(--accent-cyan-03);border-radius:16px;margin-bottom:2rem;padding:2.5rem;text-align:center}.cta-card h3{color:var(--text-primary);font-size:1.5rem;margin-bottom:1rem}.cta-card p{color:var(--text-secondary);margin-bottom:1.5rem}.emergency-contact,.expertise-card,.implementation-stats,.metrics-card,.support-metrics{background:hsla(0,0%,6%,.9);border:1px solid var(--accent-cyan-02);border-radius:16px;margin-bottom:2rem;padding:2rem}.emergency-contact h3,.expertise-card h3,.implementation-stats h3,.metrics-card h3,.support-metrics h3{color:var(--text-primary);font-size:1.3rem;margin-bottom:1.5rem}.metric-list,.stat-list{display:flex;flex-direction:column;gap:1rem}.metric-item,.stat-item{align-items:center;border-bottom:1px solid hsla(0,0%,100%,.1);display:flex;justify-content:space-between;padding:.75rem 0}.metric-value,.stat-value{color:var(--accent-primary);font-size:1.1rem;font-weight:600}.metric-label,.stat-label{color:var(--text-muted);font-size:.9rem}.expertise-list{display:flex;flex-direction:column;gap:1rem}.expertise-item{align-items:center;background:rgba(0,0,0,.3);border-radius:8px;display:flex;gap:1rem;padding:.75rem}.expertise-icon{font-size:1.2rem}.expertise-text{color:var(--text-secondary);font-size:.95rem}.tech-categories{display:flex;flex-direction:column;gap:1rem}.tech-category{background:rgba(0,0,0,.3);border-radius:8px;padding:1rem}.tech-category h5{color:var(--text-primary);font-size:1rem;margin-bottom:.5rem}.tech-items{color:var(--text-muted);font-size:.9rem;line-height:1.5}.related-services{background:hsla(0,0%,6%,.9);border:1px solid var(--accent-cyan-02);border-radius:16px;padding:2rem}.related-services h3{color:var(--text-primary);font-size:1.3rem;margin-bottom:1.5rem}.service-links{gap:1rem}.service-link,.service-links{display:flex;flex-direction:column}.service-link{background:rgba(0,0,0,.3);border-radius:8px;padding:1rem;text-decoration:none;transition:var(--transition-smooth)}.service-link:hover{background:var(--accent-cyan-01);transform:translateX(4px)}.service-name{color:var(--text-primary);font-weight:500;margin-bottom:.25rem}.service-desc{color:var(--text-muted);font-size:.9rem}@media (max-width:768px){.service-detail-grid{gap:2rem;grid-template-columns:1fr}.service-overview{padding:2rem}.overview-content h2{font-size:2rem}.capabilities-grid,.deliverables-grid,.process-grid,.specs-grid,.strategy-grid,.tiers-grid,.training-tracks{align-items:stretch;gap:1.5rem;grid-template-columns:1fr;justify-content:center}.capability-item,.deliverable-item,.process-phase,.spec-item,.strategy-card,.tier-card,.track-card{margin:0 auto;max-width:100%}.optimization-step,.phase-item,.timeline-step{align-items:center;flex-direction:column;gap:1rem;padding:2rem;text-align:center}.phase-details{gap:.25rem}.phase-details,.tier-sla{align-items:center;flex-direction:column}.tier-sla{gap:.5rem}.nav-container{flex-direction:column;gap:1rem;padding:1rem}.nav-menu{gap:1rem}.hero{padding:8rem 1rem 2rem;text-align:center}.hero-visual{display:none}.services-grid{gap:2rem;grid-template-columns:1fr}.about-content,.contact-content{gap:3rem;grid-template-columns:1fr}.about-visual{height:200px}.footer-content{flex-direction:column;gap:1rem;text-align:center}.container{padding:0 1rem}}.mobile-nav-toggle{align-items:center;background:none;border:none;cursor:pointer;display:none;flex-direction:column;gap:4px;height:32px;justify-content:center;padding:8px;position:relative;width:32px;z-index:1000}.hamburger-line{background:var(--text-primary);height:2px;transform-origin:center;transition:var(--transition-smooth);width:20px}.mobile-nav-toggle.active .hamburger-line:first-child{transform:rotate(45deg) translate(6px,6px)}.mobile-nav-toggle.active .hamburger-line:nth-child(2){opacity:0}.mobile-nav-toggle.active .hamburger-line:nth-child(3){transform:rotate(-45deg) translate(6px,-6px)}.form-group input.error,.form-group textarea.error{border-color:#ef4444!important;box-shadow:0 0 0 2px rgba(239,68,68,.2)!important}.error-message{color:#ef4444!important;display:block!important;font-size:.8rem!important;margin-top:.25rem!important}@media (max-width:768px){.mobile-nav-toggle{display:flex}.nav-menu{align-items:center;-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:rgba(0,0,0,.98);border-left:1px solid var(--card-border);flex-direction:column;gap:2rem;height:100vh;justify-content:center;position:fixed;right:-100%;top:0;transition:right .3s cubic-bezier(.4,0,.2,1);width:280px;z-index:999}.nav-menu.mobile-open{right:0}.nav-link{border-bottom:1px solid hsla(0,0%,100%,.1);font-size:1.2rem!important;padding:1rem 2rem!important;text-align:center;width:100%}.nav-link:hover{background:var(--accent-cyan-02)}body.mobile-nav-open{overflow:hidden}.access-button,.cta-button,.service-button,.submit-button{font-size:1rem!important;min-height:48px!important;padding:12px 24px!important}.form-group input,.form-group select,.form-group textarea{font-size:16px!important;min-height:48px!important;padding:12px 16px!important}.admin-service-card,.client-service-card,.service-card{margin-bottom:1.5rem}.hero-title{font-size:2.5rem!important;line-height:1.1!important}.hero-subtitle{font-size:1.1rem!important;margin-bottom:2rem!important}.contact-content{flex-direction:column!important;gap:2rem!important}.contact-form,.contact-info{width:100%!important}}@media (prefers-reduced-motion:reduce){*{animation-duration:.01ms!important;animation-iteration-count:1!important;transition-duration:.01ms!important}}@media (prefers-contrast:high){:root{--text-primary:#fff;--text-secondary:#e0e0e0;--accent-primary:#ff1744;--card-border:#fff}}@media (prefers-color-scheme:dark){:root{--primary-dark:#000;--text-primary:#fff}}.logo-testing-container{background:var(--gradient-dark);min-height:100vh;padding:2rem}.logo-grid{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));margin:2rem 0}.logo-variant{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:2rem;text-align:center;transition:var(--transition-smooth)}.logo-variant:hover{border-color:var(--accent-cyan);box-shadow:var(--shadow-harsh);transform:translateY(-5px)}.logo-variant h3{color:var(--text-primary)!important;font-family:var(--font-display);margin-bottom:1rem}.logo-display{align-items:center;background:hsla(0,0%,100%,.05);border-radius:8px;display:flex;height:150px;justify-content:center;margin:0 auto 1rem;width:150px}.logo-display img{height:120px;width:120px}.size-test{align-items:center;display:flex;gap:1rem;justify-content:center;margin:1rem 0}.size-test img{background:hsla(0,0%,100%,.05);border:1px solid var(--card-border);border-radius:4px;padding:4px}.logo-description{color:var(--text-secondary)!important;font-size:.9rem;margin-bottom:1rem}.context-test{background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;margin-top:2rem;padding:2rem}.context-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-top:1rem}.context-item{background:hsla(0,0%,100%,.02);border-radius:8px;padding:1rem;text-align:center}.context-item h4{color:var(--text-primary)!important;margin-bottom:.5rem}.nav-test{align-items:center;background:rgba(0,0,0,.95);border-radius:8px;display:flex;gap:1rem;padding:1rem}.nav-test img{height:32px;width:32px}.nav-test span{color:var(--text-primary)!important}.recommendations{background:var(--card-bg);border:1px solid var(--accent-primary);border-radius:12px;margin-top:2rem;padding:2rem}.recommendations h2{color:var(--accent-primary)!important;font-family:var(--font-display);margin-bottom:1rem}.recommendations h3{color:var(--text-primary)!important;margin-bottom:.5rem}.recommendations ul{color:var(--text-secondary)!important}.recommendation-highlight{background:var(--accent-cyan-01);border-radius:8px;margin-top:1.5rem;padding:1rem}.recommendation-highlight p{color:var(--text-primary)!important;margin:0}.enhancement-panel{background:var(--accent-cyan-01);border:1px solid var(--accent-cyan-03);border-radius:8px;margin-top:2rem;padding:1.5rem}.enhancement-panel h3{color:var(--accent-primary)!important;font-family:var(--font-display);margin-bottom:1rem}.enhancement-grid{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}.enhancement-item{background:rgba(0,0,0,.3);border-radius:6px;padding:1rem}.enhancement-item h4{color:var(--text-primary)!important;margin-bottom:.5rem}.enhancement-item p{color:var(--text-secondary)!important;font-size:.9rem;margin-bottom:.5rem}.enhancement-item a{color:var(--accent-primary)!important;font-weight:500;text-decoration:none}.enhancement-features{background:rgba(0,0,0,.5);border-radius:6px;margin-top:1rem;padding:1rem}.enhancement-features h4{color:var(--text-primary)!important;margin-bottom:.5rem}.feature-tags{display:flex;flex-wrap:wrap;gap:.5rem}.feature-tag{background:var(--accent-cyan-02);border-radius:3px;color:var(--text-primary)!important;font-size:.8rem;padding:.25rem .5rem}.enhancement-control{margin-top:1rem;text-align:center}.enhancement-toggle{background:hsla(0,0%,100%,.1);border:1px solid hsla(0,0%,100%,.2);border-radius:4px;color:var(--text-secondary)!important;cursor:pointer;font-size:.8rem;padding:.5rem 1rem}.test-mobile-btn{background:var(--accent-primary);border:none;border-radius:4px;color:#fff;cursor:pointer;font-weight:500;padding:.25rem .75rem}.axis-ai-showcase{background:linear-gradient(135deg,rgba(6,182,212,.05),rgba(0,0,0,.95) 50%,rgba(6,182,212,.05));overflow:hidden;padding:6rem 0;position:relative}.axis-ai-showcase:before{animation:aiPulse 8s ease-in-out infinite alternate;background:radial-gradient(circle at 20% 50%,var(--accent-cyan-01) 0,transparent 40%),radial-gradient(circle at 80% 50%,var(--accent-cyan-01) 0,transparent 40%);bottom:0;content:"";left:0;position:absolute;right:0;top:0}@keyframes aiPulse{0%{opacity:.3;transform:scale(1)}to{opacity:.6;transform:scale(1.1)}}.ai-showcase-content{margin:0 auto;max-width:1200px;position:relative;text-align:center;z-index:1}.ai-badge-large{animation:glow 2s ease-in-out infinite alternate;background:linear-gradient(135deg,#8b1538,#a21621);border-radius:30px;display:inline-block;font-size:.875rem;font-weight:600;letter-spacing:2px;margin-bottom:2rem;padding:.75rem 2rem}@keyframes glow{0%{box-shadow:0 0 20px var(--accent-cyan-05)}to{box-shadow:0 0 30px var(--accent-cyan-08)}}.ai-showcase-title{font-family:var(--font-display);font-size:clamp(2.5rem,5vw,3.5rem);font-weight:800;line-height:1.2;margin-bottom:1.5rem}.ai-showcase-title .gradient-text{background:linear-gradient(135deg,#fff,#8b1538);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}.ai-showcase-description{color:var(--text-secondary);font-size:1.25rem;line-height:1.6;margin:0 auto 3rem;max-width:800px}.ai-features-grid{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-bottom:3rem}.ai-feature{background:rgba(26,26,26,.6);border:1px solid hsla(0,0%,100%,.1);border-radius:12px;padding:2rem;transition:all .3s ease}.ai-feature:hover{background:rgba(26,26,26,.8);border-color:var(--accent-cyan);box-shadow:0 10px 30px rgba(0,0,0,.3);transform:translateY(-5px)}.ai-feature-icon{background:linear-gradient(135deg,#8b1538,#a21621);border-radius:12px;height:60px;margin:0 auto 1rem;position:relative;width:60px}.ai-feature-icon:after{background:#fff;content:"";height:30px;left:50%;-webkit-mask-position:center;mask-position:center;-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:contain;mask-size:contain;position:absolute;top:50%;transform:translate(-50%,-50%);width:30px}.icon-ai-brain:after{-webkit-mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_1___});mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_1___})}.icon-ai-analytics:after{-webkit-mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_2___});mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_2___})}.icon-ai-automation:after{-webkit-mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_3___});mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_3___})}.icon-ai-security:after{-webkit-mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_4___});mask-image:url(${___CSS_LOADER_URL_REPLACEMENT_4___})}.ai-feature h3{color:var(--text-primary);font-family:var(--font-display);font-size:1.25rem;margin-bottom:.5rem}.ai-feature p{color:var(--text-secondary);font-size:.95rem;line-height:1.5}.ai-showcase-cta{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center}.cta-button{border-radius:8px;display:inline-block;font-weight:600;padding:1rem 2rem;text-decoration:none;transition:all .3s ease}.cta-button.primary{background:var(--accent-primary);border:2px solid var(--accent-cyan);box-shadow:0 0 20px var(--accent-cyan-03);color:var(--accent-cyan)}.cta-button.primary:hover{background:var(--accent-secondary);border-color:var(--accent-electric);box-shadow:0 0 40px var(--accent-cyan-08),0 0 60px rgba(0,217,255,.6);color:var(--accent-electric);text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px)}.cta-button.secondary{background:rgba(63,114,175,.2);border:2px solid var(--accent-cyan);box-shadow:0 0 15px var(--accent-cyan-02);color:var(--accent-cyan)}.cta-button.secondary:hover{background:var(--accent-primary);border-color:var(--accent-electric);box-shadow:0 0 30px var(--accent-cyan-08),0 0 50px rgba(0,217,255,.5);color:var(--accent-electric);text-shadow:0 0 8px rgba(0,217,255,.8);transform:translateY(-2px)}@media (max-width:768px){.axis-ai-showcase{padding:4rem 0}.ai-features-grid{gap:1.5rem;grid-template-columns:1fr}}.mobile-menu-toggle{align-self:center;background:none;border:none;color:var(--text-primary);cursor:pointer;display:none;margin-left:auto;padding:.5rem}@media (max-width:768px){.nav-container{gap:1rem}.nav-menu{display:none}.nav-menu.active{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:rgba(0,0,0,.95);border-bottom:1px solid var(--accent-cyan-03);box-shadow:0 8px 32px rgba(0,0,0,.8);display:flex;flex-direction:column;gap:1.5rem;left:0;padding:2rem;position:fixed;right:0;top:70px;z-index:999}.mobile-menu-toggle{align-items:center;display:flex;height:40px;justify-content:center;width:40px}}.skip-link{background:var(--accent-primary);border-radius:0 0 .5rem 0;color:#fff;left:0;padding:.5rem 1rem;position:absolute;text-decoration:none;top:-40px;z-index:100}.skip-link:focus{top:0}a.logo{color:inherit;text-decoration:none}body{padding-top:80px}#main-content{scroll-margin-top:80px}.hero{min-height:calc(100vh - 80px)}section{padding:5rem 0}.client-services-grid,.services-grid{gap:2rem;margin-top:3rem}.footer{margin-top:5rem;padding:3rem 0}.form-group input,.form-group select,.form-group textarea{background:hsla(0,0%,100%,.1);border:1px solid hsla(0,0%,100%,.2);color:#fff}.form-group input:focus,.form-group select:focus,.form-group textarea:focus{background:hsla(0,0%,100%,.15);border-color:#8b1538;outline:none}.service-details li{color:#ccc \\!important}.about-description{color:#d0d0d0 \\!important}.client-service-card,.service-card{transition:all .3s ease}.client-service-card:hover,.service-card:hover{box-shadow:0 12px 24px var(--accent-cyan-04);transform:translateY(-4px)}html{scroll-behavior:smooth}:focus-visible{outline:2px solid var(--accent-primary);outline-offset:2px}input,option,select,textarea{background-color:hsla(0,0%,100%,.1) \\!important;color:var(--text-primary) \\!important}select option{background-color:var(--secondary-dark) \\!important;color:var(--text-primary) \\!important}::-moz-placeholder{color:var(--text-muted) \\!important;opacity:1 \\!important}::placeholder{color:var(--text-muted) \\!important;opacity:1 \\!important}input:focus,select:focus,textarea:focus{background-color:hsla(0,0%,100%,.15) \\!important;border-color:var(--accent-primary) \\!important;color:var(--text-primary) \\!important}.gradient-text{background:linear-gradient(135deg,var(--text-primary) 0,var(--accent-cyan) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;display:inline-block}.metric-value{color:var(--accent-primary) \\!important;font-weight:700}a,h1,h2,h3,h4,h5,h6,label,li,p,span,td,th{color:inherit}.contact-form label{color:var(--text-secondary) \\!important}.cta-button,.cta-button:hover,.service-button,.service-button:hover{color:var(--text-primary) \\!important}.nav-link{color:var(--text-secondary) \\!important}.nav-link.active,.nav-link:hover,table,td,th,tr{color:var(--text-primary) \\!important}.client-service-card *,.service-card *,button{color:inherit}.cta-button.primary,.submit-button{background:var(--accent-primary) \\!important;color:var(--text-primary) \\!important}.cta-button.secondary{background:transparent \\!important;border:2px solid \\!important;color:var(--accent-primary) \\!important}.invoice-content *,.portal-content *{color:inherit}`, '']);
      // Exports
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


      /***/ }),

    /***/ 905:
    /***/ ((module) => {

      module.exports = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27currentColor%27 d=%27M12 2C9.62 2 7.5 3.12 6.03 4.82 3.57 4.82 2 6.39 2 8.5c0 1.43.81 2.56 2 3.08v4.92C4 18.43 5.57 20 7.5 20c.76 0 1.45-.29 1.96-.76.74.47 1.61.76 2.54.76s1.8-.29 2.54-.76c.51.47 1.2.76 1.96.76 1.93 0 3.5-1.57 3.5-3.5v-4.92c1.19-.52 2-1.65 2-3.08 0-2.11-1.57-3.68-4.03-3.68C16.5 3.12 14.38 2 12 2%27/%3E%3C/svg%3E';

      /***/ }),

    /***/ 991:
    /***/ ((module) => {

      module.exports = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 24 24%27%3E%3Cpath fill=%27currentColor%27 d=%27M3 3v18h18V3zm16 16H5V5h14zM7 17h2V7H7zm4 0h2v-7h-2zm4 0h2v-4h-2z%27/%3E%3C/svg%3E';

      /***/ })

    /******/ 	});
  /************************************************************************/
  /******/ 	// The module cache
  /******/ 	var __webpack_module_cache__ = {};
  /******/ 	
  /******/ 	// The require function
  /******/ 	function __webpack_require__(moduleId) {
    /******/ 		// Check if module is in cache
    /******/ 		var cachedModule = __webpack_module_cache__[moduleId];
    /******/ 		if (cachedModule !== undefined) {
      /******/ 			return cachedModule.exports;
      /******/ 		}
    /******/ 		// Create a new module (and put it into the cache)
    /******/ 		var module = __webpack_module_cache__[moduleId] = {
      /******/ 			id: moduleId,
      /******/ 			// no module.loaded needed
      /******/ 			exports: {}
      /******/ 		};
    /******/ 	
    /******/ 		// Execute the module function
    /******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
    /******/ 	
    /******/ 		// Return the exports of the module
    /******/ 		return module.exports;
    /******/ 	}
  /******/ 	
  /******/ 	// expose the modules object (__webpack_modules__)
  /******/ 	__webpack_require__.m = __webpack_modules__;
  /******/ 	
  /************************************************************************/
  /******/ 	/* webpack/runtime/chunk loaded */
  /******/ 	(() => {
    /******/ 		var deferred = [];
    /******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
      /******/ 			if(chunkIds) {
        /******/ 				priority = priority || 0;
        /******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) {deferred[i] = deferred[i - 1];}
        /******/ 				deferred[i] = [chunkIds, fn, priority];
        /******/ 				return;
        /******/ 			}
      /******/ 			var notFulfilled = Infinity;
      /******/ 			for (var i = 0; i < deferred.length; i++) {
        /******/ 				var [chunkIds, fn, priority] = deferred[i];
        /******/ 				var fulfilled = true;
        /******/ 				for (var j = 0; j < chunkIds.length; j++) {
          /******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
            /******/ 						chunkIds.splice(j--, 1);
            /******/ 					} else {
            /******/ 						fulfilled = false;
            /******/ 						if(priority < notFulfilled) {notFulfilled = priority;}
            /******/ 					}
          /******/ 				}
        /******/ 				if(fulfilled) {
          /******/ 					deferred.splice(i--, 1);
          /******/ 					var r = fn();
          /******/ 					if (r !== undefined) {result = r;}
          /******/ 				}
        /******/ 			}
      /******/ 			return result;
      /******/ 		};
    /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/compat get default export */
  /******/ 	(() => {
    /******/ 		// getDefaultExport function for compatibility with non-harmony modules
    /******/ 		__webpack_require__.n = (module) => {
      /******/ 			var getter = module && module.__esModule ?
      /******/ 				() => (module.default) :
      /******/ 				() => (module);
      /******/ 			__webpack_require__.d(getter, { a: getter });
      /******/ 			return getter;
      /******/ 		};
    /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/define property getters */
  /******/ 	(() => {
    /******/ 		// define getter functions for harmony exports
    /******/ 		__webpack_require__.d = (exports, definition) => {
      /******/ 			for(var key in definition) {
        /******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
          /******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
          /******/ 				}
        /******/ 			}
      /******/ 		};
    /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/hasOwnProperty shorthand */
  /******/ 	(() => {
    /******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop));
    /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/jsonp chunk loading */
  /******/ 	(() => {
    /******/ 		__webpack_require__.b = document.baseURI || self.location.href;
    /******/ 		
    /******/ 		// object to store loaded and loading chunks
    /******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
    /******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
    /******/ 		var installedChunks = {
      /******/ 			792: 0
      /******/ 		};
    /******/ 		
    /******/ 		// no chunk on demand loading
    /******/ 		
    /******/ 		// no prefetching
    /******/ 		
    /******/ 		// no preloaded
    /******/ 		
    /******/ 		// no HMR
    /******/ 		
    /******/ 		// no HMR manifest
    /******/ 		
    /******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
    /******/ 		
    /******/ 		// install a JSONP callback for chunk loading
    /******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
      /******/ 			var [chunkIds, moreModules, runtime] = data;
      /******/ 			// add "moreModules" to the modules object,
      /******/ 			// then flag all "chunkIds" as loaded and fire callback
      /******/ 			var moduleId, chunkId, i = 0;
      /******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
        /******/ 				for(moduleId in moreModules) {
          /******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
            /******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
            /******/ 					}
          /******/ 				}
        /******/ 				if(runtime) {var result = runtime(__webpack_require__);}
        /******/ 			}
      /******/ 			if(parentChunkLoadingFunction) {parentChunkLoadingFunction(data);}
      /******/ 			for(;i < chunkIds.length; i++) {
        /******/ 				chunkId = chunkIds[i];
        /******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
          /******/ 					installedChunks[chunkId][0]();
          /******/ 				}
        /******/ 				installedChunks[chunkId] = 0;
        /******/ 			}
      /******/ 			return __webpack_require__.O(result);
      /******/ 		};
    /******/ 		
    /******/ 		var chunkLoadingGlobal = self.webpackChunkaxis_thorn_llc_website = self.webpackChunkaxis_thorn_llc_website || [];
    /******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
    /******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
    /******/ 	})();
  /******/ 	
  /******/ 	/* webpack/runtime/nonce */
  /******/ 	(() => {
    /******/ 		__webpack_require__.nc = undefined;
    /******/ 	})();
  /******/ 	
  /************************************************************************/
  /******/ 	
  /******/ 	// startup
  /******/ 	// Load entry module and return exports
  /******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
  /******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [239], () => (__webpack_require__(510)));
  /******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;