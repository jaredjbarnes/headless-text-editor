"use strict";

var _TextEditor = _interopRequireDefault(require("../TextEditor"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

test('TextEditor: Set and get text.', function () {
  var editor = new _TextEditor.default();
  var text = 'My text.';
  editor.setText(text);
  var editorText = editor.getText();
  expect(editorText).toBe(text);
});
test('TextEditor: Replace text.', function () {
  var editor = new _TextEditor.default();
  var text = 'My text.';
  editor.setText(text);
  editor.replaceText(3, 8, 'awesome text.');
  var editorText = editor.getText();
  expect(editorText).toBe('My awesome text.');
});
test('Editor: Replace simple example.', function () {
  var editor = new _TextEditor.default();
  var text = 'Cat';
  editor.setText(text);
  editor.replaceText(0, 1, 'B');
  var editorText = editor.getText();
  expect(editorText).toBe('Bat');
});
test('Editor: Remove text.', function () {
  var editor = new _TextEditor.default();
  var text = 'My text.';
  editor.setText(text);
  editor.removeText(2, 8);
  var editorText = editor.getText();
  expect(editorText).toBe('My');
});
test('Editor: Move cursor.', function () {
  var editor = new _TextEditor.default();
  var text = 'My text.';
  editor.setText(text);
  editor.moveCursor(7);
  expect(editor.cursor.startIndex).toBe(7);
  editor.moveCursor(8);
  expect(editor.cursor.startIndex).toBe(8);
  editor.moveCursor(9);
  expect(editor.cursor.startIndex).toBe(8);
  editor.moveCursor(0);
  expect(editor.cursor.startIndex).toBe(0);
  editor.moveCursor(-1);
  expect(editor.cursor.startIndex).toBe(0);
  editor.moveCursor(5);
  expect(editor.cursor.startIndex).toBe(5);
});
test('Editor: Insert text.', function () {
  var editor = new _TextEditor.default();
  var text = 'My text.';
  editor.setText(text);
  editor.moveCursor(8);
  editor.insert(' I love my text.');
  var editorText = editor.getText();
  expect(editorText).toBe('My text. I love my text.');
  editor.moveCursor(0);
  editor.insert('Text has many colors. ');
  editorText = editor.getText();
  expect(editorText).toBe('Text has many colors. My text. I love my text.');
  editor.moveCursor(editor.text.length - 1);
  editor.insert('s');
  editorText = editor.getText();
  expect(editorText).toBe('Text has many colors. My text. I love my texts.');
});
test('Editor: Insert text with selection.', function () {
  var editor = new _TextEditor.default();
  var text = 'Select this text and this text.';
  editor.setText(text);
  editor.addRange(7, 16);
  editor.addRange(21, 30);
  editor.insert('this stuff');
  var editorText = editor.getText();
  expect(editorText).toBe('Select this stuff and this stuff.');
});
test('Editor: backspace.', function () {
  var editor = new _TextEditor.default();
  var text = 'Select this text and this text.';
  editor.setText(text);
  editor.moveCursor(6);
  editor.backspace();
  var editorText = editor.getText();
  expect(editorText).toBe('Selec this text and this text.');
});
test('Editor: observing.', function () {
  // The onchange fires on every cursor position change, decoration change and text change.
  var observerCount = 0;
  var editor = new _TextEditor.default();
  var text = 'Select this text and this text.';
  editor.onChange(function () {
    observerCount++;
  });
  editor.setText(text);
  editor.moveCursor(6);
  editor.backspace();
  editor.insert('t');
  var editorText = editor.getText();
  expect(editorText).toBe('Select this text and this text.');
  expect(observerCount).toBe(5);
});
test('Editor: moveCursorDown.', function () {
  var editor = new _TextEditor.default();
  var text = '1\n2\n3\n4\n5\n6';
  editor.setText(text);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(2);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(4);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(6);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(8);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(10);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(10);
});
test('Editor: moveCursorUp.', function () {
  var editor = new _TextEditor.default();
  var text = '1\n2\n3\n4\n5\n6';
  editor.setText(text);
  editor.moveCursor(10);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(8);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(6);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(4);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(2);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(0);
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(0);
});
test('Editor: columns.', function () {
  var editor = new _TextEditor.default();
  var text = '1234\n1234\n1234\n1234\n1234\n1234';
  editor.setText(text);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(5);
  expect(editor.getCharacterAtCursor()).toBe('1');
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(10);
  expect(editor.getCharacterAtCursor()).toBe('1');
  editor.moveCursor(11);
  expect(editor.getCharacterAtCursor()).toBe('2');
  editor.moveCursorUp();
  expect(editor.cursor.startIndex).toBe(6);
  expect(editor.getCharacterAtCursor()).toBe('2');
  editor.moveCursor(7);
  editor.moveCursorDown();
  expect(editor.cursor.startIndex).toBe(12);
  expect(editor.getCharacterAtCursor()).toBe('3');
});
test('Editor: getCharacterAtCursor.', function () {
  var editor = new _TextEditor.default();
  var text = '1234\n1234\n1234\n1234\n1234\n1234';
  editor.setText(text);
  expect(editor.getCharacterAtCursor()).toBe('1');
  editor.moveCursor(1);
  expect(editor.getCharacterAtCursor()).toBe('2');
});
test('Editor: getPositionForIndex.', function () {
  var editor = new _TextEditor.default();
  var text = '1234\n1234\n1234\n1234\n1234\n1234';
  editor.setText(text);
  editor.moveCursor(24);
  var position = editor.getPositionForIndex(24);
  expect(position === null || position === void 0 ? void 0 : position.column).toBe(4);
  expect(position === null || position === void 0 ? void 0 : position.row).toBe(4);
  position = editor.getPositionForIndex(25);
  expect(position === null || position === void 0 ? void 0 : position.column).toBe(0);
  expect(position === null || position === void 0 ? void 0 : position.row).toBe(5);
});
test('Editor: add, and remove decoration.', function () {
  var editor = new _TextEditor.default();
  var text = '1234\n1234\n1234\n1234\n1234\n1234';
  var decoration = {
    type: 'test',
    startIndex: 0,
    endIndex: 5
  };
  editor.setText(text);
  editor.addDecoration(decoration);
  expect(editor.decorations.filter(function (d) {
    return d.type === 'test';
  }).length).toBe(1);
  editor.removeDecoration(decoration);
  expect(editor.decorations.filter(function (d) {
    return d.type === 'test';
  }).length).toBe(0);
});
//# sourceMappingURL=TextEditor.test.js.map