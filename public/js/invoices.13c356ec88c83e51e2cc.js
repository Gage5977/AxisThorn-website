/******/ (() => { // webpackBootstrap
/******/ 	
  /******/ 	var __webpack_modules__ = ({

    /***/ 830:
    /***/ ((__unused_webpack_module, __unused_webpack___webpack_exports__, __webpack_require__) => {


      // UNUSED EXPORTS: initializeInvoicePortal

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
      // EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/css/invoices.css
      var invoices = __webpack_require__(866);
      // ./src/css/invoices.css

      
      
      
      
      
      
      
      
      

      var options = {};

      options.styleTagTransform = (styleTagTransform_default());
      options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, 'head');
    
      options.domAPI = (styleDomAPI_default());
      options.insertStyleElement = (insertStyleElement_default());

      var update = injectStylesIntoStyleTag_default()(invoices/* default */.A, options);




      /* harmony default export */ const css_invoices = (invoices/* default */.A && invoices/* default */.A.locals ? invoices/* default */.A.locals : undefined);

      // EXTERNAL MODULE: ./src/js/navigation.js
      var navigation = __webpack_require__(749);
      // EXTERNAL MODULE: ./src/js/form.js
      var js_form = __webpack_require__(777);
      // EXTERNAL MODULE: ./src/js/notification.js
      var notification = __webpack_require__(236);
      // EXTERNAL MODULE: ./src/js/performance.js
      var performance = __webpack_require__(785);
      // ./src/js/invoices.js
      // Invoice Portal Entry Point


      // Import shared modules that invoice portal needs





      // Make showNotification globally available for inline event handlers
      window.showNotification = notification/* showNotification */.Ds;

      // Invoice-specific functionality
      function initializeInvoicePortal() {
        // Initialize shared modules
        navigation/* default */.A.init();
        js_form/* default */.A.init();

        // Optimize scroll performance
        performance/* default */.A.optimizeScrollPerformance();
        console.log('Invoice portal initialized');
      }

      // Auto-initialize when DOM is loaded
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeInvoicePortal);
      } else {
        // DOM is already loaded
        initializeInvoicePortal();
      }

      /***/ }),

    /***/ 866:
    /***/ ((module, __webpack_exports__, __webpack_require__) => {

      /* harmony export */ __webpack_require__.d(__webpack_exports__, {
        /* harmony export */ A: () => (__WEBPACK_DEFAULT_EXPORT__)
        /* harmony export */ });
      /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
      /* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
      // Imports


      var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
      // Module
      ___CSS_LOADER_EXPORT___.push([module.id, '*{box-sizing:border-box;margin:0;padding:0}:root{--primary-dark:#0a0f1c;--secondary-dark:#0d1420;--accent-dark:#111825;--text-primary:#e6f8ff;--text-secondary:#a0aec0;--text-muted:#64748b;--accent-primary:#3f72af;--accent-secondary:#2563eb;--accent-tertiary:#1e40af;--accent-cyan:#06b6d4;--accent-electric:#00d9ff;--gradient-dark:linear-gradient(135deg,#0a0f1c,#0d1420,#0a0f1c);--shadow-harsh:0 8px 32px var(--accent-cyan-03);--shadow-subtle:0 2px 8px var(--accent-primary-02);--shadow-glow:0 0 20px rgba(0,217,255,.5);--transition-smooth:all 0.3s cubic-bezier(0.4,0,0.2,1);--font-primary:"Inter","Space Grotesk",sans-serif;--font-display:"Satoshi","Inter",serif;--card-bg:rgba(13,20,32,.9);--card-border:var(--accent-cyan-02);--input-bg:rgba(10,15,28,.5);--input-border:var(--accent-cyan-03);--button-primary:var(--accent-primary);--button-secondary:var(--accent-cyan-01);--success-color:#10b981;--warning-color:#f59e0b;--error-color:#ef4444;--accent-cyan-rgb:6,182,212;--accent-cyan-01:rgba(var(--accent-cyan-rgb),0.1);--accent-cyan-02:rgba(var(--accent-cyan-rgb),0.2);--accent-cyan-03:rgba(var(--accent-cyan-rgb),0.3);--accent-cyan-04:rgba(var(--accent-cyan-rgb),0.4);--accent-cyan-05:rgba(var(--accent-cyan-rgb),0.5);--accent-cyan-08:rgba(var(--accent-cyan-rgb),0.8);--accent-primary-rgb:63,114,175;--accent-primary-01:rgba(var(--accent-primary-rgb),0.1);--accent-primary-02:rgba(var(--accent-primary-rgb),0.2);--accent-primary-03:rgba(var(--accent-primary-rgb),0.3);--accent-primary-05:rgba(var(--accent-primary-rgb),0.5)}body{background:var(--gradient-dark);color:var(--text-primary);font-family:var(--font-primary);line-height:1.6;min-height:100vh}*{color:var(--text-primary)!important}.container{margin:0 auto;max-width:1400px;min-height:100vh;padding:0 20px}header h1{background:linear-gradient(135deg,var(--text-primary),var(--accent-cyan));-webkit-background-clip:text;font-family:var(--font-display);font-size:2.5rem;font-weight:700;margin-bottom:1rem;text-align:center;-webkit-text-fill-color:transparent;background-clip:text}nav{display:flex;flex-wrap:wrap;gap:2rem;justify-content:center}.nav-btn{-webkit-backdrop-filter:blur(10px);backdrop-filter:blur(10px);background:var(--button-secondary);border:1px solid var(--card-border);border-radius:8px;color:var(--text-secondary)!important;cursor:pointer;font-family:var(--font-primary);font-weight:500;letter-spacing:.5px;padding:.75rem 1.5rem;text-transform:uppercase;transition:var(--transition-smooth)}.nav-btn:hover{box-shadow:var(--shadow-subtle);transform:translateY(-2px)}.nav-btn.active,.nav-btn:hover{background:var(--accent-primary);color:var(--text-primary)!important}.nav-btn.active{border-color:var(--accent-primary)}main{padding:2rem 0;position:relative;z-index:1}.view{animation:fadeIn .5s ease-in-out;display:none}.view.active{display:block}@keyframes fadeIn{0%{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}.stats{display:grid;gap:1.5rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));margin-bottom:3rem}.stat-card{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;padding:2rem;text-align:center;transition:var(--transition-smooth)}.stat-card:hover{border-color:var(--accent-primary);box-shadow:var(--shadow-harsh);transform:translateY(-5px)}.stat-card h3{color:var(--text-secondary)!important;font-size:1.1rem;margin-bottom:.5rem}.stat-card h3,.stat-value{font-family:var(--font-display)}.stat-value{color:var(--accent-primary)!important;font-size:2.5rem}.form-section,.invoice-list{-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);background:var(--card-bg);border:1px solid var(--card-border);border-radius:12px;margin-bottom:2rem;padding:2rem}.form-section h3{border-bottom:2px solid var(--accent-primary);color:var(--text-primary)!important;font-family:var(--font-display);font-size:1.5rem;padding-bottom:.5rem}.form-group,.form-section h3{margin-bottom:1.5rem}.form-group label{color:var(--text-secondary)!important;display:block;font-weight:500;margin-bottom:.5rem}.form-group input,.form-group select,.form-group textarea{background:var(--input-bg);border:1px solid var(--input-border);border-radius:8px;color:var(--text-primary)!important;font-family:var(--font-primary);padding:.75rem;transition:var(--transition-smooth);width:100%}.form-group input:focus,.form-group select:focus,.form-group textarea:focus{border-color:var(--accent-primary);box-shadow:0 0 0 3px rgba(139,21,56,.3);outline:none}.form-group input::-moz-placeholder,.form-group textarea::-moz-placeholder{color:var(--text-muted)!important}.form-group input::placeholder,.form-group textarea::placeholder{color:var(--text-muted)!important}.btn-primary,.btn-secondary{border:2px solid var(--accent-cyan);border-radius:8px;cursor:pointer;font-family:var(--font-primary);font-weight:500;letter-spacing:.5px;margin:.5rem;overflow:hidden;padding:.75rem 1.5rem;position:relative;text-transform:uppercase;transition:var(--transition-smooth)}.btn-primary{background:var(--accent-primary);box-shadow:0 0 20px rgba(6,182,212,.3);color:var(--accent-cyan)!important}.btn-primary:hover{background:var(--accent-secondary);border-color:var(--accent-electric);box-shadow:0 0 40px rgba(6,182,212,.8),0 0 60px rgba(0,217,255,.6);color:var(--accent-electric)!important;text-shadow:0 0 10px rgba(0,217,255,.8);transform:translateY(-2px)}.btn-secondary{background:rgba(63,114,175,.2);border:2px solid var(--accent-cyan);box-shadow:0 0 15px rgba(6,182,212,.2);color:var(--accent-cyan)!important}.btn-secondary:hover{background:var(--accent-primary);border-color:var(--accent-electric);box-shadow:0 0 30px rgba(6,182,212,.8),0 0 50px rgba(0,217,255,.5);color:var(--accent-electric)!important;text-shadow:0 0 8px rgba(0,217,255,.8);transform:translateY(-2px)}@keyframes neuralPulse{0%{opacity:.3}to{opacity:.7}}.features{margin:2rem 0}.features ul{list-style:none;padding:0}.features li{font-size:1.1rem;padding:.5rem 0}table{background:var(--card-bg);border:1px solid var(--card-border);border-collapse:collapse;border-radius:12px;margin-top:1rem;overflow:hidden;width:100%}thead{background:rgba(0,0,0,.5)}td,th{border-bottom:1px solid var(--card-border);color:var(--text-primary)!important;padding:1rem;text-align:left}th{color:var(--text-secondary)!important;font-family:var(--font-display);font-weight:600}tbody tr:hover{background:rgba(139,21,56,.1)}.loading{color:var(--text-muted)!important;padding:2rem;text-align:center}.error{background:rgba(239,68,68,.1);border:1px solid var(--error-color);border-radius:8px;color:var(--error-color)!important}.error,.success{margin:1rem 0;padding:1rem}.success{background:rgba(16,185,129,.1);border:1px solid var(--success-color);border-radius:8px;color:var(--success-color)!important}.form-row{display:grid;gap:1rem;grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}@media (max-width:768px){.container{padding:0 10px}header h1{font-size:2rem}nav{gap:1rem}.nav-btn{font-size:.9rem;padding:.5rem 1rem}.stats{grid-template-columns:repeat(auto-fit,minmax(200px,1fr))}}.portal-header{margin-bottom:2rem;margin-top:2rem;position:relative;text-align:center;z-index:10}.portal-header h1{background:linear-gradient(135deg,var(--text-primary),var(--accent-cyan));-webkit-background-clip:text;font-family:var(--font-display);font-size:2.5rem;margin-bottom:1.5rem;-webkit-text-fill-color:transparent;background-clip:text}.portal-nav{display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-bottom:2rem}#create,#customers,#dashboard,#products{min-height:calc(100vh - 300px)}.invoice-table td,.invoice-table th{color:var(--text-primary) \\!important}.stat-card{background:var(--secondary-dark);border:1px solid rgba(139,21,56,.2)}.stat-value{color:var(--accent-primary) \\!important;font-size:2rem;font-weight:700}', '']);
      // Exports
      /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


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
    /******/ 		// no baseURI
    /******/ 		
    /******/ 		// object to store loaded and loading chunks
    /******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
    /******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
    /******/ 		var installedChunks = {
      /******/ 			667: 0
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
  /******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, [239], () => (__webpack_require__(830)));
  /******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;