"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var GuidFactory = /*#__PURE__*/function () {
  function GuidFactory() {
    _classCallCheck(this, GuidFactory);
  }

  _createClass(GuidFactory, [{
    key: "createPart",
    value: function createPart() {
      return Math.floor(Math.random() * 0x10000
      /* 65536 */
      ).toString(16);
    }
  }, {
    key: "create",
    value: function create() {
      return this.createPart() + this.createPart() + '-' + this.createPart() + '-' + this.createPart() + '-' + this.createPart() + '-' + this.createPart() + this.createPart() + this.createPart();
    }
  }], [{
    key: "create",
    value: function create() {
      return new GuidFactory().create();
    }
  }]);

  return GuidFactory;
}();

exports.default = GuidFactory;
//# sourceMappingURL=GuidFactory.js.map