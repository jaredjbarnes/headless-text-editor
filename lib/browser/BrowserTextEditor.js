"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _TextEditor2 = _interopRequireDefault(require("../TextEditor"));

var _namedKeys = _interopRequireDefault(require("./namedKeys"));

var _defaultMode = _interopRequireDefault(require("./defaultMode"));

var _modifierKeys = _interopRequireDefault(require("./modifierKeys"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { return function () { var Super = _getPrototypeOf(Derived), result; if (_isNativeReflectConstruct()) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var BrowserTextEditor = /*#__PURE__*/function (_TextEditor) {
  _inherits(BrowserTextEditor, _TextEditor);

  var _super = _createSuper(BrowserTextEditor);

  function BrowserTextEditor() {
    var _this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        keyDownDelegate = _ref.keyDownDelegate;

    _classCallCheck(this, BrowserTextEditor);

    _this = _super.call(this);
    _this.keydownDelegate = keyDownDelegate;
    _this.onPaste = _this.onPaste.bind(_assertThisInitialized(_this));
    _this.onCut = _this.onCut.bind(_assertThisInitialized(_this));
    _this.onCopy = _this.onCopy.bind(_assertThisInitialized(_this));
    _this.keydown = _this.keydown.bind(_assertThisInitialized(_this));
    return _this;
  }

  _createClass(BrowserTextEditor, [{
    key: "onPaste",
    value: function onPaste(event) {
      var text = event.clipboardData.getData('text');
      this.invokeHandler('paste', [this, text, event]);
      event.preventDefault();
    }
  }, {
    key: "onCopy",
    value: function onCopy(event) {
      var text = this.invokeHandler('copy', [this, event]);

      if (typeof text === 'string') {
        event.clipboardData.setData('text/plain', text);
      }

      event.preventDefault();
    }
  }, {
    key: "onCut",
    value: function onCut(event) {
      var text = this.invokeHandler('cut', [this, event]);

      if (typeof text === 'string') {
        event.clipboardData.setData('text/plain', text);
      }

      event.preventDefault();
    }
  }, {
    key: "setKeydownDelegate",
    value: function setKeydownDelegate(delegate) {
      this.keydownDelegate = delegate;
    }
  }, {
    key: "keydown",
    value: function keydown(event) {
      var keyInformation = this.createKey(event);
      this.invokeKeyHandler(keyInformation, event);
    }
  }, {
    key: "createKey",
    value: function createKey(event) {
      var parts = [];

      if (event.ctrlKey) {
        parts.push('Ctrl');
      }

      if (event.metaKey) {
        parts.push('Meta');
      }

      if (event.altKey) {
        parts.push('Alt');
      }

      if (event.shiftKey && (parts.length > 0 || _namedKeys.default[event.key])) {
        parts.push('Shift');
      }

      if (!_modifierKeys.default[event.key]) {
        parts.push(event.key);
      }

      var key = parts.join('+');
      return {
        isCommand: parts.length > 1,
        isNamedKey: _namedKeys.default[event.key],
        originalKey: event.key,
        key: key
      };
    }
  }, {
    key: "invokeKeyHandler",
    value: function invokeKeyHandler(keyInformation, event) {
      var keyEvent = {
        type: keyInformation.key,
        preventDefault: false,
        keyInformation: keyInformation,
        domEvent: event
      };
      this.notify(keyEvent);

      if (keyEvent.preventDefault) {
        event.preventDefault();
        return;
      }

      if (!keyInformation.isCommand && !keyInformation.isNamedKey) {
        this.invokeHandler('keydown', [this, keyInformation.originalKey, event]);
      } else {
        var key = keyInformation.key;
        this.invokeHandler(key, [this, event]);
      }
    }
  }, {
    key: "invokeHandler",
    value: function invokeHandler(name, args) {
      if (this.keydownDelegate != null && typeof this.keydownDelegate[name] === 'function') {
        return this.keydownDelegate[name].apply(null, args);
      } else if (typeof _defaultMode.default[name] === 'function') {
        return _defaultMode.default[name].apply(null, args);
      }
    }
  }]);

  return BrowserTextEditor;
}(_TextEditor2.default);

exports.default = BrowserTextEditor;
//# sourceMappingURL=BrowserTextEditor.js.map