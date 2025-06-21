/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ 56:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;
  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
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
    var identifier = "".concat(id, " ").concat(count);
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
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
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
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ 538:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   A: () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(601);
/* harmony import */ var _node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(314);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
// Imports


var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_noSourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
// Module
___CSS_LOADER_EXPORT___.push([module.id, `:root{--ai-primary:#3f72af;--ai-secondary:#06b6d4;--ai-dark:#0a0f1c;--ai-darker:#0d1420;--ai-light:#e6f8ff;--ai-gray:#a0aec0;--ai-border:var(--accent-cyan-02);--ai-shadow:0 4px 24px var(--accent-cyan-03);--accent-cyan-rgb:6,182,212;--accent-cyan-01:rgba(var(--accent-cyan-rgb),0.1);--accent-cyan-02:rgba(var(--accent-cyan-rgb),0.2);--accent-cyan-03:rgba(var(--accent-cyan-rgb),0.3);--accent-cyan-04:rgba(var(--accent-cyan-rgb),0.4);--accent-cyan-05:rgba(var(--accent-cyan-rgb),0.5);--accent-cyan-08:rgba(var(--accent-cyan-rgb),0.8)}.axis-ai-page{background:var(--ai-dark);color:var(--ai-light);min-height:100vh;padding-top:80px}.ai-page-header{background:linear-gradient(180deg,var(--ai-darker) 0,var(--ai-dark) 100%);border-bottom:2px solid var(--ai-primary);margin-bottom:3rem;overflow:hidden;padding:6rem 0 3rem;position:relative;text-align:center}.ai-page-header:before{background:radial-gradient(circle at 50% 50%,rgba(139,21,56,.1) 0,transparent 50%);bottom:0;content:"";left:0;pointer-events:none;position:absolute;right:0;top:0}.ai-title{background:linear-gradient(135deg,var(--ai-light) 0,var(--ai-primary) 50%,var(--ai-secondary) 100%);-webkit-background-clip:text;font-family:var(--font-display);font-size:4rem;font-weight:900;letter-spacing:-.03em;margin-bottom:1rem;-webkit-text-fill-color:transparent;background-clip:text;text-transform:uppercase}.ai-tagline{color:var(--ai-light);font-size:1.5rem;font-style:italic;font-weight:300;letter-spacing:.02em;opacity:.9}.hero-content{margin:0 auto;max-width:1200px;padding:0 2rem;position:relative;text-align:center;z-index:2}.hero-title{background:linear-gradient(135deg,var(--ai-light) 0,var(--ai-primary) 100%);-webkit-background-clip:text;font-size:4rem;font-weight:800;letter-spacing:-.02em;margin-bottom:1rem;-webkit-text-fill-color:transparent;background-clip:text}.hero-subtitle{font-size:1.5rem;font-weight:300;margin-bottom:3rem;opacity:.9}.hero-stats{display:flex;gap:4rem;justify-content:center}.hero-stats .stat{text-align:center}.hero-stats .stat-value{color:var(--ai-primary);display:block;font-size:2.5rem;font-weight:700;margin-bottom:.5rem}.hero-stats .stat-label{font-size:.875rem;letter-spacing:.1em;opacity:.7;text-transform:uppercase}.hero-visual{height:100%;opacity:.1;position:absolute;right:0;top:0;width:50%}.ai-network{height:100%;position:relative;width:100%}.network-node{animation:pulse 3s ease-in-out infinite;background:var(--ai-primary);border-radius:50%;height:12px;position:absolute;width:12px}.node-1{animation-delay:0s;left:30%;top:20%}.node-2{animation-delay:.5s;right:20%;top:40%}.node-3{animation-delay:1s;bottom:30%;left:40%}.node-4{animation-delay:1.5s;bottom:20%;right:30%}.network-connection{background:linear-gradient(90deg,transparent,var(--ai-primary),transparent);height:1px;opacity:.3;position:absolute}.conn-1{left:35%;top:30%;transform:rotate(20deg);width:40%}.conn-2{left:20%;top:50%;transform:rotate(-15deg);width:60%}.conn-3{bottom:25%;left:30%;transform:rotate(10deg);width:50%}@keyframes pulse{0%,to{opacity:.3;transform:scale(1)}50%{opacity:1;transform:scale(2)}}.ai-chat-interface{background:var(--ai-dark);padding:3rem 0 4rem}.chat-container{margin:0 auto;max-width:800px;padding:0 2rem}.chat-header{border-bottom:1px solid var(--ai-border);margin-bottom:2rem;padding-bottom:2rem;text-align:center}.chat-header h2{color:var(--ai-light);font-size:1.75rem;font-weight:600;letter-spacing:normal;margin-bottom:.75rem;text-transform:none}.chat-header p{color:var(--ai-gray);font-size:1rem;opacity:.8}.chat-window{background:var(--ai-darker);border:1px solid var(--ai-border);border-radius:12px;box-shadow:var(--ai-shadow);overflow:hidden}.chat-messages{background:rgba(0,0,0,.5);height:400px;overflow-y:auto;padding:2rem}.message{margin-bottom:1.5rem}.message-content{border-radius:8px;max-width:80%;padding:1rem 1.5rem}.ai-message .message-content{background:hsla(0,0%,100%,.05);border:1px solid var(--ai-border);color:var(--ai-light)}.user-message{display:flex;justify-content:flex-end}.user-message .message-content{background:var(--ai-primary);color:var(--ai-light)}.message-content p{margin:.5rem 0}.message-content ul{margin:.5rem 0;padding-left:1.5rem}.chat-input-form{background:var(--ai-darker);border-top:1px solid var(--ai-border);padding:1.5rem}.input-group{display:flex;gap:1rem;margin-bottom:1rem}.chat-input{background:hsla(0,0%,100%,.05);border:2px solid var(--ai-border);border-radius:8px;color:var(--ai-light);flex:1;font-size:1rem;padding:1rem;transition:border-color .3s ease}.chat-input:focus{border-color:var(--ai-primary);outline:none}.send-button{align-items:center;background:var(--ai-primary);border:none;border-radius:8px;color:var(--ai-light);cursor:pointer;display:flex;justify-content:center;padding:1rem 1.5rem;transition:background .3s ease}.send-button:hover{background:#6a0f2a}.input-hints{display:flex;flex-wrap:wrap;gap:.5rem}.hint-button{background:transparent;border:1px solid var(--ai-border);border-radius:20px;color:var(--ai-gray);cursor:pointer;font-size:.875rem;padding:.5rem 1rem;transition:all .3s ease}.hint-button:hover{background:var(--ai-primary);border-color:var(--ai-primary);color:var(--ai-light)}.ai-features{background:var(--ai-darker);border-top:1px solid var(--ai-border);padding:5rem 0}.ai-features .container{margin:0 auto;max-width:1200px;padding:0 2rem}.ai-features .section-title{color:var(--ai-light);font-size:2.5rem;margin-bottom:3rem;text-align:center}.features-grid{display:grid;gap:2rem;grid-template-columns:repeat(auto-fit,minmax(250px,1fr))}.feature-card{background:hsla(0,0%,100%,.02);border:1px solid var(--ai-border);border-radius:12px;padding:2rem;text-align:center;transition:transform .3s ease}.feature-card:hover{box-shadow:var(--ai-shadow);transform:translateY(-5px)}.feature-icon{align-items:center;background:rgba(139,21,56,.1);border-radius:50%;color:var(--ai-primary);display:flex;height:80px;justify-content:center;margin:0 auto 1.5rem;width:80px}.feature-card h3{color:var(--ai-light);font-size:1.25rem;margin-bottom:1rem}.feature-card p{color:var(--ai-gray);line-height:1.6}.ai-integration{background:var(--ai-dark);padding:5rem 0}.ai-integration .container{margin:0 auto;max-width:1200px;padding:0 2rem}.integration-content{align-items:center;display:grid;gap:4rem;grid-template-columns:1fr 1fr}.integration-text h2{color:var(--ai-light);font-size:2.5rem;margin-bottom:1rem}.integration-text p{color:var(--ai-gray);margin-bottom:2rem}.integration-list{margin:2rem 0;padding-left:1.5rem}.integration-list li{color:var(--ai-gray);margin-bottom:.75rem}.integration-cta{display:flex;gap:1rem;margin-top:2rem}.button{border-radius:8px;display:inline-block;font-weight:600;overflow:hidden;padding:1rem 2rem;position:relative;text-decoration:none;transition:all .3s ease}.button.primary{background:var(--accent-primary);box-shadow:0 0 20px rgba(6,182,212,.3)}.button.primary,.button.secondary{border:2px solid var(--accent-cyan);color:var(--accent-cyan)}.button.secondary{background:rgba(63,114,175,.2);box-shadow:0 0 15px rgba(6,182,212,.2)}.button:hover{transform:translateY(-2px)}.button.primary:hover{background:var(--accent-secondary);box-shadow:0 0 40px rgba(6,182,212,.8),0 0 60px rgba(0,217,255,.6);text-shadow:0 0 10px rgba(0,217,255,.8)}.button.primary:hover,.button.secondary:hover{border-color:var(--accent-electric);color:var(--accent-electric)}.button.secondary:hover{background:var(--accent-primary);box-shadow:0 0 30px rgba(6,182,212,.8),0 0 50px rgba(0,217,255,.5);text-shadow:0 0 8px rgba(0,217,255,.8)}.integration-code{background:#1e1e1e;border-radius:12px;overflow-x:auto;padding:2rem}.integration-code pre{color:#f8f8f2;font-size:.875rem;line-height:1.6;margin:0}.integration-code code{font-family:Consolas,Monaco,monospace}.ai-cta-section{background:var(--ai-dark);color:var(--ai-light);padding:5rem 0;text-align:center}.ai-cta-section .container{margin:0 auto;max-width:800px;padding:0 2rem}.cta-content h2{font-size:2.5rem;margin-bottom:1rem}.cta-content p{font-size:1.25rem;margin-bottom:2rem;opacity:.9}.cta-buttons{display:flex;gap:1rem;justify-content:center}.button.large{font-size:1.125rem;padding:1.25rem 2.5rem}.under-construction{align-items:center;display:flex;justify-content:center;min-height:60vh;padding:4rem 0}.construction-content{margin:0 auto;max-width:600px;text-align:center}.construction-icon{animation:clockRotate 10s linear infinite;margin-bottom:2rem}.construction-icon svg{filter:drop-shadow(0 0 20px rgba(139,21,56,.5))}@keyframes clockRotate{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}.construction-title{color:var(--ai-light);font-family:var(--font-display);font-size:2.5rem;font-weight:700;margin-bottom:1.5rem}.construction-message{color:var(--ai-gray);font-size:1.25rem;line-height:1.8;margin-bottom:3rem}.launch-info{background:rgba(139,21,56,.1);border:2px solid var(--ai-border);border-radius:12px;margin-bottom:3rem;padding:2rem}.launch-label{color:var(--ai-gray);font-size:.875rem;letter-spacing:.1em;margin-bottom:.5rem;text-transform:uppercase}.launch-date{color:var(--ai-primary);font-family:var(--font-display);font-size:2.5rem;font-weight:700}.features-preview{margin-bottom:3rem}.features-preview h3{color:var(--ai-light);font-size:1.5rem;margin-bottom:1.5rem}.preview-list{list-style:none;margin:0 auto;max-width:400px;padding:0;text-align:left}.preview-list li{align-items:center;background:hsla(0,0%,100%,.02);border:1px solid var(--ai-border);border-radius:8px;display:flex;gap:1rem;margin-bottom:.5rem;padding:1rem;transition:all .3s ease}.preview-list li:hover{background:rgba(139,21,56,.1);transform:translateX(10px)}.preview-icon{filter:grayscale(.2);font-size:1.5rem}.construction-cta{margin-top:2rem}.construction-cta p{color:var(--ai-gray);font-size:1.125rem;margin-bottom:1rem}.notify-button{background:var(--ai-primary);border:2px solid var(--ai-primary);border-radius:8px;color:var(--ai-light);display:inline-block;font-size:1.125rem;font-weight:600;padding:1rem 2.5rem;text-decoration:none;transition:all .3s ease}.notify-button:hover{background:transparent;box-shadow:0 4px 16px rgba(139,21,56,.3);color:var(--ai-primary);transform:translateY(-2px)}.axis-ai-page .footer{background:var(--ai-dark);border-top:1px solid hsla(0,0%,100%,.1)}@media (max-width:768px){.hero-title{font-size:3rem}.hero-stats{flex-direction:column;gap:2rem}.integration-content{grid-template-columns:1fr}.integration-code{font-size:.75rem}.cta-buttons{align-items:center;flex-direction:column}.button.large{max-width:300px;width:100%}.chat-messages{height:300px}.input-hints{justify-content:center}}`, ""]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ 540:
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
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
  if (typeof memo[target] === "undefined") {
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
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }
  target.appendChild(style);
}
module.exports = insertBySelector;

/***/ }),

/***/ 825:
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";
  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }
  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }
  var needLayer = typeof obj.layer !== "undefined";
  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }
  css += obj.css;
  if (needLayer) {
    css += "}";
  }
  if (obj.media) {
    css += "}";
  }
  if (obj.supports) {
    css += "}";
  }
  var sourceMap = obj.sourceMap;
  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
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
  if (typeof document === "undefined") {
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
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
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
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};

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
// EXTERNAL MODULE: ./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/dist/cjs.js!./src/css/axis-ai.css
var axis_ai = __webpack_require__(538);
;// ./src/css/axis-ai.css

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (styleTagTransform_default());
options.setAttributes = (setAttributesWithoutAttributes_default());

      options.insert = insertBySelector_default().bind(null, "head");
    
options.domAPI = (styleDomAPI_default());
options.insertStyleElement = (insertStyleElement_default());

var update = injectStylesIntoStyleTag_default()(axis_ai/* default */.A, options);




       /* harmony default export */ const css_axis_ai = (axis_ai/* default */.A && axis_ai/* default */.A.locals ? axis_ai/* default */.A.locals : undefined);

;// ./src/js/navigation.js
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
        navigation.style.background = 'rgba(10, 15, 28, 0.98)';
        navigation.style.borderBottom = '1px solid rgba(6, 182, 212, 0.3)';
        navigation.style.boxShadow = '0 0 20px rgba(6, 182, 212, 0.1)';
      } else {
        navigation.style.background = 'rgba(10, 15, 28, 0.95)';
        navigation.style.borderBottom = '1px solid rgba(6, 182, 212, 0.1)';
        navigation.style.boxShadow = 'none';
      }
    });
  },
  handleExternalLinks: function handleExternalLinks() {
    // Add confirmation for external links
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a');
      if (!link) {
        return;
      }
      var href = link.getAttribute('href');
      if (!href) {
        return;
      }

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
/* harmony default export */ const navigation = (Navigation);
;// ./src/js/animation.js
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
      card.style.transition = "opacity 0.8s ease-out ".concat(index * 0.2, "s, transform 0.8s ease-out ").concat(index * 0.2, "s");
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
;// ./src/js/performance.js
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
        thornPattern.style.transform = "translateY(".concat(rate, "px) rotate(").concat(scrolled * 0.1, "deg)");
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
/* harmony default export */ const performance = (PerformanceModule);
;// ./src/js/notification.js
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
    notification.className = "notification notification-".concat(type);
    notification.textContent = message;

    // Add styles
    notification.style.cssText = "\n            position: fixed;\n            top: 100px;\n            right: 20px;\n            background: ".concat(type === 'success' ? '#2d5016' : type === 'error' ? '#5d1a1a' : '#1a1a1a', ";\n            color: #e8e8e8;\n            padding: 1rem 2rem;\n            border-left: 4px solid ").concat(type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#d4af37', ";\n            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.8);\n            z-index: 10000;\n            opacity: 0;\n            transform: translateX(100%);\n            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n            max-width: 400px;\n            font-family: 'Inter', sans-serif;\n            font-size: 14px;\n            border-radius: 2px;\n        ");
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
/* harmony default export */ const notification = ((/* unused pure expression or super */ null && (NotificationModule)));
;// ./src/js/axis-ai.js
function _regenerator() { /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/babel/babel/blob/main/packages/babel-helpers/LICENSE */ var e, t, r = "function" == typeof Symbol ? Symbol : {}, n = r.iterator || "@@iterator", o = r.toStringTag || "@@toStringTag"; function i(r, n, o, i) { var c = n && n.prototype instanceof Generator ? n : Generator, u = Object.create(c.prototype); return _regeneratorDefine2(u, "_invoke", function (r, n, o) { var i, c, u, f = 0, p = o || [], y = !1, G = { p: 0, n: 0, v: e, a: d, f: d.bind(e, 4), d: function d(t, r) { return i = t, c = 0, u = e, G.n = r, a; } }; function d(r, n) { for (c = r, u = n, t = 0; !y && f && !o && t < p.length; t++) { var o, i = p[t], d = G.p, l = i[2]; r > 3 ? (o = l === n) && (u = i[(c = i[4]) ? 5 : (c = 3, 3)], i[4] = i[5] = e) : i[0] <= d && ((o = r < 2 && d < i[1]) ? (c = 0, G.v = n, G.n = i[1]) : d < l && (o = r < 3 || i[0] > n || n > l) && (i[4] = r, i[5] = n, G.n = l, c = 0)); } if (o || r > 1) return a; throw y = !0, n; } return function (o, p, l) { if (f > 1) throw TypeError("Generator is already running"); for (y && 1 === p && d(p, l), c = p, u = l; (t = c < 2 ? e : u) || !y;) { i || (c ? c < 3 ? (c > 1 && (G.n = -1), d(c, u)) : G.n = u : G.v = u); try { if (f = 2, i) { if (c || (o = "next"), t = i[o]) { if (!(t = t.call(i, u))) throw TypeError("iterator result is not an object"); if (!t.done) return t; u = t.value, c < 2 && (c = 0); } else 1 === c && (t = i["return"]) && t.call(i), c < 2 && (u = TypeError("The iterator does not provide a '" + o + "' method"), c = 1); i = e; } else if ((t = (y = G.n < 0) ? u : r.call(n, G)) !== a) break; } catch (t) { i = e, c = 1, u = t; } finally { f = 1; } } return { value: t, done: y }; }; }(r, o, i), !0), u; } var a = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} t = Object.getPrototypeOf; var c = [][n] ? t(t([][n]())) : (_regeneratorDefine2(t = {}, n, function () { return this; }), t), u = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(c); function f(e) { return Object.setPrototypeOf ? Object.setPrototypeOf(e, GeneratorFunctionPrototype) : (e.__proto__ = GeneratorFunctionPrototype, _regeneratorDefine2(e, o, "GeneratorFunction")), e.prototype = Object.create(u), e; } return GeneratorFunction.prototype = GeneratorFunctionPrototype, _regeneratorDefine2(u, "constructor", GeneratorFunctionPrototype), _regeneratorDefine2(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = "GeneratorFunction", _regeneratorDefine2(GeneratorFunctionPrototype, o, "GeneratorFunction"), _regeneratorDefine2(u), _regeneratorDefine2(u, o, "Generator"), _regeneratorDefine2(u, n, function () { return this; }), _regeneratorDefine2(u, "toString", function () { return "[object Generator]"; }), (_regenerator = function _regenerator() { return { w: i, m: f }; })(); }
function _regeneratorDefine2(e, r, n, t) { var i = Object.defineProperty; try { i({}, "", {}); } catch (e) { i = 0; } _regeneratorDefine2 = function _regeneratorDefine(e, r, n, t) { if (r) i ? i(e, r, { value: n, enumerable: !t, configurable: !t, writable: !t }) : e[r] = n;else { var o = function o(r, n) { _regeneratorDefine2(e, r, function (e) { return this._invoke(r, n, e); }); }; o("next", 0), o("throw", 1), o("return", 2); } }, _regeneratorDefine2(e, r, n, t); }
function asyncGeneratorStep(n, t, e, r, o, a, c) { try { var i = n[a](c), u = i.value; } catch (n) { return void e(n); } i.done ? t(u) : Promise.resolve(u).then(r, o); }
function _asyncToGenerator(n) { return function () { var t = this, e = arguments; return new Promise(function (r, o) { var a = n.apply(t, e); function _next(n) { asyncGeneratorStep(a, r, o, _next, _throw, "next", n); } function _throw(n) { asyncGeneratorStep(a, r, o, _next, _throw, "throw", n); } _next(void 0); }); }; }
// Axis AI Entry Point






// Make showNotification globally available for inline handlers
window.showNotification = showNotification;

// Axis AI Chat System
var AxisAIChat = {
  messages: [],
  chatContainer: null,
  chatMessages: null,
  chatForm: null,
  chatInput: null,
  sendButton: null,
  init: function init() {
    this.chatContainer = document.getElementById('chatContainer');
    this.chatMessages = document.getElementById('chatMessages');
    this.chatForm = document.getElementById('chatForm');
    this.chatInput = document.getElementById('chatInput');
    this.sendButton = document.getElementById('sendButton');
    if (!this.chatForm || !this.chatInput) {
      return;
    }
    this.initEventListeners();
    this.initSuggestions();
    this.initCharCounter();
    this.animateStats();
  },
  initEventListeners: function initEventListeners() {
    var _this = this;
    // Form submission
    this.chatForm.addEventListener('submit', function (e) {
      e.preventDefault();
      _this.sendMessage();
    });

    // Clear chat
    var clearBtn = document.getElementById('clearChat');
    if (clearBtn) {
      clearBtn.addEventListener('click', function () {
        return _this.clearChat();
      });
    }

    // Export chat
    var exportBtn = document.getElementById('exportChat');
    if (exportBtn) {
      exportBtn.addEventListener('click', function () {
        return _this.exportChat();
      });
    }

    // Auto-resize textarea
    this.chatInput.addEventListener('input', function () {
      _this.autoResizeTextarea();
      _this.updateCharCount();
    });

    // Enable enter to send (shift+enter for new line)
    this.chatInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        _this.sendMessage();
      }
    });
  },
  initSuggestions: function initSuggestions() {
    var _this2 = this;
    var suggestionBtns = document.querySelectorAll('.suggestion-btn');
    suggestionBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var query = btn.getAttribute('data-query');
        _this2.chatInput.value = query;
        _this2.sendMessage();
      });
    });
  },
  initCharCounter: function initCharCounter() {
    this.updateCharCount();
  },
  updateCharCount: function updateCharCount() {
    var charCount = document.querySelector('.char-count');
    if (charCount) {
      var length = this.chatInput.value.length;
      charCount.textContent = "".concat(length, " / 2000");
    }
  },
  autoResizeTextarea: function autoResizeTextarea() {
    this.chatInput.style.height = 'auto';
    this.chatInput.style.height = Math.min(this.chatInput.scrollHeight, 120) + 'px';
  },
  sendMessage: function sendMessage() {
    var _this3 = this;
    return _asyncToGenerator(/*#__PURE__*/_regenerator().m(function _callee() {
      var message, welcome, typingId, response, data, _t;
      return _regenerator().w(function (_context) {
        while (1) switch (_context.n) {
          case 0:
            message = _this3.chatInput.value.trim();
            if (!(!message || message.length === 0)) {
              _context.n = 1;
              break;
            }
            return _context.a(2);
          case 1:
            // Disable input
            _this3.chatInput.disabled = true;
            _this3.sendButton.disabled = true;

            // Hide welcome message if first message
            welcome = document.querySelector('.chat-welcome');
            if (welcome) {
              welcome.style.display = 'none';
              if (!_this3.chatMessages) {
                _this3.chatMessages = document.createElement('div');
                _this3.chatMessages.className = 'chat-messages';
                _this3.chatMessages.id = 'chatMessages';
                _this3.chatContainer.appendChild(_this3.chatMessages);
              }
            }

            // Add user message
            _this3.addMessage('user', message);

            // Clear input
            _this3.chatInput.value = '';
            _this3.updateCharCount();
            _this3.autoResizeTextarea();

            // Show typing indicator
            typingId = _this3.showTypingIndicator();
            _context.p = 2;
            _context.n = 3;
            return fetch('/api/ai-chat', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                message: message,
                context: _this3.messages.slice(-10) // Send last 10 messages for context
              })
            });
          case 3:
            response = _context.v;
            _context.n = 4;
            return response.json();
          case 4:
            data = _context.v;
            // Remove typing indicator
            _this3.removeTypingIndicator(typingId);
            if (response.ok) {
              _context.n = 5;
              break;
            }
            throw new Error(data.error || 'Failed to get response');
          case 5:
            // Add AI response
            _this3.addMessage('ai', data.response.text, data.response.suggestions);
            _context.n = 7;
            break;
          case 6:
            _context.p = 6;
            _t = _context.v;
            console.error('Chat error:', _t);
            _this3.removeTypingIndicator(typingId);
            _this3.addMessage('ai', 'I apologize, but I encountered an error processing your request. Please try again.');
          case 7:
            _context.p = 7;
            // Re-enable input
            _this3.chatInput.disabled = false;
            _this3.sendButton.disabled = false;
            _this3.chatInput.focus();
            return _context.f(7);
          case 8:
            return _context.a(2);
        }
      }, _callee, null, [[2, 6, 7, 8]]);
    }))();
  },
  addMessage: function addMessage(type, text) {
    var _this4 = this;
    var suggestions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;
    var messageId = Date.now();
    var messageData = {
      id: messageId,
      type: type,
      text: text,
      timestamp: new Date(),
      suggestions: suggestions
    };
    this.messages.push(messageData);
    var messageEl = document.createElement('div');
    messageEl.className = "message ".concat(type);
    messageEl.id = "message-".concat(messageId);
    var avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    var content = document.createElement('div');
    content.className = 'message-content';
    var header = document.createElement('div');
    header.className = 'message-header';
    var author = document.createElement('span');
    author.className = 'message-author';
    author.textContent = type === 'user' ? 'You' : 'Axis AI';
    var time = document.createElement('span');
    time.className = 'message-time';
    time.textContent = this.formatTime(messageData.timestamp);
    header.appendChild(author);
    header.appendChild(time);
    var textEl = document.createElement('div');
    textEl.className = 'message-text';
    textEl.innerHTML = this.formatMessageText(text);
    content.appendChild(header);
    content.appendChild(textEl);

    // Add suggestions if available
    if (suggestions && suggestions.length > 0) {
      var suggestionsEl = document.createElement('div');
      suggestionsEl.className = 'message-suggestions';
      suggestions.forEach(function (suggestion) {
        var btn = document.createElement('button');
        btn.className = 'suggestion-inline';
        btn.textContent = suggestion;
        btn.onclick = function () {
          _this4.chatInput.value = suggestion;
          _this4.sendMessage();
        };
        suggestionsEl.appendChild(btn);
      });
      content.appendChild(suggestionsEl);
    }
    messageEl.appendChild(avatar);
    messageEl.appendChild(content);
    this.chatMessages.appendChild(messageEl);

    // Scroll to bottom
    this.scrollToBottom();
  },
  showTypingIndicator: function showTypingIndicator() {
    var typingId = "typing-".concat(Date.now());
    var typingEl = document.createElement('div');
    typingEl.className = 'message ai typing';
    typingEl.id = typingId;
    typingEl.innerHTML = "\n            <div class=\"message-avatar\"></div>\n            <div class=\"message-content\">\n                <div class=\"typing-indicator\">\n                    <span></span>\n                    <span></span>\n                    <span></span>\n                </div>\n            </div>\n        ";
    this.chatMessages.appendChild(typingEl);
    this.scrollToBottom();
    return typingId;
  },
  removeTypingIndicator: function removeTypingIndicator(typingId) {
    var typingEl = document.getElementById(typingId);
    if (typingEl) {
      typingEl.remove();
    }
  },
  formatMessageText: function formatMessageText(text) {
    // Convert markdown-style formatting
    return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>').replace(/•/g, '&bull;').replace(/\n/g, '<br>');
  },
  formatTime: function formatTime(date) {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  },
  scrollToBottom: function scrollToBottom() {
    this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
  },
  clearChat: function clearChat() {
    if (confirm('Are you sure you want to clear the chat history?')) {
      this.messages = [];
      this.chatMessages.innerHTML = '';

      // Show welcome message again
      var welcome = document.querySelector('.chat-welcome');
      if (welcome) {
        welcome.style.display = 'block';
      }
    }
  },
  exportChat: function exportChat() {
    if (this.messages.length === 0) {
      showNotification('No messages to export', 'error');
      return;
    }

    // Create text export
    var exportText = 'Axis AI Chat Export\n';
    exportText += '==================\n\n';
    this.messages.forEach(function (msg) {
      exportText += "".concat(msg.type === 'user' ? 'You' : 'Axis AI', " (").concat(msg.timestamp.toLocaleString(), "):\n");
      exportText += "".concat(msg.text, "\n\n");
    });

    // Create blob and download
    var blob = new Blob([exportText], {
      type: 'text/plain'
    });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = "axis-ai-chat-".concat(Date.now(), ".txt");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification('Chat exported successfully', 'success');
  },
  animateStats: function animateStats() {
    var _this5 = this;
    var statElements = document.querySelectorAll('.stat-value');
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          _this5.animateStatValue(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.5
    });
    statElements.forEach(function (el) {
      return observer.observe(el);
    });
  },
  animateStatValue: function animateStatValue(element) {
    var targetValue = parseFloat(element.getAttribute('data-value'));
    var duration = 2000;
    var steps = 60;
    var stepDuration = duration / steps;
    var currentStep = 0;
    var isDecimal = targetValue % 1 !== 0;
    var suffix = element.nextElementSibling.textContent.includes('Rate') ? '%' : element.nextElementSibling.textContent.includes('Time') ? 's' : '';
    var interval = setInterval(function () {
      currentStep++;
      var progress = currentStep / steps;
      var easeOutQuart = 1 - Math.pow(1 - progress, 4);
      var currentValue = targetValue * easeOutQuart;
      if (isDecimal) {
        element.textContent = currentValue.toFixed(1) + suffix;
      } else {
        element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
      }
      if (currentStep >= steps) {
        clearInterval(interval);
        if (isDecimal) {
          element.textContent = targetValue.toFixed(1) + suffix;
        } else {
          element.textContent = targetValue.toLocaleString() + suffix;
        }
      }
    }, stepDuration);
  }
};

// Add custom CSS for chat-specific elements
var style = document.createElement('style');
style.textContent = "\n.typing-indicator {\n    display: flex;\n    gap: 4px;\n    padding: 1rem;\n}\n\n.typing-indicator span {\n    width: 8px;\n    height: 8px;\n    background: #666;\n    border-radius: 50%;\n    animation: typing 1.4s infinite;\n}\n\n.typing-indicator span:nth-child(2) {\n    animation-delay: 0.2s;\n}\n\n.typing-indicator span:nth-child(3) {\n    animation-delay: 0.4s;\n}\n\n@keyframes typing {\n    0%, 60%, 100% { opacity: 0.3; }\n    30% { opacity: 1; }\n}\n\n.message-suggestions {\n    display: flex;\n    flex-wrap: wrap;\n    gap: 0.5rem;\n    margin-top: 1rem;\n}\n\n.suggestion-inline {\n    padding: 0.5rem 1rem;\n    background: rgba(139, 21, 56, 0.1);\n    border: 1px solid #8B1538;\n    border-radius: 20px;\n    color: #fff;\n    font-size: 0.875rem;\n    cursor: pointer;\n    transition: all 0.2s ease;\n}\n\n.suggestion-inline:hover {\n    background: rgba(139, 21, 56, 0.2);\n    transform: translateY(-1px);\n}\n";
document.head.appendChild(style);

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function () {
  // Initialize common modules
  navigation.init();
  animation.init();
  performance.init();

  // Initialize Axis AI Chat
  AxisAIChat.init();
});
/******/ })()
;