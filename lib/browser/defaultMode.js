"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = {
  paste: function paste(editor, text) {
    editor.insert(text);
    editor.removeAllRanges();
  },
  cut: function cut(editor) {
    var selection = editor.getDecorations().filter(function (d) {
      return d.type === 'selection';
    })[0];

    if (selection != null) {
      var text = editor.getTextByRange(selection.startIndex, selection.endIndex);
      editor.delete();
      return text;
    }

    return null;
  },
  copy: function copy(editor) {
    var selection = editor.getDecorations().filter(function (d) {
      return d.type === 'selection';
    })[0];

    if (selection != null) {
      return editor.getTextByRange(selection.startIndex, selection.endIndex);
    }

    return null;
  },
  keydown: function keydown(editor, key) {
    editor.insert(key);
    editor.removeAllRanges();
  },
  'Meta+a': function MetaA(editor, event) {
    editor.removeAllRanges();
    editor.addRange(0, editor.text.length);
    event.preventDefault();
  },
  'Ctrl+a': function CtrlA(editor, event) {
    editor.removeAllRanges();
    editor.addRange(0, editor.text.length);
    event.preventDefault();
  },
  'Meta+z': function MetaZ(editor, event) {
    editor.undo();
    event.preventDefault();
  },
  'Ctrl+z': function CtrlZ(editor, event) {
    editor.undo();
    event.preventDefault();
  },
  'Meta+Shift+z': function MetaShiftZ(editor, event) {
    editor.redo();
    event.preventDefault();
  },
  'Ctrl+Shift+z': function CtrlShiftZ(editor, event) {
    editor.redo();
    event.preventDefault();
  },
  ArrowLeft: function ArrowLeft(editor) {
    var editorSelections = editor.decorations.filter(function (d) {
      return d.type === 'selection';
    });
    editor.removeAllRanges();

    if (editorSelections.length > 0) {
      var left = Math.min(editorSelections[0].endIndex, editorSelections[0].startIndex);
      editor.moveCursor(left);
    } else {
      editor.moveCursorLeft();
    }
  },
  ArrowRight: function ArrowRight(editor) {
    var editorSelections = editor.decorations.filter(function (d) {
      return d.type === 'selection';
    });
    editor.removeAllRanges();

    if (editorSelections.length > 0) {
      var right = Math.max(editorSelections[0].endIndex, editorSelections[0].startIndex);
      editor.moveCursor(right);
    } else {
      editor.moveCursorRight();
    }
  },
  ArrowUp: function ArrowUp(editor) {
    editor.removeAllRanges();
    editor.moveCursorUp();
  },
  ArrowDown: function ArrowDown(editor) {
    editor.removeAllRanges();
    editor.moveCursorDown();
  },
  Backspace: function Backspace(editor) {
    editor.backspace();
    editor.removeAllRanges();
  },
  Delete: function Delete(editor) {
    editor.delete();
    editor.removeAllRanges();
  },
  Enter: function Enter(editor) {
    editor.insert('\n');
    editor.removeAllRanges();
  },
  'Meta+Shift+ArrowLeft': function MetaShiftArrowLeft(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    if (row != null) {
      editor.removeAllRanges();
      editor.addRange(startIndex, row.startIndex);
    }
  },
  'Ctrl+Shift+ArrowLeft': function CtrlShiftArrowLeft(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    if (row != null) {
      editor.removeAllRanges();
      editor.addRange(startIndex, row.startIndex);
    }
  },
  'Meta+Shift+ArrowRight': function MetaShiftArrowRight(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    if (row != null) {
      editor.removeAllRanges();
      editor.addRange(startIndex, row.endIndex - 1);
    }
  },
  'Ctrl+Shift+ArrowRight': function CtrlShiftArrowRight(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    if (row != null) {
      editor.removeAllRanges();
      editor.addRange(startIndex, row.endIndex - 1);
    }
  },
  'Alt+Shift+ArrowRight': function AltShiftArrowRight(editor) {
    var cursor = editor.getCursor();
    var nextIndex = editor.getNextWordBreakFromIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (nextIndex == null) {
      return;
    }

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, nextIndex);
  },
  'Alt+Shift+ArrowLeft': function AltShiftArrowLeft(editor) {
    var cursor = editor.getCursor();
    var nextIndex = editor.getPreviousWordBreakFromIndex(cursor.startIndex);
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (nextIndex == null) {
      return;
    }

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, nextIndex);
  },
  'Shift+ArrowRight': function ShiftArrowRight(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, cursor.endIndex);
  },
  'Shift+ArrowLeft': function ShiftArrowLeft(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, cursor.startIndex - 1);
  },
  'Shift+ArrowUp': function ShiftArrowUp(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var endIndex = editor.getIndexUpFromIndex(cursor.startIndex);
    var startIndex = cursor.startIndex;

    if (endIndex == null) {
      return;
    }

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, endIndex);
  },
  'Shift+ArrowDown': function ShiftArrowDown(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var endIndex = editor.getIndexDownFromIndex(cursor.startIndex);
    var startIndex = cursor.startIndex;

    if (endIndex == null) {
      return;
    }

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, endIndex);
  },
  'Meta+Shift+ArrowDown': function MetaShiftArrowDown(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, editor.getText().length);
  },
  'Meta+Shift+ArrowUp': function MetaShiftArrowUp(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, 0);
  },
  'Ctrl+Shift+ArrowDown': function CtrlShiftArrowDown(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, editor.getText().length);
  },
  'Ctrl+Shift+ArrowUp': function CtrlShiftArrowUp(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, 0);
  },
  'Alt+ArrowLeft': function AltArrowLeft(editor) {
    var cursor = editor.getCursor();
    var index = editor.getPreviousWordBreakFromIndex(cursor.startIndex);
    editor.removeAllRanges();
    editor.moveCursor(index);
  },
  'Alt+ArrowRight': function AltArrowRight(editor) {
    var cursor = editor.getCursor();
    var index = editor.getNextWordBreakFromIndex(cursor.startIndex);
    editor.removeAllRanges();
    editor.moveCursor(index);
  },
  'Meta+ArrowLeft': function MetaArrowLeft(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    editor.removeAllRanges();

    if (row) {
      editor.moveCursor(row.startIndex);
    }
  },
  'Meta+ArrowRight': function MetaArrowRight(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    editor.removeAllRanges();

    if (row) {
      editor.moveCursor(row.endIndex - 1);
    }
  },
  'Ctrl+ArrowLeft': function CtrlArrowLeft(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    editor.removeAllRanges();

    if (row) {
      editor.moveCursor(row.startIndex);
    }
  },
  'Ctrl+ArrowRight': function CtrlArrowRight(editor) {
    var cursor = editor.getCursor();
    var row = editor.getRowForIndex(cursor.startIndex);
    editor.removeAllRanges();

    if (row) {
      editor.moveCursor(row.endIndex - 1);
    }
  },
  'Meta+ArrowUp': function MetaArrowUp(editor) {
    editor.removeAllRanges();
    editor.moveCursor(0);
  },
  'Meta+ArrowDown': function MetaArrowDown(editor) {
    editor.removeAllRanges();
    editor.moveCursor(editor.text.length);
  },
  'Ctrl+ArrowUp': function CtrlArrowUp(editor) {
    editor.removeAllRanges();
    editor.moveCursor(0);
  },
  'Ctrl+ArrowDown': function CtrlArrowDown(editor) {
    editor.removeAllRanges();
    editor.moveCursor(editor.text.length);
  },
  Home: function Home(editor) {
    editor.removeAllRanges();
    editor.moveCursor(0);
  },
  End: function End(editor) {
    editor.removeAllRanges();
    editor.moveCursor(editor.text.length);
  },
  'Shift+Home': function ShiftHome(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, 0);
  },
  'Shift+End': function ShiftEnd(editor) {
    var cursor = editor.getCursor();
    var selection = editor.getDecorationsByType('selection')[0] || null;
    var startIndex = cursor.startIndex;

    if (selection != null) {
      startIndex = selection.startIndex;
    }

    editor.removeAllRanges();
    editor.addRange(startIndex, editor.getText().length);
  },
  'Meta+Alt+Backspace': function MetaAltBackspace(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var endIndex = editor.getPreviousWordBreakFromIndex(startIndex);
    editor.removeText(startIndex, endIndex);
  },
  'Ctrl+Alt+Backspace': function CtrlAltBackspace(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var endIndex = editor.getPreviousWordBreakFromIndex(startIndex);
    editor.removeText(startIndex, endIndex);
  },
  'Meta+Alt+Delete': function MetaAltDelete(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var endIndex = editor.getNextWordBreakFromIndex(startIndex);
    editor.removeText(startIndex, endIndex);
  },
  'Ctrl+Alt+Delete': function CtrlAltDelete(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var endIndex = editor.getNextWordBreakFromIndex(startIndex);
    editor.removeText(startIndex, endIndex);
  },
  'Meta+Backspace': function MetaBackspace(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var row = editor.getRowForIndex(startIndex);

    if (row != null) {
      editor.removeText(startIndex, row.startIndex);
    }
  },
  'Meta+Delete': function MetaDelete(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var row = editor.getRowForIndex(startIndex);

    if (row != null) {
      editor.removeText(startIndex, row.endIndex);
    }
  },
  'Ctrl+Backspace': function CtrlBackspace(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var row = editor.getRowForIndex(startIndex);

    if (row != null) {
      editor.removeText(startIndex, row.startIndex);
    }
  },
  'Ctrl+Delete': function CtrlDelete(editor) {
    var cursor = editor.getCursor();
    var startIndex = cursor.startIndex;
    var row = editor.getRowForIndex(startIndex);

    if (row != null) {
      editor.removeText(startIndex, row.endIndex);
    }
  }
};
exports.default = _default;
//# sourceMappingURL=defaultMode.js.map