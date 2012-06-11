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
  document.addEventListener('DOMContentLoaded', function() {
    var controller = new SkeletonKeyOptions(window);
  });
})();

/**
 * SkeletonKeyOptions is a controller for both retrieving settings and for
 * displaying the view.
 *
 * @param {Window} win The window and document on wich to operate.
 */
var SkeletonKeyOptions = SkeletonKeyOptions || function(win) {
  if (win) {
    this._storage = win.localStorage;
    this._maxLength = win.document.getElementById('maxlength');
    this._saveButton = win.document.getElementById('save');
    this._saveButton.onclick = this.onSave.bind(this);
  }
};

/**
 * Local storage key constants.
 * @priate
 */
SkeletonKeyOptions.prototype._MIN_LENGTH_KEY = 'minlength';
SkeletonKeyOptions.prototype._MAX_LENGTH_KEY = 'maxlength';

/**
 * Gets the minimum password length.
 * @returns {int}
 */
SkeletonKeyOptions.prototype.getMinimumPasswordLength = function() {
  if (this._storage) {
    var setting = this._storage.getItem(this._MIN_LENGTH_KEY);
    if (setting)
      return setting;
  }
  return 6;
};

/**
 * Gets the maximum password length.
 * @returns {int}
 */
SkeletonKeyOptions.prototype.getMaximumPasswordLength = function() {
  if (this._storage) {
    var setting = this._storage.getItem(this._MAX_LENGTH_KEY);
    if (setting)
      return setting;
  }
  return 18;
};

/**
 * Saves the options. Requires a document.
 */
SkeletonKeyOptions.prototype.onSave = function() {
  if (!this._storage)
    return;

  this._storage.setItem(this._MAX_LENGTH_KEY, this._maxLength.value);
};
