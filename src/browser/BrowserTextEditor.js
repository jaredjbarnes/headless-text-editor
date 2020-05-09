import TextEditor from '../TextEditor';
import namedKeys from './namedKeys';
import defaultMode from './defaultMode';
import modifierKeys from './modifierKeys';
export default class BrowserTextEditor extends TextEditor {
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
        if (event.shiftKey && (parts.length > 0 || namedKeys[event.key])) {
            parts.push('Shift');
        }
        if (!modifierKeys[event.key]) {
            parts.push(event.key);
        }
        const key = parts.join('+');
        return {
            isCommand: parts.length > 1,
            isNamedKey: namedKeys[event.key],
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
        else if (typeof defaultMode[name] === 'function') {
            return defaultMode[name].apply(null, args);
        }
    }
}
