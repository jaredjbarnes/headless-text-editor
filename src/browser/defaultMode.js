export default {
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
};
