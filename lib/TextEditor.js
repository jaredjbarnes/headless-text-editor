"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _DecorationManager = _interopRequireDefault(require("./DecorationManager"));

var _Observable = _interopRequireDefault(require("./Observable"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(n); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var clone = function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

var nonAlphaNumericCharacter = /[^a-zA-Z]/;

var TextEditor = /*#__PURE__*/function () {
  function TextEditor() {
    _classCallCheck(this, TextEditor);

    this.initialize();
  } // #region Life Cycle Methods


  _createClass(TextEditor, [{
    key: "initialize",
    value: function initialize() {
      var _this = this;

      this.text = '';
      this.decorations = [{
        type: 'cursor',
        startIndex: 0,
        endIndex: 1
      }];
      this.decorationManager = new _DecorationManager.default(this);
      this.observable = new _Observable.default();
      this.trackingDisabled = false;
      this.history = [];
      this.historyIndex = -1;
      this.trackingKey = 0;
      this.isMute = false;
      this.muteKey = 0;
      this.observable.observe('on-change', function (event) {
        if (!_this.trackingDisabled) {
          _this.history = _this.history.slice(0, _this.historyIndex + 1);

          _this.history.push(event);

          _this.historyIndex = _this.history.length - 1;

          if (_this.history.length > 200) {
            _this.history.shift();
          }
        }
      });
    }
  }, {
    key: "dispose",
    value: function dispose() {
      this.observable.dispose();
      this.initialize();
    } //#endregion
    // #region Cursor Methods

  }, {
    key: "getCursor",
    value: function getCursor() {
      return Object.assign({}, this.cursor);
    }
  }, {
    key: "getCharacterAtCursor",
    value: function getCharacterAtCursor() {
      return this.text.substring(this.cursor.startIndex, this.cursor.endIndex);
    }
  }, {
    key: "moveCursorUp",
    value: function moveCursorUp() {
      var index = this.getIndexUpFromIndex(this.cursor.startIndex);

      if (index != null) {
        this.moveCursor(index);
      }
    }
  }, {
    key: "moveCursorDown",
    value: function moveCursorDown() {
      var index = this.getIndexDownFromIndex(this.cursor.startIndex);

      if (index != null) {
        this.moveCursor(index);
      }
    }
  }, {
    key: "moveCursorLeft",
    value: function moveCursorLeft() {
      this.moveCursor(this.cursor.startIndex - 1);
    }
  }, {
    key: "moveCursorRight",
    value: function moveCursorRight() {
      this.moveCursor(this.cursor.startIndex + 1);
    }
  }, {
    key: "moveCursor",
    value: function moveCursor(index) {
      if (typeof index !== 'number' || isNaN(index)) {
        return;
      }

      if (index > this.text.length) {
        index = this.text.length;
      }

      if (index < 0) {
        index = 0;
      }

      this.cursor.startIndex = index;
      this.cursor.endIndex = index + 1;
      this.decorationManager.saveDecorationPlacementHistory();
      var key = this.disableTracking();
      this.notifyChange();
      this.enableTracking(key);
    }
  }, {
    key: "getCursorPosition",
    value: function getCursorPosition() {
      return this.cursor.startIndex;
    }
  }, {
    key: "moveToDecoration",
    value: function moveToDecoration(decoration) {
      if (this.decorations.includes(decoration) && decoration.type !== 'cursor') {
        // This Makes the text sticky by having the cursor history from inside.
        var left = Math.min(decoration.startIndex, decoration.endIndex);
        this.moveCursor(left);
        this.moveCursor(left);
      }
    } //#endregion
    // #region Decorations Methods

  }, {
    key: "addDecoration",
    value: function addDecoration(decoration) {
      if (decoration.type === 'cursor') {
        return;
      }

      decoration.startIndex = Math.max(0, decoration.startIndex);
      decoration.startIndex = Math.min(decoration.startIndex, this.text.length);
      decoration.endIndex = Math.max(0, decoration.endIndex);
      decoration.endIndex = Math.min(decoration.endIndex, this.text.length);
      this.decorations.push(clone(decoration));
      this.notifyChange();
    }
  }, {
    key: "replaceDecoration",
    value: function replaceDecoration(decoration, newDecoration) {
      if (decoration.type === 'cursor' || newDecoration.type === 'cursor') {
        return;
      }

      var index = this.findDecorationIndex(decoration);

      if (index >= 0) {
        newDecoration.startIndex = Math.max(0, newDecoration.startIndex);
        newDecoration.startIndex = Math.min(newDecoration.startIndex, this.text.length);
        newDecoration.endIndex = Math.max(0, newDecoration.endIndex);
        newDecoration.endIndex = Math.min(newDecoration.endIndex, this.text.length);
        this.decorations.splice(index, 1, newDecoration);
      }

      this.notifyChange();
    }
  }, {
    key: "findDecorationIndex",
    value: function findDecorationIndex(decoration) {
      return this.decorations.findIndex(function (d) {
        return d.type === decoration.type && d.startIndex === decoration.startIndex && d.endIndex === decoration.endIndex;
      });
    }
  }, {
    key: "removeDecoration",
    value: function removeDecoration(decoration) {
      if (decoration.type === 'cursor') {
        return;
      }

      var index = this.findDecorationIndex(decoration);

      if (index >= 0) {
        this.decorations.splice(index, 1);
      }

      this.notifyChange();
    }
  }, {
    key: "setDecorations",
    value: function setDecorations(decorations) {
      var _this2 = this;

      var key = this.disableTracking();
      this.decorations = this.decorations.filter(function (d) {
        return d.type === 'cursor';
      });
      decorations.forEach(function (decoration) {
        _this2.addDecoration(decoration);
      });
      this.notifyChange();
      this.enableTracking(key);
    }
  }, {
    key: "normalizeDecorations",
    value: function normalizeDecorations() {
      this.decorations = this.decorations.filter(function (d) {
        return d.startIndex === d.endIndex;
      });
      this.notifyChange();
    }
  }, {
    key: "getDecorations",
    value: function getDecorations() {
      return clone(this.decorations);
    }
  }, {
    key: "getDecorationsByType",
    value: function getDecorationsByType(type) {
      return clone(this.decorations.filter(function (d) {
        return d.type === type;
      }));
    }
  }, {
    key: "getDecorationsByRange",
    value: function getDecorationsByRange(startIndex, endIndex) {
      startIndex = Math.min(startIndex, endIndex);
      endIndex = Math.max(startIndex, endIndex);
      return clone(this.decorations.filter(function (d) {
        var left = Math.min(d.startIndex, d.endIndex);
        var right = Math.max(d.startIndex, d.endIndex);
        return Math.max(startIndex, left) < Math.min(endIndex, right);
      }));
    }
  }, {
    key: "getSegmentsByRange",
    value: function getSegmentsByRange(startIndex, endIndex) {
      var filter = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : function () {
        return true;
      };
      startIndex = Math.max(startIndex, 0);
      endIndex = Math.min(endIndex, this.text.length);
      var map = {};
      var decorations = this.decorations.filter(filter); // Make markers for the first and last.

      map[startIndex] = startIndex;
      map[endIndex] = endIndex;

      for (var x = 0; x < decorations.length; x++) {
        var decoration = decorations[x];
        var left = Math.min(decoration.startIndex, decoration.endIndex);
        var right = Math.max(decoration.startIndex, decoration.endIndex);

        if (startIndex <= left && endIndex >= left) {
          map[left] = left;
        }

        if (startIndex <= right && endIndex >= right) {
          map[right] = right;
        }
      }

      var segments = Object.keys(map).map(function (v) {
        return Number(v);
      });
      segments.sort(function (a, b) {
        return a - b;
      });
      return segments;
    } //#endregion
    // #region Text Methods

  }, {
    key: "getCharacterLengthForText",
    value: function getCharacterLengthForText(text) {
      return _toConsumableArray(text).length;
    }
  }, {
    key: "getCharacterLength",
    value: function getCharacterLength() {
      return this.getCharacterLengthForText(this.text);
    }
  }, {
    key: "setText",
    value: function setText(text) {
      if (typeof text === 'string') {
        this.text = text;
        this.cursor.startIndex = 0;
        this.cursor.endIndex = 1;
        this.setDecorations([]);
        this.notifyChange();
        this.notifyTextChange();
      }
    }
  }, {
    key: "getText",
    value: function getText() {
      return this.text;
    }
  }, {
    key: "getTextByRange",
    value: function getTextByRange(startIndex, endIndex) {
      var left = Math.min(startIndex, endIndex);
      var right = Math.max(startIndex, endIndex);
      left = Math.max(left, 0);
      right = Math.min(right, this.text.length);
      return this.text.substring(left, right);
    }
  }, {
    key: "replaceText",
    value: function replaceText(startIndex, endIndex) {
      var text = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';
      var left = Math.min(startIndex, endIndex);
      var right = Math.max(startIndex, endIndex);
      left = Math.max(left, 0);
      right = Math.min(right, this.text.length);
      this.text = this.text.slice(0, left) + text + this.text.slice(right);
      this.decorationManager.collapse(left, right);

      if (text.length > 0) {
        this.decorationManager.expand(left, text.length);
      }

      this.notifyChange();
      this.notifyTextChange();
    }
  }, {
    key: "removeText",
    value: function removeText(startIndex, endIndex) {
      this.replaceText(startIndex, endIndex, '');
      this.moveCursor(startIndex);
    }
  }, {
    key: "insert",
    value: function insert(text) {
      var _this3 = this;

      var historyKey = this.disableTracking();
      var notificationKey = this.disableNotifications();
      var selections = this.getRanges();
      var cursorPosition = this.cursor.startIndex;

      if (selections.length > 0) {
        selections.forEach(function (selection) {
          var left = Math.min(selection.startIndex, selection.endIndex);
          var right = Math.max(selection.startIndex, selection.endIndex);

          _this3.replaceText(left, right, text);

          _this3.moveCursor(left + text.length);
        });
        this.removeAllRanges();
      } else {
        this.replaceText(cursorPosition, cursorPosition, text);
        this.moveCursor(cursorPosition + text.length);
      }

      this.enableNotifications(notificationKey);
      this.enableTracking(historyKey);
      this.notifyChange();
      this.notifyTextChange();
    }
  }, {
    key: "backspace",
    value: function backspace() {
      var _this4 = this;

      var historyKey = this.disableTracking();
      var notificationKey = this.disableNotifications();
      var selections = this.getRanges();
      var cursorPosition = this.cursor.startIndex;

      if (selections.length > 0) {
        selections.forEach(function (selection) {
          _this4.removeText(selection.startIndex, selection.endIndex);
        });
        this.removeAllRanges();
      } else {
        if (cursorPosition > 0) {
          this.removeText(cursorPosition - 1, cursorPosition);
        }
      }

      this.enableTracking(historyKey);
      this.enableNotifications(notificationKey);
      this.notifyChange();
      this.notifyTextChange();
    }
  }, {
    key: "delete",
    value: function _delete() {
      var _this5 = this;

      var historyKey = this.disableTracking();
      var notificationKey = this.disableNotifications();
      var selections = this.getRanges();
      var cursorPosition = this.cursor.startIndex;

      if (selections.length > 0) {
        selections.forEach(function (selection) {
          _this5.removeText(selection.startIndex, selection.endIndex);
        });
        this.removeAllRanges();
      } else {
        if (cursorPosition !== this.text.length) {
          this.removeText(cursorPosition, cursorPosition + 1);
        }
      }

      this.enableTracking(historyKey);
      this.enableNotifications(notificationKey);
      this.notifyChange();
      this.notifyTextChange();
    }
  }, {
    key: "getRowInformation",
    value: function getRowInformation() {
      var rows = this.text.split('\n');
      var passed = 0;
      var information = rows.map(function (value) {
        value = value + '\n';
        var row = {
          startIndex: passed,
          endIndex: passed + value.length,
          value: value
        };
        passed += value.length;
        return row;
      });
      return information;
    }
  }, {
    key: "getPositionForIndex",
    value: function getPositionForIndex(index) {
      var rows = this.getRowInformation();
      var row = rows.find(function (r) {
        return index >= r.startIndex && index < r.endIndex;
      });

      if (row != null) {
        var rowIndex = rows.indexOf(row);
        return {
          column: index - row.startIndex,
          row: rowIndex
        };
      }

      return null;
    }
  }, {
    key: "getRowForIndex",
    value: function getRowForIndex(index) {
      var rows = this.getRowInformation();
      return rows.find(function (r) {
        return index >= r.startIndex && index < r.endIndex;
      });
    }
  }, {
    key: "getIndexUpFromIndex",
    value: function getIndexUpFromIndex(fromIndex) {
      var rows = this.getRowInformation();
      var index = rows.findIndex(function (row) {
        return fromIndex >= row.startIndex && fromIndex < row.endIndex;
      });
      var currentRow = rows[index];
      var offset = fromIndex - currentRow.startIndex;
      var previousRow = rows[index - 1];

      if (previousRow) {
        return Math.min(previousRow.startIndex + offset, previousRow.endIndex - 1);
      } else {
        return null;
      }
    }
  }, {
    key: "getIndexDownFromIndex",
    value: function getIndexDownFromIndex(fromIndex) {
      var rows = this.getRowInformation();
      var index = rows.findIndex(function (row) {
        return fromIndex >= row.startIndex && fromIndex < row.endIndex;
      });
      var currentRow = rows[index];
      var offset = fromIndex - currentRow.startIndex;
      var nextRow = rows[index + 1];

      if (nextRow != null) {
        return Math.min(nextRow.startIndex + offset, nextRow.endIndex - 1);
      } else {
        return null;
      }
    }
  }, {
    key: "getNextWordBreakFromIndex",
    value: function getNextWordBreakFromIndex(index) {
      var newIndex = index;

      for (var x = index + 1; x <= this.text.length; x++) {
        var character = this.text.charAt(x);

        if (nonAlphaNumericCharacter.test(character)) {
          newIndex = x;
          break;
        } // We are at the end of the text.


        if (x === this.text.length) {
          newIndex = this.text.length;
          break;
        }
      }

      return newIndex;
    }
  }, {
    key: "getPreviousWordBreakFromIndex",
    value: function getPreviousWordBreakFromIndex(index) {
      var newIndex = index;

      for (var x = index - 1; x >= 0; x--) {
        var character = this.text.charAt(x);

        if (nonAlphaNumericCharacter.test(character)) {
          newIndex = x;
          break;
        } // We are at the beginning of the text.


        if (x === 0) {
          newIndex = x;
          break;
        }
      }

      return newIndex;
    } // #endregion
    // #region Range Methods

  }, {
    key: "addRange",
    value: function addRange(startIndex, endIndex) {
      var key = this.disableTracking();
      this.decorations.push({
        type: 'selection',
        startIndex: startIndex,
        endIndex: endIndex
      });
      this.moveCursor(endIndex);
      this.observable.notify({
        type: 'on-change',
        text: this.text,
        decorations: clone(this.decorations)
      });
      this.enableTracking(key);
    }
  }, {
    key: "removeAllRanges",
    value: function removeAllRanges() {
      var key = this.disableTracking();

      if (this.decorations.findIndex(function (d) {
        return d.type === 'selection';
      }) > -1) {
        this.setDecorations(this.decorations.filter(function (d) {
          return d.type !== 'selection';
        }));
      }

      this.enableTracking(key);
    }
  }, {
    key: "removeRange",
    value: function removeRange(selection) {
      var key = this.disableTracking();

      if (this.decorations.includes(selection)) {
        this.setDecorations(this.decorations.filter(function (d) {
          return d !== selection;
        }));
      }

      this.enableTracking(key);
    }
  }, {
    key: "getRanges",
    value: function getRanges() {
      return this.decorations.filter(function (d) {
        return d.type === 'selection';
      });
    }
  }, {
    key: "hasRanges",
    value: function hasRanges() {
      return this.getRanges().length > 0;
    } //#endregion
    // #region History Methods

  }, {
    key: "undo",
    value: function undo() {
      if (this.historyIndex === 0) {
        return;
      }

      this.historyIndex = this.historyIndex - 1;
      var state = this.history[this.historyIndex];

      if (state != null) {
        var key = this.disableTracking();
        var isSameText = this.text === state.text;
        this.text = state.text;
        this.decorations = state.decorations;
        this.observable.notify(state);

        if (!isSameText) {
          this.observable.notify(Object.assign(Object.assign({}, state), {
            type: 'on-text-change'
          }));
        }

        this.enableTracking(key);
      }
    }
  }, {
    key: "redo",
    value: function redo() {
      if (this.historyIndex === this.history.length - 1) {
        return;
      }

      this.historyIndex = this.historyIndex + 1;
      var state = this.history[this.historyIndex];

      if (state != null) {
        var key = this.disableTracking();
        var isSameText = this.text === state.text;
        this.text = state.text;
        this.decorations = state.decorations;
        this.observable.notify(state);

        if (!isSameText) {
          this.observable.notify(Object.assign(Object.assign({}, state), {
            type: 'on-text-change'
          }));
        }

        this.enableTracking(key);
      }
    }
  }, {
    key: "disableTracking",
    value: function disableTracking() {
      if (!this.trackingDisabled) {
        this.trackingDisabled = true;
        this.trackingKey++;
        return this.trackingKey;
      }

      return null;
    }
  }, {
    key: "enableTracking",
    value: function enableTracking(key) {
      if (key === this.trackingKey) {
        this.trackingDisabled = false;
      }
    } //#endregion
    // #region Event Methods

  }, {
    key: "notify",
    value: function notify(event) {
      return this.observable.notify(event);
    }
  }, {
    key: "observe",
    value: function observe(type, callback) {
      return this.observable.observe(type, callback);
    }
  }, {
    key: "notifyChange",
    value: function notifyChange() {
      if (!this.isMute) {
        var event = {
          type: 'on-change'
        };
        var key = this.disableNotifications();
        this.prepareEventForOnChange(event);
        this.observable.notify(event);
        this.enableNotifications(key);
      }
    }
  }, {
    key: "notifyTextChange",
    value: function notifyTextChange() {
      if (!this.isMute) {
        var event = {
          type: 'on-text-change'
        };
        var key = this.disableNotifications();
        this.prepareEventForOnChange(event);
        this.observable.notify(event);
        this.enableNotifications(key);
      }
    }
  }, {
    key: "disableNotifications",
    value: function disableNotifications() {
      if (!this.isMute) {
        this.isMute = true;
        this.muteKey += 1;
        return this.muteKey;
      }

      return null;
    }
  }, {
    key: "enableNotifications",
    value: function enableNotifications(key) {
      if (this.muteKey === key) {
        this.isMute = false;
      }
    }
  }, {
    key: "prepareEventForOnChange",
    value: function prepareEventForOnChange(event) {
      event.text = this.text;
      event.decorations = clone(this.decorations);
    }
  }, {
    key: "onChange",
    value: function onChange(callback) {
      return this.observable.observe('on-change', callback);
    }
  }, {
    key: "onTextChange",
    value: function onTextChange(callback) {
      return this.observable.observe('on-text-change', callback);
    }
  }, {
    key: "cursor",
    get: function get() {
      return this.decorations.filter(function (d) {
        return d.type === 'cursor';
      })[0];
    }
  }]);

  return TextEditor;
}();

exports.default = TextEditor;
//# sourceMappingURL=TextEditor.js.map