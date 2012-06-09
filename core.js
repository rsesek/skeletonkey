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
  console.log(key);
};
