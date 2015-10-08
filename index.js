'use strict';

/* global Components */
var clone = require('clone');

try {
  Components.utils.importGlobalProperties(['XMLHttpRequest']);
} catch (e) {
  // Exeption may occur only outside of the Firefox Sandbox environment
  // Just swallow it
}

/**
 * Gets the library from the provided url and evaluates it against specified context.
 *
 * @param  {string} url             Url to library's js file
 * @param  {object} context         iMacros sandbox object
 * @param  {string} objNameToClone  Optional object name provided by the loaded library
 *                                  to clone from window object to the context object.
 */
module.exports = function(url, context, objNameToClone) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, false); // false stands for syncronous request

  xhr.addEventListener('load', function() {
    if (xhr.status >= 200 && xhr.readyState === 4) {
      eval.call(context, xhr.responseText);
      window.console.log('Script successfuly loaded from url: ' + url);

      // clone object
      if (objNameToClone && isString(objNameToClone))
        context[objNameToClone] = clone(window[objNameToClone]);
    }
  });

  xhr.send(null);
};

function isString(arg) { return typeof arg === 'string'; }
