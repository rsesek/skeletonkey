/* Copyright (c) 2012 Robert Sesek <http://robert.sesek.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */

(function main() {
  if (typeof chrome !== 'undefined') {
    // TODO: load the extension JS
  } else {
    // TODO: load the hosted JS
  }

  document.addEventListener('DOMContentLoaded', function() {
    var controller = new SkeletonKey(document);
  });
})();

/**
 * SkeletonKey is view controller for generating secure passwords.
 *
 * @param {HTMLDocument} doc The document on which to operate.
 */
var SkeletonKey = SkeletonKey || function(doc) {
  this._master = doc.getElementById('master');
  this._sitekey = doc.getElementById('sitekey');
  this._username = doc.getElementById('username');
  this._password = doc.getElementById('password');
  this._generateButton = doc.getElementById('generate');

  // If this is an extension, use defaults until the Chrome settings are loaded.
  var win = null;
  if (!this._isChromeExtension())
    win = window;
  this._options = new SkeletonKeyOptions(null, win);


  this._init();
};

/**
 * The number of iterations to perform in PBKDF2.
 * @const {int}
 */
SkeletonKey.prototype.ITERATIONS = 1000;
/**
 * The size of the key, in bytes.
 * @const {int}
 */
SkeletonKey.prototype.KEYSIZE = 256/32;

/**
 * Initializes event handlers for the page.
 * @private
 */
SkeletonKey.prototype._init = function() {
  this._generateButton.onclick = this._onGenerate.bind(this);

  this._master.onkeyup = this._nextFieldInterceptor.bind(this);
  this._sitekey.onkeyup = this._nextFieldInterceptor.bind(this);
  this._username.onkeyup = this._nextFieldInterceptor.bind(this);

  this._password.onclick = this._selectPassword.bind(this);
  this._password.labels[0].onclick = this._selectPassword.bind(this);

  this._initChromeExtension();

  this._master.focus();
};

/**
 * Event handler for generating a new password.
 * @param {Event} e
 * @private
 */
SkeletonKey.prototype._onGenerate = function(e) {
  var salt = this._username.value + '@' + this._sitekey.value;

  // |key| is a WordArray of 32-bit words.
  var key = CryptoJS.PBKDF2(this._master.value, salt,
      {keySize: this.KEYSIZE, iterations: this.ITERATIONS});

  var hexString = key.toString();
  hexString = this._capitalizeKey(hexString);

  var maxLength = this._options.getMaximumPasswordLength();
  if (hexString.length > maxLength)
    hexString = hexString.substr(0, maxLength);

  this._password.value = hexString;
  this._selectPassword();
};

/**
 * Takes a HEX string and returns a mixed-case string.
 * @param {string} key
 * @return string
 * @private
 */
SkeletonKey.prototype._capitalizeKey = function(key) {
  // |key| is too long for a decent password, so try and use the second half of
  // it as the basis for capitalizing the key.
  var capsSource = null;
  var keyLength = key.length;
  if (keyLength / 2 <= this._options.getMinimumPasswordLength()) {
    capsSouce = key.substr(0, keyLength - this._options.getMinimumPasswordLength());
  } else {
    capsSource = key.substr(keyLength / 2);
  }

  if (!capsSource || capsSource.length < 1) {
    return key;
  }

  key = key.substr(0, capsSource.length);
  var capsSourceLength = capsSource.length;

  var j = 0;
  var newKey = "";
  for (var i = 0; i < key.length; i++) {
    var c = key.charCodeAt(i);
    // If this is not a lowercase letter or there's no more source, skip.
    if (c < 0x61 || c > 0x7A || j >= capsSourceLength) {
      newKey += key[i];
      continue;
    }

    var makeCap = capsSource.charCodeAt(j++) % 2;
    if (makeCap)
      newKey += String.fromCharCode(c - 0x20);
    else
      newKey += key[i];
  }

  return newKey;
};

/**
 * Checks if the given key event is from the enter key and moves onto the next
 * field or generates the password.
 * @param {Event} e
 * @private
 */
SkeletonKey.prototype._nextFieldInterceptor = function(e) {
  if (e.keyCode != 0xD)
    return;

  if (this._master.value == "") {
    this._master.focus();
  } else if (this._sitekey.value == "") {
    this._sitekey.focus();
  } else if (this._username.value == "") {
    this._username.focus();
  } else {
    this._generateButton.click();
  }
};

/**
 * Selects the contents of the generated password.
 * @private
 */
SkeletonKey.prototype._selectPassword = function() {
  this._password.focus();
  this._password.select();
};

/**
 * Initalizes the Chrome extension pieces if running inside chrome.
 * @private
 */
SkeletonKey.prototype._initChromeExtension = function() {
  return;

  // getCurrent is undefined for backround pages. Need content script.
  chrome.tabs.getCurrent(function (tab) {
    if (tab == null)
      return;

    var url = tab.url;
    if (url == null || url == "")
      return;

    var siteKey = url.search(/https?:\/\/(www.?|login|accounts?)\.(.*)\.(com?|net|org|edu|biz|info)?.*/);
    console.log(siteKey);
  });
};

/**
 * Checks if SkeletonKey is running as a Chrome extension.
 * @returns {bool}
 * @private
 */
SkeletonKey.prototype._isChromeExtension = function() {
  return typeof chrome != 'undefined' && typeof chrome.extension != 'undefined';
};
