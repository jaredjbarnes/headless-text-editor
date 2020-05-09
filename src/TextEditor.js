import DecorationManager from './DecorationManager';
import Observable from './Observable';
const clone = obj => {
    return JSON.parse(JSON.stringify(obj));
};
const nonAlphaNumericCharacter = /[^a-zA-Z]/;
export default class TextEditor {
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
        this.decorationManager = new DecorationManager(this);
        this.observable = new Observable();
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
