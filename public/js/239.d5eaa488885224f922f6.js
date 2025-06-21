
(self.webpackChunkaxis_thorn_llc_website = self.webpackChunkaxis_thorn_llc_website || []).push([[239],{

  /***/ 56:
  /***/ ((module, __unused_webpack_exports, __webpack_require__) => {



    /* istanbul ignore next  */
    function setAttributesWithoutAttributes(styleElement) {
      var nonce = true ? __webpack_require__.nc : 0;
      if (nonce) {
        styleElement.setAttribute('nonce', nonce);
      }
    }
    module.exports = setAttributesWithoutAttributes;

    /***/ }),

  /***/ 72:
  /***/ ((module) => {



    var stylesInDOM = [];
    function getIndexByIdentifier(identifier) {
      var result = -1;
      for (var i = 0; i < stylesInDOM.length; i++) {
        if (stylesInDOM[i].identifier === identifier) {
          result = i;
          break;
        }
      }
      return result;
    }
    function modulesToDom(list, options) {
      var idCountMap = {};
      var identifiers = [];
      for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var id = options.base ? item[0] + options.base : item[0];
        var count = idCountMap[id] || 0;
        var identifier = ''.concat(id, ' ').concat(count);
        idCountMap[id] = count + 1;
        var indexByIdentifier = getIndexByIdentifier(identifier);
        var obj = {
          css: item[1],
          media: item[2],
          sourceMap: item[3],
          supports: item[4],
          layer: item[5]
        };
        if (indexByIdentifier !== -1) {
          stylesInDOM[indexByIdentifier].references++;
          stylesInDOM[indexByIdentifier].updater(obj);
        } else {
          var updater = addElementStyle(obj, options);
          options.byIndex = i;
          stylesInDOM.splice(i, 0, {
            identifier: identifier,
            updater: updater,
            references: 1
          });
        }
        identifiers.push(identifier);
      }
      return identifiers;
    }
    function addElementStyle(obj, options) {
      var api = options.domAPI(options);
      api.update(obj);
      var updater = function updater(newObj) {
        if (newObj) {
          if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
            return;
          }
          api.update(obj = newObj);
        } else {
          api.remove();
        }
      };
      return updater;
    }
    module.exports = function (list, options) {
      options = options || {};
      list = list || [];
      var lastIdentifiers = modulesToDom(list, options);
      return function update(newList) {
        newList = newList || [];
        for (var i = 0; i < lastIdentifiers.length; i++) {
          var identifier = lastIdentifiers[i];
          var index = getIndexByIdentifier(identifier);
          stylesInDOM[index].references--;
        }
        var newLastIdentifiers = modulesToDom(newList, options);
        for (var _i = 0; _i < lastIdentifiers.length; _i++) {
          var _identifier = lastIdentifiers[_i];
          var _index = getIndexByIdentifier(_identifier);
          if (stylesInDOM[_index].references === 0) {
            stylesInDOM[_index].updater();
            stylesInDOM.splice(_index, 1);
          }
        }
        lastIdentifiers = newLastIdentifiers;
      };
    };

    /***/ }),

  /***/ 113:
  /***/ ((module) => {



    /* istanbul ignore next  */
    function styleTagTransform(css, styleElement) {
      if (styleElement.styleSheet) {
        styleElement.styleSheet.cssText = css;
      } else {
        while (styleElement.firstChild) {
          styleElement.removeChild(styleElement.firstChild);
        }
        styleElement.appendChild(document.createTextNode(css));
      }
    }
    module.exports = styleTagTransform;

    /***/ }),

  /***/ 236:
  /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ Ds: () => (/* binding */ showNotification)
      /* harmony export */ });
    /* unused harmony export NotificationModule */
    // Notification Module
    var NotificationModule = {
      show: function show(message) {
        var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
        // Remove existing notifications
        var existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(function (notif) {
          return notif.remove();
        });

        // Create notification element
        var notification = document.createElement('div');
        notification.className = 'notification notification-'.concat(type);
        notification.textContent = message;

        // Add styles
        notification.style.cssText = '\n            position: fixed;\n            top: 100px;\n            right: 20px;\n            background: '.concat(type === 'success' ? '#2d5016' : type === 'error' ? '#5d1a1a' : '#1a1a1a', ';\n            color: #e8e8e8;\n            padding: 1rem 2rem;\n            border-left: 4px solid ').concat(type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#d4af37', ';\n            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);\n            z-index: 10000;\n            opacity: 0;\n            transform: translateX(100%);\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            max-width: 400px;\n            font-family: \'Inter\', sans-serif;\n            font-size: 14px;\n            border-radius: 2px;\n        ');
        document.body.appendChild(notification);

        // Animate in
        requestAnimationFrame(function () {
          notification.style.opacity = '1';
          notification.style.transform = 'translateX(0)';
        });

        // Remove after delay
        setTimeout(function () {
          notification.style.opacity = '0';
          notification.style.transform = 'translateX(100%)';
          setTimeout(function () {
            return notification.remove();
          }, 300);
        }, 5000);
      }
    };

    // Export convenience function
    function showNotification(message) {
      var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'info';
      NotificationModule.show(message, type);
    }
    /* unused harmony default export */ var __WEBPACK_DEFAULT_EXPORT__ = ((/* unused pure expression or super */ null && (NotificationModule)));

    /***/ }),

  /***/ 314:
  /***/ ((module) => {



    /*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
    module.exports = function (cssWithMappingToString) {
      var list = [];

      // return the list of modules as css string
      list.toString = function toString() {
        return this.map(function (item) {
          var content = '';
          var needLayer = typeof item[5] !== 'undefined';
          if (item[4]) {
            content += '@supports ('.concat(item[4], ') {');
          }
          if (item[2]) {
            content += '@media '.concat(item[2], ' {');
          }
          if (needLayer) {
            content += '@layer'.concat(item[5].length > 0 ? ' '.concat(item[5]) : '', ' {');
          }
          content += cssWithMappingToString(item);
          if (needLayer) {
            content += '}';
          }
          if (item[2]) {
            content += '}';
          }
          if (item[4]) {
            content += '}';
          }
          return content;
        }).join('');
      };

      // import a list of modules into the list
      list.i = function i(modules, media, dedupe, supports, layer) {
        if (typeof modules === 'string') {
          modules = [[null, modules, undefined]];
        }
        var alreadyImportedModules = {};
        if (dedupe) {
          for (var k = 0; k < this.length; k++) {
            var id = this[k][0];
            if (id != null) {
              alreadyImportedModules[id] = true;
            }
          }
        }
        for (var _k = 0; _k < modules.length; _k++) {
          var item = [].concat(modules[_k]);
          if (dedupe && alreadyImportedModules[item[0]]) {
            continue;
          }
          if (typeof layer !== 'undefined') {
            if (typeof item[5] === 'undefined') {
              item[5] = layer;
            } else {
              item[1] = '@layer'.concat(item[5].length > 0 ? ' '.concat(item[5]) : '', ' {').concat(item[1], '}');
              item[5] = layer;
            }
          }
          if (media) {
            if (!item[2]) {
              item[2] = media;
            } else {
              item[1] = '@media '.concat(item[2], ' {').concat(item[1], '}');
              item[2] = media;
            }
          }
          if (supports) {
            if (!item[4]) {
              item[4] = ''.concat(supports);
            } else {
              item[1] = '@supports ('.concat(item[4], ') {').concat(item[1], '}');
              item[4] = supports;
            }
          }
          list.push(item);
        }
      };
      return list;
    };

    /***/ }),

  /***/ 540:
  /***/ ((module) => {



    /* istanbul ignore next  */
    function insertStyleElement(options) {
      var element = document.createElement('style');
      options.setAttributes(element, options.attributes);
      options.insert(element, options.options);
      return element;
    }
    module.exports = insertStyleElement;

    /***/ }),

  /***/ 601:
  /***/ ((module) => {



    module.exports = function (i) {
      return i[1];
    };

    /***/ }),

  /***/ 659:
  /***/ ((module) => {



    var memo = {};

    /* istanbul ignore next  */
    function getTarget(target) {
      if (typeof memo[target] === 'undefined') {
        var styleTarget = document.querySelector(target);

        // Special case to return head of iframe instead of iframe itself
        if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
          try {
            // This will throw an exception if access to iframe is blocked
            // due to cross-origin restrictions
            styleTarget = styleTarget.contentDocument.head;
          } catch (e) {
            // istanbul ignore next
            styleTarget = null;
          }
        }
        memo[target] = styleTarget;
      }
      return memo[target];
    }

    /* istanbul ignore next  */
    function insertBySelector(insert, style) {
      var target = getTarget(insert);
      if (!target) {
        throw new Error('Couldn\'t find a style target. This probably means that the value for the \'insert\' parameter is invalid.');
      }
      target.appendChild(style);
    }
    module.exports = insertBySelector;

    /***/ }),

  /***/ 749:
  /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ A: () => (__WEBPACK_DEFAULT_EXPORT__)
      /* harmony export */ });
    /* unused harmony export Navigation */
    // Navigation Module
    var Navigation = {
      init: function init() {
        this.initSmoothScrolling();
        this.initScrollEffects();
        this.handleExternalLinks();
      },
      initSmoothScrolling: function initSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
          anchor.addEventListener('click', function (e) {
            e.preventDefault();
            var target = document.querySelector(this.getAttribute('href'));
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          });
        });
      },
      initScrollEffects: function initScrollEffects() {
        var navigation = document.querySelector('.navigation');
        window.addEventListener('scroll', function () {
          var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          if (scrollTop > 50) {
            navigation.style.background = 'rgba(10, 10, 10, 0.98)';
            navigation.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
          } else {
            navigation.style.background = 'rgba(10, 10, 10, 0.95)';
            navigation.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
          }
        });
      },
      handleExternalLinks: function handleExternalLinks() {
        // Add confirmation for external links
        document.addEventListener('click', function (e) {
          var link = e.target.closest('a');
          if (!link) {return;}
          var href = link.getAttribute('href');
          if (!href) {return;}

          // Check if it's an external link
          var isExternal = href.startsWith('http') && !href.includes(window.location.hostname);
          var isMailto = href.startsWith('mailto:');
          if (isExternal && !isMailto) {
            e.preventDefault();
            if (confirm('You are leaving Axis Thorn LLC website. Continue to external site?')) {
              window.open(href, '_blank', 'noopener,noreferrer');
            }
          }
        });
      }
    };
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Navigation);

    /***/ }),

  /***/ 777:
  /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ A: () => (__WEBPACK_DEFAULT_EXPORT__)
      /* harmony export */ });
    /* unused harmony export FormModule */
    /* harmony import */ var _notification_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(236);
    // Form Module

    var FormModule = {
      init: function init() {
        this.initContactForm();
        this.initTaxForm();
        this.enhanceFormValidation();
      },
      initContactForm: function initContactForm() {
        var contactForm = document.querySelector('.contact-form');
        if (!contactForm) {return;}
        contactForm.addEventListener('submit', function (e) {
          var _this = this;
          e.preventDefault();

          // Get form data
          var formData = new FormData(this);
          var data = Object.fromEntries(formData.entries());

          // Track form submission attempt
          if (typeof trackEvent === 'function') {
            trackEvent('form_submission_attempt', 'engagement', 'contact_form');
          }

          // Basic validation
          if (!data.name || !data.email || !data.service || !data.message) {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Please fill in all required fields.', 'error');
            if (typeof trackEvent === 'function') {
              trackEvent('form_validation_error', 'engagement', 'missing_fields');
            }
            return;
          }

          // Email validation
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(data.email)) {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Please enter a valid email address.', 'error');
            if (typeof trackEvent === 'function') {
              trackEvent('form_validation_error', 'engagement', 'invalid_email');
            }
            return;
          }

          // Track service interest
          if (typeof trackEvent === 'function') {
            trackEvent('service_interest', 'business', data.service);
          }

          // Simulate form submission
          var submitButton = this.querySelector('.submit-button');
          var originalText = submitButton.textContent;
          submitButton.textContent = 'Submitting...';
          submitButton.disabled = true;

          // Simulate API call
          setTimeout(function () {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Consultation request submitted successfully. We will contact you within 24 hours.', 'success');

            // Track successful submission
            if (typeof trackEvent === 'function') {
              trackEvent('form_submission_success', 'conversion', 'contact_form');
              trackEvent('lead_generated', 'business', data.service);
            }
            _this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
          }, 2000);
        });

        // Track form field interactions
        var formFields = contactForm.querySelectorAll('input, textarea, select');
        formFields.forEach(function (field) {
          field.addEventListener('focus', function () {
            if (typeof trackEvent === 'function') {
              trackEvent('form_field_focus', 'engagement', field.name || field.type);
            }
          });

          // Track time spent in form
          var focusTime = 0;
          field.addEventListener('focus', function () {
            focusTime = Date.now();
          });
          field.addEventListener('blur', function () {
            if (focusTime) {
              var timeSpent = (Date.now() - focusTime) / 1000;
              if (timeSpent > 2 && typeof trackEvent === 'function') {
                trackEvent('form_field_engagement', 'engagement', ''.concat(field.name, '_').concat(Math.round(timeSpent), 's'));
              }
            }
          });
        });
      },
      initTaxForm: function initTaxForm() {
        var tax1099AccessForm = document.getElementById('tax1099AccessForm');
        if (!tax1099AccessForm) {return;}
        tax1099AccessForm.addEventListener('submit', function (e) {
          e.preventDefault();
          var formData = new FormData(this);
          var data = Object.fromEntries(formData.entries());

          // Basic validation
          if (!data.taxId || !data.businessName || !data.accessCode) {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Please fill in all required fields.', 'error');
            return;
          }

          // Tax ID format validation
          var taxIdRegex = /^\d{3}-\d{2}-\d{4}$|^\d{2}-\d{7}$/;
          if (!taxIdRegex.test(data.taxId)) {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Please enter a valid Tax ID format (XXX-XX-XXXX or XX-XXXXXXX).', 'error');
            return;
          }
          var submitButton = this.querySelector('.admin-button');
          var originalText = submitButton.textContent;
          submitButton.textContent = 'Verifying Access...';
          submitButton.disabled = true;

          // Simulate authentication process
          setTimeout(function () {
            (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Authentication successful. Redirecting to document portal...', 'success');
            setTimeout(function () {
              (0,_notification_js__WEBPACK_IMPORTED_MODULE_0__/* .showNotification */ .Ds)('Document portal integration pending. Contact AI.info@axisthorn.com for manual access.', 'info');
              submitButton.textContent = originalText;
              submitButton.disabled = false;
            }, 2000);
          }, 3000);
        });
      },
      enhanceFormValidation: function enhanceFormValidation() {
        var _this2 = this;
        var forms = document.querySelectorAll('form');
        forms.forEach(function (form) {
          var inputs = form.querySelectorAll('input, textarea');
          inputs.forEach(function (input) {
            // Real-time validation feedback
            input.addEventListener('blur', function () {
              _this2.validateInput(input);
            });
            input.addEventListener('input', function () {
              // Clear error state on input
              input.classList.remove('error');
              var errorMsg = input.parentNode.querySelector('.error-message');
              if (errorMsg) {errorMsg.remove();}
            });
          });
        });
      },
      validateInput: function validateInput(input) {
        var value = input.value.trim();
        var isValid = true;
        var errorMessage = '';

        // Required field check
        if (input.hasAttribute('required') && !value) {
          isValid = false;
          errorMessage = 'This field is required';
        }

        // Email validation
        if (input.type === 'email' && value) {
          var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
          }
        }

        // Phone validation (if applicable)
        if (input.type === 'tel' && value) {
          var phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
          if (!phoneRegex.test(value.replace(/\s/g, ''))) {
            isValid = false;
            errorMessage = 'Please enter a valid phone number';
          }
        }

        // Update UI
        input.classList.toggle('error', !isValid);

        // Remove existing error message
        var existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {existingError.remove();}

        // Add error message if needed
        if (!isValid) {
          var errorElement = document.createElement('span');
          errorElement.className = 'error-message';
          errorElement.textContent = errorMessage;
          errorElement.style.cssText = '\n                color: #EF4444;\n                font-size: 0.8rem;\n                margin-top: 0.25rem;\n                display: block;\n            ';
          input.parentNode.appendChild(errorElement);
        }
        return isValid;
      }
    };
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (FormModule);

    /***/ }),

  /***/ 785:
  /***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

    /* harmony export */ __webpack_require__.d(__webpack_exports__, {
      /* harmony export */ A: () => (__WEBPACK_DEFAULT_EXPORT__)
      /* harmony export */ });
    /* unused harmony export PerformanceModule */
    // Performance Module
    var PerformanceModule = {
      optimizeScrollPerformance: function optimizeScrollPerformance() {
        var ticking = false;
        var updateOnScroll = function updateOnScroll() {
          var scrolled = window.pageYOffset || document.documentElement.scrollTop;
          var navigation = document.querySelector('.navigation');
          var thornPattern = document.querySelector('.thorn-pattern');

          // Throttled navigation background update
          if (scrolled > 50) {
            navigation.style.background = 'rgba(10, 10, 10, 0.98)';
            navigation.style.borderBottom = '1px solid rgba(212, 175, 55, 0.3)';
          } else {
            navigation.style.background = 'rgba(10, 10, 10, 0.95)';
            navigation.style.borderBottom = '1px solid rgba(255, 255, 255, 0.1)';
          }

          // Parallax effect (only on desktop to preserve mobile performance)
          if (window.innerWidth > 768 && thornPattern) {
            var rate = scrolled * -0.5;
            thornPattern.style.transform = 'translateY('.concat(rate, 'px) rotate(').concat(scrolled * 0.1, 'deg)');
          }
          ticking = false;
        };
        var requestScrollUpdate = function requestScrollUpdate() {
          if (!ticking) {
            requestAnimationFrame(updateOnScroll);
            ticking = true;
          }
        };

        // Replace existing scroll listener
        window.removeEventListener('scroll', function () {});
        window.addEventListener('scroll', requestScrollUpdate, {
          passive: true
        });
      }
    };
    /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (PerformanceModule);

    /***/ }),

  /***/ 825:
  /***/ ((module) => {



    /* istanbul ignore next  */
    function apply(styleElement, options, obj) {
      var css = '';
      if (obj.supports) {
        css += '@supports ('.concat(obj.supports, ') {');
      }
      if (obj.media) {
        css += '@media '.concat(obj.media, ' {');
      }
      var needLayer = typeof obj.layer !== 'undefined';
      if (needLayer) {
        css += '@layer'.concat(obj.layer.length > 0 ? ' '.concat(obj.layer) : '', ' {');
      }
      css += obj.css;
      if (needLayer) {
        css += '}';
      }
      if (obj.media) {
        css += '}';
      }
      if (obj.supports) {
        css += '}';
      }
      var sourceMap = obj.sourceMap;
      if (sourceMap && typeof btoa !== 'undefined') {
        css += '\n/*# sourceMappingURL=data:application/json;base64,'.concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), ' */');
      }

      // For old IE
      /* istanbul ignore if  */
      options.styleTagTransform(css, styleElement, options.options);
    }
    function removeStyleElement(styleElement) {
      // istanbul ignore if
      if (styleElement.parentNode === null) {
        return false;
      }
      styleElement.parentNode.removeChild(styleElement);
    }

    /* istanbul ignore next  */
    function domAPI(options) {
      if (typeof document === 'undefined') {
        return {
          update: function update() {},
          remove: function remove() {}
        };
      }
      var styleElement = options.insertStyleElement(options);
      return {
        update: function update(obj) {
          apply(styleElement, options, obj);
        },
        remove: function remove() {
          removeStyleElement(styleElement);
        }
      };
    }
    module.exports = domAPI;

    /***/ })

}]);