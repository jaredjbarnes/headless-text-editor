(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["headlessTextEditor"] = factory();
	else
		root["headlessTextEditor"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(1);


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _TextEditor_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "TextEditor", function() { return _TextEditor_js__WEBPACK_IMPORTED_MODULE_0__["default"]; });

/* harmony import */ var _browser_BrowserTextEditor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(6);
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "BrowserTextEditor", function() { return _browser_BrowserTextEditor_js__WEBPACK_IMPORTED_MODULE_1__["default"]; });







/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return TextEditor; });
/* harmony import */ var _DecorationManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(3);
/* harmony import */ var _Observable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(4);


const clone = obj => {
    return JSON.parse(JSON.stringify(obj));
};
const nonAlphaNumericCharacter = /[^a-zA-Z]/;
class TextEditor {
    constructor() {
        this.initialize();
    }
    // #region Life Cycle Methods
    initialize() {
        this.text = '';
        this.decorations = [
            {
                type: 'cursor',
                startIndex: 0,
                endIndex: 1,
            },
        ];
        this.decorationManager = new _DecorationManager__WEBPACK_IMPORTED_MODULE_0__["default"](this);
        this.observable = new _Observable__WEBPACK_IMPORTED_MODULE_1__["default"]();
        this.trackingDisabled = false;
        this.history = [];
        this.historyIndex = -1;
        this.trackingKey = 0;
        this.isMute = false;
        this.muteKey = 0;
        this.observable.observe('on-change', event => {
            if (!this.trackingDisabled) {
                this.history = this.history.slice(0, this.historyIndex + 1);
                this.history.push(event);
                this.historyIndex = this.history.length - 1;
                if (this.history.length > 200) {
                    this.history.shift();
                }
            }
        });
    }
    dispose() {
        this.observable.dispose();
        this.initialize();
    }
    //#endregion
    // #region Cursor Methods
    get cursor() {
        return this.decorations.filter(d => d.type === 'cursor')[0];
    }
    getCursor() {
        return Object.assign({}, this.cursor);
    }
    getCharacterAtCursor() {
        return this.text.substring(this.cursor.startIndex, this.cursor.endIndex);
    }
    moveCursorUp() {
        const index = this.getIndexUpFromIndex(this.cursor.startIndex);
        if (index != null) {
            this.moveCursor(index);
        }
    }
    moveCursorDown() {
        const index = this.getIndexDownFromIndex(this.cursor.startIndex);
        if (index != null) {
            this.moveCursor(index);
        }
    }
    moveCursorLeft() {
        this.moveCursor(this.cursor.startIndex - 1);
    }
    moveCursorRight() {
        this.moveCursor(this.cursor.startIndex + 1);
    }
    moveCursor(index) {
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
        const key = this.disableTracking();
        this.notifyChange();
        this.enableTracking(key);
    }
    getCursorPosition() {
        return this.cursor.startIndex;
    }
    moveToDecoration(decoration) {
        if (this.decorations.includes(decoration) && decoration.type !== 'cursor') {
            // This Makes the text sticky by having the cursor history from inside.
            const left = Math.min(decoration.startIndex, decoration.endIndex);
            this.moveCursor(left);
            this.moveCursor(left);
        }
    }
    //#endregion
    // #region Decorations Methods
    addDecoration(decoration) {
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
    replaceDecoration(decoration, newDecoration) {
        if (decoration.type === 'cursor' || newDecoration.type === 'cursor') {
            return;
        }
        const index = this.findDecorationIndex(decoration);
        if (index >= 0) {
            newDecoration.startIndex = Math.max(0, newDecoration.startIndex);
            newDecoration.startIndex = Math.min(newDecoration.startIndex, this.text.length);
            newDecoration.endIndex = Math.max(0, newDecoration.endIndex);
            newDecoration.endIndex = Math.min(newDecoration.endIndex, this.text.length);
            this.decorations.splice(index, 1, newDecoration);
        }
        this.notifyChange();
    }
    findDecorationIndex(decoration) {
        return this.decorations.findIndex(d => d.type === decoration.type &&
            d.startIndex === decoration.startIndex &&
            d.endIndex === decoration.endIndex);
    }
    removeDecoration(decoration) {
        if (decoration.type === 'cursor') {
            return;
        }
        const index = this.findDecorationIndex(decoration);
        if (index >= 0) {
            this.decorations.splice(index, 1);
        }
        this.notifyChange();
    }
    setDecorations(decorations) {
        const key = this.disableTracking();
        this.decorations = this.decorations.filter(d => d.type === 'cursor');
        decorations.forEach(decoration => {
            this.addDecoration(decoration);
        });
        this.notifyChange();
        this.enableTracking(key);
    }
    normalizeDecorations() {
        this.decorations = this.decorations.filter(d => d.startIndex === d.endIndex);
        this.notifyChange();
    }
    getDecorations() {
        return clone(this.decorations);
    }
    getDecorationsByType(type) {
        return clone(this.decorations.filter(d => d.type === type));
    }
    getDecorationsByRange(startIndex, endIndex) {
        startIndex = Math.min(startIndex, endIndex);
        endIndex = Math.max(startIndex, endIndex);
        return clone(this.decorations.filter(d => {
            const left = Math.min(d.startIndex, d.endIndex);
            const right = Math.max(d.startIndex, d.endIndex);
            return Math.max(startIndex, left) < Math.min(endIndex, right);
        }));
    }
    getSegmentsByRange(startIndex, endIndex, filter = () => true) {
        startIndex = Math.max(startIndex, 0);
        endIndex = Math.min(endIndex, this.text.length);
        const map = {};
        const decorations = this.decorations.filter(filter);
        // Make markers for the first and last.
        map[startIndex] = startIndex;
        map[endIndex] = endIndex;
        for (let x = 0; x < decorations.length; x++) {
            const decoration = decorations[x];
            const left = Math.min(decoration.startIndex, decoration.endIndex);
            const right = Math.max(decoration.startIndex, decoration.endIndex);
            if (startIndex <= left && endIndex >= left) {
                map[left] = left;
            }
            if (startIndex <= right && endIndex >= right) {
                map[right] = right;
            }
        }
        const segments = Object.keys(map).map(v => {
            return Number(v);
        });
        segments.sort((a, b) => a - b);
        return segments;
    }
    //#endregion
    // #region Text Methods
    getCharacterLengthForText(text) {
        return [...text].length;
    }
    getCharacterLength() {
        return this.getCharacterLengthForText(this.text);
    }
    setText(text) {
        if (typeof text === 'string') {
            this.text = text;
            this.cursor.startIndex = 0;
            this.cursor.endIndex = 1;
            this.setDecorations([]);
            this.notifyChange();
            this.notifyTextChange();
        }
    }
    getText() {
        return this.text;
    }
    getTextByRange(startIndex, endIndex) {
        let left = Math.min(startIndex, endIndex);
        let right = Math.max(startIndex, endIndex);
        left = Math.max(left, 0);
        right = Math.min(right, this.text.length);
        return this.text.substring(left, right);
    }
    replaceText(startIndex, endIndex, text = '') {
        let left = Math.min(startIndex, endIndex);
        let right = Math.max(startIndex, endIndex);
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
    removeText(startIndex, endIndex) {
        this.replaceText(startIndex, endIndex, '');
        this.moveCursor(startIndex);
    }
    insert(text) {
        const historyKey = this.disableTracking();
        const notificationKey = this.disableNotifications();
        const selections = this.getRanges();
        const cursorPosition = this.cursor.startIndex;
        if (selections.length > 0) {
            selections.forEach(selection => {
                const left = Math.min(selection.startIndex, selection.endIndex);
                const right = Math.max(selection.startIndex, selection.endIndex);
                this.replaceText(left, right, text);
                this.moveCursor(left + text.length);
            });
            this.removeAllRanges();
        }
        else {
            this.replaceText(cursorPosition, cursorPosition, text);
            this.moveCursor(cursorPosition + text.length);
        }
        this.enableNotifications(notificationKey);
        this.enableTracking(historyKey);
        this.notifyChange();
        this.notifyTextChange();
    }
    backspace() {
        const historyKey = this.disableTracking();
        const notificationKey = this.disableNotifications();
        const selections = this.getRanges();
        const cursorPosition = this.cursor.startIndex;
        if (selections.length > 0) {
            selections.forEach(selection => {
                this.removeText(selection.startIndex, selection.endIndex);
            });
            this.removeAllRanges();
        }
        else {
            if (cursorPosition > 0) {
                this.removeText(cursorPosition - 1, cursorPosition);
            }
        }
        this.enableTracking(historyKey);
        this.enableNotifications(notificationKey);
        this.notifyChange();
        this.notifyTextChange();
    }
    delete() {
        const historyKey = this.disableTracking();
        const notificationKey = this.disableNotifications();
        const selections = this.getRanges();
        const cursorPosition = this.cursor.startIndex;
        if (selections.length > 0) {
            selections.forEach(selection => {
                this.removeText(selection.startIndex, selection.endIndex);
            });
            this.removeAllRanges();
        }
        else {
            if (cursorPosition !== this.text.length) {
                this.removeText(cursorPosition, cursorPosition + 1);
            }
        }
        this.enableTracking(historyKey);
        this.enableNotifications(notificationKey);
        this.notifyChange();
        this.notifyTextChange();
    }
    getRowInformation() {
        const rows = this.text.split('\n');
        let passed = 0;
        const information = rows.map(value => {
            value = value + '\n';
            const row = {
                startIndex: passed,
                endIndex: passed + value.length,
                value,
            };
            passed += value.length;
            return row;
        });
        return information;
    }
    getPositionForIndex(index) {
        const rows = this.getRowInformation();
        const row = rows.find(r => index >= r.startIndex && index < r.endIndex);
        if (row != null) {
            const rowIndex = rows.indexOf(row);
            return {
                column: index - row.startIndex,
                row: rowIndex,
            };
        }
        return null;
    }
    getRowForIndex(index) {
        const rows = this.getRowInformation();
        return rows.find(r => index >= r.startIndex && index < r.endIndex);
    }
    getIndexUpFromIndex(fromIndex) {
        const rows = this.getRowInformation();
        const index = rows.findIndex(row => {
            return fromIndex >= row.startIndex && fromIndex < row.endIndex;
        });
        const currentRow = rows[index];
        const offset = fromIndex - currentRow.startIndex;
        const previousRow = rows[index - 1];
        if (previousRow) {
            return Math.min(previousRow.startIndex + offset, previousRow.endIndex - 1);
        }
        else {
            return null;
        }
    }
    getIndexDownFromIndex(fromIndex) {
        const rows = this.getRowInformation();
        const index = rows.findIndex(row => {
            return fromIndex >= row.startIndex && fromIndex < row.endIndex;
        });
        const currentRow = rows[index];
        const offset = fromIndex - currentRow.startIndex;
        const nextRow = rows[index + 1];
        if (nextRow != null) {
            return Math.min(nextRow.startIndex + offset, nextRow.endIndex - 1);
        }
        else {
            return null;
        }
    }
    getNextWordBreakFromIndex(index) {
        let newIndex = index;
        for (let x = index + 1; x <= this.text.length; x++) {
            const character = this.text.charAt(x);
            if (nonAlphaNumericCharacter.test(character)) {
                newIndex = x;
                break;
            }
            // We are at the end of the text.
            if (x === this.text.length) {
                newIndex = this.text.length;
                break;
            }
        }
        return newIndex;
    }
    getPreviousWordBreakFromIndex(index) {
        let newIndex = index;
        for (let x = index - 1; x >= 0; x--) {
            const character = this.text.charAt(x);
            if (nonAlphaNumericCharacter.test(character)) {
                newIndex = x;
                break;
            }
            // We are at the beginning of the text.
            if (x === 0) {
                newIndex = x;
                break;
            }
        }
        return newIndex;
    }
    // #endregion
    // #region Range Methods
    addRange(startIndex, endIndex) {
        const key = this.disableTracking();
        this.decorations.push({
            type: 'selection',
            startIndex: startIndex,
            endIndex: endIndex,
        });
        this.moveCursor(endIndex);
        this.observable.notify({
            type: 'on-change',
            text: this.text,
            decorations: clone(this.decorations),
        });
        this.enableTracking(key);
    }
    removeAllRanges() {
        const key = this.disableTracking();
        if (this.decorations.findIndex(d => d.type === 'selection') > -1) {
            this.setDecorations(this.decorations.filter(d => d.type !== 'selection'));
        }
        this.enableTracking(key);
    }
    removeRange(selection) {
        const key = this.disableTracking();
        if (this.decorations.includes(selection)) {
            this.setDecorations(this.decorations.filter(d => d !== selection));
        }
        this.enableTracking(key);
    }
    getRanges() {
        return this.decorations.filter(d => d.type === 'selection');
    }
    hasRanges() {
        return this.getRanges().length > 0;
    }
    //#endregion
    // #region History Methods
    undo() {
        if (this.historyIndex === 0) {
            return;
        }
        this.historyIndex = this.historyIndex - 1;
        const state = this.history[this.historyIndex];
        if (state != null) {
            const key = this.disableTracking();
            const isSameText = this.text === state.text;
            this.text = state.text;
            this.decorations = state.decorations;
            this.observable.notify(state);
            if (!isSameText) {
                this.observable.notify(Object.assign(Object.assign({}, state), { type: 'on-text-change' }));
            }
            this.enableTracking(key);
        }
    }
    redo() {
        if (this.historyIndex === this.history.length - 1) {
            return;
        }
        this.historyIndex = this.historyIndex + 1;
        const state = this.history[this.historyIndex];
        if (state != null) {
            const key = this.disableTracking();
            const isSameText = this.text === state.text;
            this.text = state.text;
            this.decorations = state.decorations;
            this.observable.notify(state);
            if (!isSameText) {
                this.observable.notify(Object.assign(Object.assign({}, state), { type: 'on-text-change' }));
            }
            this.enableTracking(key);
        }
    }
    disableTracking() {
        if (!this.trackingDisabled) {
            this.trackingDisabled = true;
            this.trackingKey++;
            return this.trackingKey;
        }
        return null;
    }
    enableTracking(key) {
        if (key === this.trackingKey) {
            this.trackingDisabled = false;
        }
    }
    //#endregion
    // #region Event Methods
    notify(event) {
        return this.observable.notify(event);
    }
    observe(type, callback) {
        return this.observable.observe(type, callback);
    }
    notifyChange() {
        if (!this.isMute) {
            const event = {
                type: 'on-change',
            };
            const key = this.disableNotifications();
            this.prepareEventForOnChange(event);
            this.observable.notify(event);
            this.enableNotifications(key);
        }
    }
    notifyTextChange() {
        if (!this.isMute) {
            const event = {
                type: 'on-text-change',
            };
            const key = this.disableNotifications();
            this.prepareEventForOnChange(event);
            this.observable.notify(event);
            this.enableNotifications(key);
        }
    }
    disableNotifications() {
        if (!this.isMute) {
            this.isMute = true;
            this.muteKey += 1;
            return this.muteKey;
        }
        return null;
    }
    enableNotifications(key) {
        if (this.muteKey === key) {
            this.isMute = false;
        }
    }
    prepareEventForOnChange(event) {
        event.text = this.text;
        event.decorations = clone(this.decorations);
    }
    onChange(callback) {
        return this.observable.observe('on-change', callback);
    }
    onTextChange(callback) {
        return this.observable.observe('on-text-change', callback);
    }
}


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return DecorationManager; });
class DecorationManager {
    constructor(editor) {
        this.editor = editor;
        this.range = {
            startIndex: 0,
            endIndex: 0,
        };
        this.decorationPositions = new WeakMap();
    }
    adjustBothSides(decoration, leftAmount, rightAmount) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.startIndex += leftAmount;
            decoration.endIndex += rightAmount;
        }
        else {
            decoration.startIndex += rightAmount;
            decoration.endIndex += leftAmount;
        }
    }
    assignBothSides(decoration, leftValue, rightValue) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.startIndex = leftValue;
            decoration.endIndex = rightValue;
        }
        else {
            decoration.startIndex = rightValue;
            decoration.endIndex = leftValue;
        }
    }
    adjustLeftSide(decoration, amount) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.startIndex += amount;
        }
        else {
            decoration.endIndex += amount;
        }
    }
    adjustRightSide(decoration, amount) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.endIndex += amount;
        }
        else {
            decoration.startIndex += amount;
        }
    }
    assignRightSide(decoration, value) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.endIndex = value;
        }
        else {
            decoration.startIndex = value;
        }
    }
    assignLeftSide(decoration, value) {
        if (decoration.startIndex < decoration.endIndex) {
            decoration.startIndex = value;
        }
        else {
            decoration.endIndex = value;
        }
    }
    isRangeOnLeftSideOfDecoration(decoration) {
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        return (this.range.startIndex === this.range.endIndex && this.range.startIndex === left);
    }
    isRangeOnRightSideOfDecoration(decoration) {
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        return (this.range.startIndex === this.range.endIndex && this.range.startIndex === right);
    }
    isDecorationLeftOfTheRange(decoration) {
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        return right <= this.range.startIndex;
    }
    isDecorationRightOfTheRange(decoration) {
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        return left >= this.range.endIndex;
    }
    isDecorationWithinTheRange(decoration) {
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        return this.range.startIndex <= left && this.range.endIndex >= right;
    }
    doesDecorationSurroundTheRange(decoration) {
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        return this.range.startIndex >= left && this.range.endIndex <= right;
    }
    doesRangeOverlapLeftSideOfDecoration(decoration) {
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        return this.range.startIndex < left && this.range.endIndex > left;
    }
    doesRangeOverlapRightSideOfDecoration(decoration) {
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        return this.range.startIndex < right && this.range.endIndex > right;
    }
    isSticky(decoration) {
        const positions = this.decorationPositions.get(decoration);
        const left = Math.min(decoration.startIndex, decoration.endIndex);
        const right = Math.max(decoration.startIndex, decoration.endIndex);
        if (positions &&
            !positions.includes('right') &&
            !positions.includes('left') &&
            positions.filter(p => p === 'on-left-boundary').length < 2) {
            return true;
        }
        if (this.editor.cursor.startIndex > left && this.editor.cursor.startIndex < right) {
            return true;
        }
        return false;
    }
    saveDecorationPosition(decoration, position) {
        let positions = this.decorationPositions.get(decoration);
        if (positions == null) {
            positions = [];
            this.decorationPositions.set(decoration, positions);
        }
        positions.push(position);
        if (positions.length > 2) {
            positions.shift();
        }
    }
    collapse(startIndex, endIndex) {
        this.range.startIndex = Math.min(startIndex, endIndex);
        this.range.endIndex = Math.max(startIndex, endIndex);
        const amount = this.range.startIndex - this.range.endIndex;
        const decorations = this.editor.decorations.filter(d => d.type !== 'cursor');
        decorations.forEach(decoration => {
            if (this.isDecorationLeftOfTheRange(decoration)) {
                // Do Nothing.
                //console.log("left of range");
            }
            else if (this.isDecorationRightOfTheRange(decoration)) {
                //console.log("right of range");
                this.adjustBothSides(decoration, amount, amount);
            }
            else if (this.isDecorationWithinTheRange(decoration)) {
                //console.log("is within");
                this.assignBothSides(decoration, startIndex, startIndex);
            }
            else if (this.doesDecorationSurroundTheRange(decoration)) {
                this.adjustRightSide(decoration, amount);
            }
            else if (this.doesRangeOverlapLeftSideOfDecoration(decoration)) {
                //console.log("is left overlap");
                const overlap = endIndex - decoration.startIndex;
                const originalSize = decoration.endIndex - decoration.startIndex;
                this.assignBothSides(decoration, startIndex, startIndex + originalSize - overlap);
            }
            else if (this.doesRangeOverlapRightSideOfDecoration(decoration)) {
                this.assignRightSide(decoration, startIndex);
            }
            else {
                //console.log("Shouldn't get here.", decoration);
            }
            decoration.startIndex = Math.max(0, decoration.startIndex);
            decoration.startIndex = Math.min(this.editor.text.length, decoration.startIndex);
            decoration.endIndex = Math.max(0, decoration.endIndex);
            decoration.endIndex = Math.min(this.editor.text.length, decoration.endIndex);
        });
    }
    expand(onIndex, amount) {
        this.range.startIndex = onIndex;
        this.range.endIndex = onIndex;
        const decorations = this.editor.decorations.filter(d => d.type !== 'cursor');
        decorations.forEach(decoration => {
            if (this.isSticky(decoration)) {
                if (this.isRangeOnLeftSideOfDecoration(decoration)) {
                    //console.log("sticky on left boundary");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.isRangeOnRightSideOfDecoration(decoration)) {
                    //console.log("sticky on right boundary");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.isDecorationWithinTheRange(decoration)) {
                    //console.log("sticky within");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.doesDecorationSurroundTheRange(decoration)) {
                    //console.log("sticky surrounds range");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.isDecorationRightOfTheRange(decoration)) {
                    //console.log("sticky is right of range");
                    this.adjustBothSides(decoration, amount, amount);
                }
                else if (this.isDecorationLeftOfTheRange(decoration)) {
                    //console.log("non-sticky is left of range");
                    // Do nothing
                }
                else {
                    //console.log('sticky', this.range, decoration);
                }
            }
            else {
                if (this.isRangeOnLeftSideOfDecoration(decoration)) {
                    //console.log("non-sticky on left boundary");
                    this.adjustBothSides(decoration, amount, amount);
                }
                else if (this.isRangeOnRightSideOfDecoration(decoration)) {
                    //console.log("non-sticky on right boundary");
                    // Do nothing
                }
                else if (this.isDecorationWithinTheRange(decoration)) {
                    //console.log("non-sticky within");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.doesDecorationSurroundTheRange(decoration)) {
                    //console.log("non-sticky surrounds range");
                    this.adjustRightSide(decoration, amount);
                }
                else if (this.isDecorationRightOfTheRange(decoration)) {
                    //console.log("non-sticky is right of range");
                    this.adjustBothSides(decoration, amount, amount);
                }
                else if (this.isDecorationLeftOfTheRange(decoration)) {
                    //console.log("non-sticky is left of range");
                    // Do nothing
                }
                else {
                    //console.log('non-sticky', this.range, decoration);
                }
            }
        });
    }
    saveDecorationPlacementHistory() {
        this.range.startIndex = this.editor.cursor.startIndex;
        this.range.endIndex = this.editor.cursor.startIndex;
        const decorations = this.editor.decorations.filter(d => d.type !== 'cursor');
        decorations.forEach(decoration => {
            if (this.isRangeOnLeftSideOfDecoration(decoration)) {
                this.saveDecorationPosition(decoration, 'on-left-boundary');
            }
            else if (this.isRangeOnRightSideOfDecoration(decoration)) {
                this.saveDecorationPosition(decoration, 'on-right-boundary');
            }
            else if (this.doesDecorationSurroundTheRange(decoration)) {
                this.saveDecorationPosition(decoration, 'surrounds');
            }
            else if (this.isDecorationRightOfTheRange(decoration)) {
                this.saveDecorationPosition(decoration, 'right');
            }
            else if (this.isDecorationLeftOfTheRange(decoration)) {
                this.saveDecorationPosition(decoration, 'left');
            }
            else {
                //console.log('saveDecorationPlacementHistory', this.range, decoration);
            }
        });
    }
}


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Observable; });
/* harmony import */ var _Observer__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5);

class Observable {
    constructor() {
        this.observers = [];
    }
    observe(type, callback) {
        const observer = new _Observer__WEBPACK_IMPORTED_MODULE_0__["default"](type, callback, () => {
            const index = this.observers.indexOf(observer);
            if (index > -1) {
                this.observers.splice(index, 1);
            }
        });
        this.observers.push(observer);
        return observer;
    }
    notify(event) {
        this.observers.forEach(observer => {
            observer.notify(event);
        });
    }
    dispose() {
        this.observers = [];
    }
}


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Observer; });
const states = {
    ACTIVE: 1,
    STOPPED: 0,
    DISPOSED: -1,
};
class Observer {
    constructor(type, callback, unbind) {
        this.type = type;
        this.callback = callback;
        this.unbind = unbind;
        this.state = states.ACTIVE;
    }
    notify(event) {
        if (event.type === this.type) {
            this.callback(event);
        }
    }
    stop() {
        if (this.state === states.ACTIVE) {
            this.state = states.STOPPED;
        }
    }
    start() {
        if (this.state !== states.DISPOSED) {
            this.state = states.ACTIVE;
        }
    }
    dispose() {
        this.state = states.DISPOSED;
        this.unbind();
    }
}


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return BrowserTextEditor; });
/* harmony import */ var _TextEditor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2);
/* harmony import */ var _namedKeys__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7);
/* harmony import */ var _defaultMode__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(8);
/* harmony import */ var _modifierKeys__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(9);




class BrowserTextEditor extends _TextEditor__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor({ keyDownDelegate } = {}) {
        super();
        this.keydownDelegate = keyDownDelegate;
        this.onPaste = this.onPaste.bind(this);
        this.onCut = this.onCut.bind(this);
        this.onCopy = this.onCopy.bind(this);
        this.keydown = this.keydown.bind(this);
    }
    onPaste(event) {
        const text = event.clipboardData.getData('text');
        this.invokeHandler('paste', [this, text, event]);
        event.preventDefault();
    }
    onCopy(event) {
        const text = this.invokeHandler('copy', [this, event]);
        if (typeof text === 'string') {
            event.clipboardData.setData('text/plain', text);
        }
        event.preventDefault();
    }
    onCut(event) {
        const text = this.invokeHandler('cut', [this, event]);
        if (typeof text === 'string') {
            event.clipboardData.setData('text/plain', text);
        }
        event.preventDefault();
    }
    setKeydownDelegate(delegate) {
        this.keydownDelegate = delegate;
    }
    keydown(event) {
        const keyInformation = this.createKey(event);
        this.invokeKeyHandler(keyInformation, event);
    }
    createKey(event) {
        const parts = [];
        if (event.ctrlKey) {
            parts.push('Ctrl');
        }
        if (event.metaKey) {
            parts.push('Meta');
        }
        if (event.altKey) {
            parts.push('Alt');
        }
        if (event.shiftKey && (parts.length > 0 || _namedKeys__WEBPACK_IMPORTED_MODULE_1__["default"][event.key])) {
            parts.push('Shift');
        }
        if (!_modifierKeys__WEBPACK_IMPORTED_MODULE_3__["default"][event.key]) {
            parts.push(event.key);
        }
        const key = parts.join('+');
        return {
            isCommand: parts.length > 1,
            isNamedKey: _namedKeys__WEBPACK_IMPORTED_MODULE_1__["default"][event.key],
            originalKey: event.key,
            key,
        };
    }
    invokeKeyHandler(keyInformation, event) {
        const keyEvent = {
            type: keyInformation.key,
            preventDefault: false,
            keyInformation,
            domEvent: event,
        };
        this.notify(keyEvent);
        if (keyEvent.preventDefault) {
            event.preventDefault();
            return;
        }
        if (!keyInformation.isCommand && !keyInformation.isNamedKey) {
            this.invokeHandler('keydown', [this, keyInformation.originalKey, event]);
        }
        else {
            const key = keyInformation.key;
            this.invokeHandler(key, [this, event]);
        }
    }
    invokeHandler(name, args) {
        if (this.keydownDelegate != null &&
            typeof this.keydownDelegate[name] === 'function') {
            return this.keydownDelegate[name].apply(null, args);
        }
        else if (typeof _defaultMode__WEBPACK_IMPORTED_MODULE_2__["default"][name] === 'function') {
            return _defaultMode__WEBPACK_IMPORTED_MODULE_2__["default"][name].apply(null, args);
        }
    }
}


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// These are all the known NamedKeys within w3 spec on keydown events.
// https://www.w3.org/TR/uievents-key/
const namedKeys = {
    AVRInput: true,
    AVRPower: true,
    Accept: true,
    Again: true,
    AllCandidates: true,
    Alphanumeric: true,
    Alt: true,
    AltGraph: true,
    AppSwitch: true,
    ArrowDown: true,
    ArrowLeft: true,
    ArrowRight: true,
    ArrowUp: true,
    Attn: true,
    AudioBalanceLeft: true,
    AudioBalanceRight: true,
    AudioBassBoostDown: true,
    AudioBassBoostToggle: true,
    AudioBassBoostUp: true,
    AudioFaderFront: true,
    AudioFaderRear: true,
    AudioSurroundModeNext: true,
    AudioTrebleDown: true,
    AudioTrebleUp: true,
    AudioVolumeDown: true,
    AudioVolumeMute: true,
    AudioVolumeUp: true,
    Backspace: true,
    BrightnessDown: true,
    BrightnessUp: true,
    BrowserBack: true,
    BrowserFavorites: true,
    BrowserForward: true,
    BrowserHome: true,
    BrowserRefresh: true,
    BrowserSearch: true,
    BrowserStop: true,
    Call: true,
    Camera: true,
    CameraFocus: true,
    Cancel: true,
    CapsLock: true,
    ChannelDown: true,
    ChannelUp: true,
    Clear: true,
    Close: true,
    ClosedCaptionToggle: true,
    CodeInput: true,
    ColorF0Red: true,
    ColorF1Green: true,
    ColorF2Yellow: true,
    ColorF3Blue: true,
    ColorF4Grey: true,
    ColorF5Brown: true,
    Compose: true,
    ContextMenu: true,
    Control: true,
    Convert: true,
    Copy: true,
    CrSel: true,
    Cut: true,
    DVR: true,
    Dead: true,
    Delete: true,
    Dimmer: true,
    DisplaySwap: true,
    Eisu: true,
    Eject: true,
    End: true,
    EndCall: true,
    Enter: true,
    EraseEof: true,
    Escape: true,
    ExSel: true,
    Execute: true,
    Exit: true,
    F1: true,
    F10: true,
    F11: true,
    F12: true,
    F2: true,
    F24: true,
    F3: true,
    F4: true,
    F5: true,
    F6: true,
    F7: true,
    F8: true,
    F9: true,
    FavoriteClear0: true,
    FavoriteClear1: true,
    FavoriteClear2: true,
    FavoriteClear3: true,
    FavoriteRecall0: true,
    FavoriteRecall1: true,
    FavoriteRecall2: true,
    FavoriteRecall3: true,
    FavoriteStore0: true,
    FavoriteStore1: true,
    FavoriteStore2: true,
    FavoriteStore3: true,
    FinalMode: true,
    Find: true,
    Fn: true,
    FnLock: true,
    GoBack: true,
    GoHome: true,
    GroupFirst: true,
    GroupLast: true,
    GroupNext: true,
    GroupPrevious: true,
    Guide: true,
    GuideNextDay: true,
    GuidePreviousDay: true,
    HangulMode: true,
    HanjaMode: true,
    Hankaku: true,
    HeadsetHook: true,
    Help: true,
    Hibernate: true,
    Hiragana: true,
    HiraganaKatakana: true,
    Home: true,
    Hyper: true,
    Info: true,
    Insert: true,
    InstantReplay: true,
    JunjaMode: true,
    KanaMode: true,
    KanjiMode: true,
    Katakana: true,
    Key11: true,
    Key12: true,
    LastNumberRedial: true,
    LaunchApplication1: true,
    LaunchApplication2: true,
    LaunchCalendar: true,
    LaunchContacts: true,
    LaunchMail: true,
    LaunchMediaPlayer: true,
    LaunchMusicPlayer: true,
    LaunchPhone: true,
    LaunchScreenSaver: true,
    LaunchSpreadsheet: true,
    LaunchWebBrowser: true,
    LaunchWebCam: true,
    LaunchWordProcessor: true,
    Link: true,
    ListProgram: true,
    LiveContent: true,
    Lock: true,
    LogOff: true,
    MailForward: true,
    MailReply: true,
    MailSend: true,
    MannerMode: true,
    MediaApps: true,
    MediaAudioTrack: true,
    MediaClose: true,
    MediaFastForward: true,
    MediaLast: true,
    MediaNextTrack: true,
    MediaPause: true,
    MediaPlay: true,
    MediaPlayPause: true,
    MediaPreviousTrack: true,
    MediaRecord: true,
    MediaRewind: true,
    MediaSkipBackward: true,
    MediaSkipForward: true,
    MediaStepBackward: true,
    MediaStepForward: true,
    MediaStop: true,
    MediaTopMenu: true,
    MediaTrackNext: true,
    MediaTrackPrevious: true,
    Meta: true,
    MicrophoneToggle: true,
    MicrophoneVolumeDown: true,
    MicrophoneVolumeMute: true,
    MicrophoneVolumeUp: true,
    ModeChange: true,
    NavigateIn: true,
    NavigateNext: true,
    NavigateOut: true,
    NavigatePrevious: true,
    New: true,
    NextCandidate: true,
    NextFavoriteChannel: true,
    NextUserProfile: true,
    NonConvert: true,
    Notification: true,
    NumLock: true,
    OnDemand: true,
    Open: true,
    PageDown: true,
    PageUp: true,
    Pairing: true,
    Paste: true,
    Pause: true,
    PinPDown: true,
    PinPMove: true,
    PinPToggle: true,
    PinPUp: true,
    Play: true,
    PlaySpeedDown: true,
    PlaySpeedReset: true,
    PlaySpeedUp: true,
    Power: true,
    PowerOff: true,
    PreviousCandidate: true,
    Print: true,
    PrintScreen: true,
    Process: true,
    Props: true,
    RandomToggle: true,
    RcLowBattery: true,
    RecordSpeedNext: true,
    Redo: true,
    RfBypass: true,
    Romaji: true,
    STBInput: true,
    STBPower: true,
    Save: true,
    ScanChannelsToggle: true,
    ScreenModeNext: true,
    ScrollLock: true,
    Select: true,
    Settings: true,
    Shift: true,
    SingleCandidate: true,
    Soft1: true,
    Soft2: true,
    Soft3: true,
    Soft4: true,
    Soft8: true,
    SpeechCorrectionList: true,
    SpeechInputToggle: true,
    SpellCheck: true,
    SplitScreenToggle: true,
    Standby: true,
    Subtitle: true,
    Super: true,
    Symbol: true,
    SymbolLock: true,
    TV: true,
    TV3DMode: true,
    TVAntennaCable: true,
    TVAudioDescription: true,
    TVAudioDescriptionMixDown: true,
    TVAudioDescriptionMixUp: true,
    TVContentsMenu: true,
    TVDataService: true,
    TVInput: true,
    TVInputComponent1: true,
    TVInputComponent2: true,
    TVInputComposite1: true,
    TVInputComposite2: true,
    TVInputHDMI1: true,
    TVInputHDMI2: true,
    TVInputHDMI3: true,
    TVInputHDMI4: true,
    TVInputVGA1: true,
    TVMediaContext: true,
    TVNetwork: true,
    TVNumberEntry: true,
    TVPower: true,
    TVRadioService: true,
    TVSatellite: true,
    TVSatelliteBS: true,
    TVSatelliteCS: true,
    TVSatelliteToggle: true,
    TVTerrestrialAnalog: true,
    TVTerrestrialDigital: true,
    TVTimer: true,
    Tab: true,
    Teletext: true,
    Undo: true,
    Unidentified: true,
    VideoModeNext: true,
    VoiceDial: true,
    WakeUp: true,
    Wink: true,
    Zenkaku: true,
    ZenkakuHankaku: true,
    ZoomIn: true,
    ZoomOut: true,
    ZoomToggle: true,
};
/* harmony default export */ __webpack_exports__["default"] = (namedKeys);


/***/ }),
/* 8 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ({
    paste: function (editor, text) {
        editor.insert(text);
        editor.removeAllRanges();
    },
    cut: function (editor) {
        const selection = editor.getDecorations().filter(d => d.type === 'selection')[0];
        if (selection != null) {
            const text = editor.getTextByRange(selection.startIndex, selection.endIndex);
            editor.delete();
            return text;
        }
        return null;
    },
    copy: function (editor) {
        const selection = editor.getDecorations().filter(d => d.type === 'selection')[0];
        if (selection != null) {
            return editor.getTextByRange(selection.startIndex, selection.endIndex);
        }
        return null;
    },
    keydown: function (editor, key) {
        editor.insert(key);
        editor.removeAllRanges();
    },
    'Meta+a': function (editor, event) {
        editor.removeAllRanges();
        editor.addRange(0, editor.text.length);
        event.preventDefault();
    },
    'Ctrl+a': function (editor, event) {
        editor.removeAllRanges();
        editor.addRange(0, editor.text.length);
        event.preventDefault();
    },
    'Meta+z': function (editor, event) {
        editor.undo();
        event.preventDefault();
    },
    'Ctrl+z': function (editor, event) {
        editor.undo();
        event.preventDefault();
    },
    'Meta+Shift+z': function (editor, event) {
        editor.redo();
        event.preventDefault();
    },
    'Ctrl+Shift+z': function (editor, event) {
        editor.redo();
        event.preventDefault();
    },
    ArrowLeft: function (editor) {
        const editorSelections = editor.decorations.filter(d => d.type === 'selection');
        editor.removeAllRanges();
        if (editorSelections.length > 0) {
            const left = Math.min(editorSelections[0].endIndex, editorSelections[0].startIndex);
            editor.moveCursor(left);
        }
        else {
            editor.moveCursorLeft();
        }
    },
    ArrowRight: function (editor) {
        const editorSelections = editor.decorations.filter(d => d.type === 'selection');
        editor.removeAllRanges();
        if (editorSelections.length > 0) {
            const right = Math.max(editorSelections[0].endIndex, editorSelections[0].startIndex);
            editor.moveCursor(right);
        }
        else {
            editor.moveCursorRight();
        }
    },
    ArrowUp: function (editor) {
        editor.removeAllRanges();
        editor.moveCursorUp();
    },
    ArrowDown: function (editor) {
        editor.removeAllRanges();
        editor.moveCursorDown();
    },
    Backspace: function (editor) {
        editor.backspace();
        editor.removeAllRanges();
    },
    Delete: function (editor) {
        editor.delete();
        editor.removeAllRanges();
    },
    Enter: function (editor) {
        editor.insert('\n');
        editor.removeAllRanges();
    },
    'Meta+Shift+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        if (row != null) {
            editor.removeAllRanges();
            editor.addRange(startIndex, row.startIndex);
        }
    },
    'Ctrl+Shift+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        if (row != null) {
            editor.removeAllRanges();
            editor.addRange(startIndex, row.startIndex);
        }
    },
    'Meta+Shift+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        if (row != null) {
            editor.removeAllRanges();
            editor.addRange(startIndex, row.endIndex - 1);
        }
    },
    'Ctrl+Shift+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        if (row != null) {
            editor.removeAllRanges();
            editor.addRange(startIndex, row.endIndex - 1);
        }
    },
    'Alt+Shift+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const nextIndex = editor.getNextWordBreakFromIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (nextIndex == null) {
            return;
        }
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, nextIndex);
    },
    'Alt+Shift+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const nextIndex = editor.getPreviousWordBreakFromIndex(cursor.startIndex);
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (nextIndex == null) {
            return;
        }
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, nextIndex);
    },
    'Shift+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, cursor.endIndex);
    },
    'Shift+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, cursor.startIndex - 1);
    },
    'Shift+ArrowUp': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        const endIndex = editor.getIndexUpFromIndex(cursor.startIndex);
        let startIndex = cursor.startIndex;
        if (endIndex == null) {
            return;
        }
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, endIndex);
    },
    'Shift+ArrowDown': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        const endIndex = editor.getIndexDownFromIndex(cursor.startIndex);
        let startIndex = cursor.startIndex;
        if (endIndex == null) {
            return;
        }
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, endIndex);
    },
    'Meta+Shift+ArrowDown': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, editor.getText().length);
    },
    'Meta+Shift+ArrowUp': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, 0);
    },
    'Ctrl+Shift+ArrowDown': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, editor.getText().length);
    },
    'Ctrl+Shift+ArrowUp': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, 0);
    },
    'Alt+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const index = editor.getPreviousWordBreakFromIndex(cursor.startIndex);
        editor.removeAllRanges();
        editor.moveCursor(index);
    },
    'Alt+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const index = editor.getNextWordBreakFromIndex(cursor.startIndex);
        editor.removeAllRanges();
        editor.moveCursor(index);
    },
    'Meta+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        editor.removeAllRanges();
        if (row) {
            editor.moveCursor(row.startIndex);
        }
    },
    'Meta+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        editor.removeAllRanges();
        if (row) {
            editor.moveCursor(row.endIndex - 1);
        }
    },
    'Ctrl+ArrowLeft': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        editor.removeAllRanges();
        if (row) {
            editor.moveCursor(row.startIndex);
        }
    },
    'Ctrl+ArrowRight': function (editor) {
        const cursor = editor.getCursor();
        const row = editor.getRowForIndex(cursor.startIndex);
        editor.removeAllRanges();
        if (row) {
            editor.moveCursor(row.endIndex - 1);
        }
    },
    'Meta+ArrowUp': function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(0);
    },
    'Meta+ArrowDown': function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(editor.text.length);
    },
    'Ctrl+ArrowUp': function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(0);
    },
    'Ctrl+ArrowDown': function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(editor.text.length);
    },
    Home: function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(0);
    },
    End: function (editor) {
        editor.removeAllRanges();
        editor.moveCursor(editor.text.length);
    },
    'Shift+Home': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, 0);
    },
    'Shift+End': function (editor) {
        const cursor = editor.getCursor();
        const selection = editor.getDecorationsByType('selection')[0] || null;
        let startIndex = cursor.startIndex;
        if (selection != null) {
            startIndex = selection.startIndex;
        }
        editor.removeAllRanges();
        editor.addRange(startIndex, editor.getText().length);
    },
    'Meta+Alt+Backspace': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const endIndex = editor.getPreviousWordBreakFromIndex(startIndex);
        editor.removeText(startIndex, endIndex);
    },
    'Ctrl+Alt+Backspace': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const endIndex = editor.getPreviousWordBreakFromIndex(startIndex);
        editor.removeText(startIndex, endIndex);
    },
    'Meta+Alt+Delete': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const endIndex = editor.getNextWordBreakFromIndex(startIndex);
        editor.removeText(startIndex, endIndex);
    },
    'Ctrl+Alt+Delete': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const endIndex = editor.getNextWordBreakFromIndex(startIndex);
        editor.removeText(startIndex, endIndex);
    },
    'Meta+Backspace': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const row = editor.getRowForIndex(startIndex);
        if (row != null) {
            editor.removeText(startIndex, row.startIndex);
        }
    },
    'Meta+Delete': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const row = editor.getRowForIndex(startIndex);
        if (row != null) {
            editor.removeText(startIndex, row.endIndex);
        }
    },
    'Ctrl+Backspace': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const row = editor.getRowForIndex(startIndex);
        if (row != null) {
            editor.removeText(startIndex, row.startIndex);
        }
    },
    'Ctrl+Delete': function (editor) {
        const cursor = editor.getCursor();
        const startIndex = cursor.startIndex;
        const row = editor.getRowForIndex(startIndex);
        if (row != null) {
            editor.removeText(startIndex, row.endIndex);
        }
    },
});


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
const modifierKeys = {
    Control: true,
    Alt: true,
    Shift: true,
    Meta: true,
};
/* harmony default export */ __webpack_exports__["default"] = (modifierKeys);


/***/ })
/******/ ]);
});