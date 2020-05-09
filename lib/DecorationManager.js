"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var DecorationManager = /*#__PURE__*/function () {
  function DecorationManager(editor) {
    _classCallCheck(this, DecorationManager);

    this.editor = editor;
    this.range = {
      startIndex: 0,
      endIndex: 0
    };
    this.decorationPositions = new WeakMap();
  }

  _createClass(DecorationManager, [{
    key: "adjustBothSides",
    value: function adjustBothSides(decoration, leftAmount, rightAmount) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.startIndex += leftAmount;
        decoration.endIndex += rightAmount;
      } else {
        decoration.startIndex += rightAmount;
        decoration.endIndex += leftAmount;
      }
    }
  }, {
    key: "assignBothSides",
    value: function assignBothSides(decoration, leftValue, rightValue) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.startIndex = leftValue;
        decoration.endIndex = rightValue;
      } else {
        decoration.startIndex = rightValue;
        decoration.endIndex = leftValue;
      }
    }
  }, {
    key: "adjustLeftSide",
    value: function adjustLeftSide(decoration, amount) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.startIndex += amount;
      } else {
        decoration.endIndex += amount;
      }
    }
  }, {
    key: "adjustRightSide",
    value: function adjustRightSide(decoration, amount) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.endIndex += amount;
      } else {
        decoration.startIndex += amount;
      }
    }
  }, {
    key: "assignRightSide",
    value: function assignRightSide(decoration, value) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.endIndex = value;
      } else {
        decoration.startIndex = value;
      }
    }
  }, {
    key: "assignLeftSide",
    value: function assignLeftSide(decoration, value) {
      if (decoration.startIndex < decoration.endIndex) {
        decoration.startIndex = value;
      } else {
        decoration.endIndex = value;
      }
    }
  }, {
    key: "isRangeOnLeftSideOfDecoration",
    value: function isRangeOnLeftSideOfDecoration(decoration) {
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex === this.range.endIndex && this.range.startIndex === left;
    }
  }, {
    key: "isRangeOnRightSideOfDecoration",
    value: function isRangeOnRightSideOfDecoration(decoration) {
      var right = Math.max(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex === this.range.endIndex && this.range.startIndex === right;
    }
  }, {
    key: "isDecorationLeftOfTheRange",
    value: function isDecorationLeftOfTheRange(decoration) {
      var right = Math.max(decoration.startIndex, decoration.endIndex);
      return right <= this.range.startIndex;
    }
  }, {
    key: "isDecorationRightOfTheRange",
    value: function isDecorationRightOfTheRange(decoration) {
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      return left >= this.range.endIndex;
    }
  }, {
    key: "isDecorationWithinTheRange",
    value: function isDecorationWithinTheRange(decoration) {
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      var right = Math.max(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex <= left && this.range.endIndex >= right;
    }
  }, {
    key: "doesDecorationSurroundTheRange",
    value: function doesDecorationSurroundTheRange(decoration) {
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      var right = Math.max(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex >= left && this.range.endIndex <= right;
    }
  }, {
    key: "doesRangeOverlapLeftSideOfDecoration",
    value: function doesRangeOverlapLeftSideOfDecoration(decoration) {
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex < left && this.range.endIndex > left;
    }
  }, {
    key: "doesRangeOverlapRightSideOfDecoration",
    value: function doesRangeOverlapRightSideOfDecoration(decoration) {
      var right = Math.max(decoration.startIndex, decoration.endIndex);
      return this.range.startIndex < right && this.range.endIndex > right;
    }
  }, {
    key: "isSticky",
    value: function isSticky(decoration) {
      var positions = this.decorationPositions.get(decoration);
      var left = Math.min(decoration.startIndex, decoration.endIndex);
      var right = Math.max(decoration.startIndex, decoration.endIndex);

      if (positions && !positions.includes('right') && !positions.includes('left') && positions.filter(function (p) {
        return p === 'on-left-boundary';
      }).length < 2) {
        return true;
      }

      if (this.editor.cursor.startIndex > left && this.editor.cursor.startIndex < right) {
        return true;
      }

      return false;
    }
  }, {
    key: "saveDecorationPosition",
    value: function saveDecorationPosition(decoration, position) {
      var positions = this.decorationPositions.get(decoration);

      if (positions == null) {
        positions = [];
        this.decorationPositions.set(decoration, positions);
      }

      positions.push(position);

      if (positions.length > 2) {
        positions.shift();
      }
    }
  }, {
    key: "collapse",
    value: function collapse(startIndex, endIndex) {
      var _this = this;

      this.range.startIndex = Math.min(startIndex, endIndex);
      this.range.endIndex = Math.max(startIndex, endIndex);
      var amount = this.range.startIndex - this.range.endIndex;
      var decorations = this.editor.decorations.filter(function (d) {
        return d.type !== 'cursor';
      });
      decorations.forEach(function (decoration) {
        if (_this.isDecorationLeftOfTheRange(decoration)) {// Do Nothing.
          //console.log("left of range");
        } else if (_this.isDecorationRightOfTheRange(decoration)) {
          //console.log("right of range");
          _this.adjustBothSides(decoration, amount, amount);
        } else if (_this.isDecorationWithinTheRange(decoration)) {
          //console.log("is within");
          _this.assignBothSides(decoration, startIndex, startIndex);
        } else if (_this.doesDecorationSurroundTheRange(decoration)) {
          _this.adjustRightSide(decoration, amount);
        } else if (_this.doesRangeOverlapLeftSideOfDecoration(decoration)) {
          //console.log("is left overlap");
          var overlap = endIndex - decoration.startIndex;
          var originalSize = decoration.endIndex - decoration.startIndex;

          _this.assignBothSides(decoration, startIndex, startIndex + originalSize - overlap);
        } else if (_this.doesRangeOverlapRightSideOfDecoration(decoration)) {
          _this.assignRightSide(decoration, startIndex);
        } else {//console.log("Shouldn't get here.", decoration);
        }

        decoration.startIndex = Math.max(0, decoration.startIndex);
        decoration.startIndex = Math.min(_this.editor.text.length, decoration.startIndex);
        decoration.endIndex = Math.max(0, decoration.endIndex);
        decoration.endIndex = Math.min(_this.editor.text.length, decoration.endIndex);
      });
    }
  }, {
    key: "expand",
    value: function expand(onIndex, amount) {
      var _this2 = this;

      this.range.startIndex = onIndex;
      this.range.endIndex = onIndex;
      var decorations = this.editor.decorations.filter(function (d) {
        return d.type !== 'cursor';
      });
      decorations.forEach(function (decoration) {
        if (_this2.isSticky(decoration)) {
          if (_this2.isRangeOnLeftSideOfDecoration(decoration)) {
            //console.log("sticky on left boundary");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.isRangeOnRightSideOfDecoration(decoration)) {
            //console.log("sticky on right boundary");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.isDecorationWithinTheRange(decoration)) {
            //console.log("sticky within");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.doesDecorationSurroundTheRange(decoration)) {
            //console.log("sticky surrounds range");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.isDecorationRightOfTheRange(decoration)) {
            //console.log("sticky is right of range");
            _this2.adjustBothSides(decoration, amount, amount);
          } else if (_this2.isDecorationLeftOfTheRange(decoration)) {//console.log("non-sticky is left of range");
            // Do nothing
          } else {//console.log('sticky', this.range, decoration);
            }
        } else {
          if (_this2.isRangeOnLeftSideOfDecoration(decoration)) {
            //console.log("non-sticky on left boundary");
            _this2.adjustBothSides(decoration, amount, amount);
          } else if (_this2.isRangeOnRightSideOfDecoration(decoration)) {//console.log("non-sticky on right boundary");
            // Do nothing
          } else if (_this2.isDecorationWithinTheRange(decoration)) {
            //console.log("non-sticky within");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.doesDecorationSurroundTheRange(decoration)) {
            //console.log("non-sticky surrounds range");
            _this2.adjustRightSide(decoration, amount);
          } else if (_this2.isDecorationRightOfTheRange(decoration)) {
            //console.log("non-sticky is right of range");
            _this2.adjustBothSides(decoration, amount, amount);
          } else if (_this2.isDecorationLeftOfTheRange(decoration)) {//console.log("non-sticky is left of range");
            // Do nothing
          } else {//console.log('non-sticky', this.range, decoration);
            }
        }
      });
    }
  }, {
    key: "saveDecorationPlacementHistory",
    value: function saveDecorationPlacementHistory() {
      var _this3 = this;

      this.range.startIndex = this.editor.cursor.startIndex;
      this.range.endIndex = this.editor.cursor.startIndex;
      var decorations = this.editor.decorations.filter(function (d) {
        return d.type !== 'cursor';
      });
      decorations.forEach(function (decoration) {
        if (_this3.isRangeOnLeftSideOfDecoration(decoration)) {
          _this3.saveDecorationPosition(decoration, 'on-left-boundary');
        } else if (_this3.isRangeOnRightSideOfDecoration(decoration)) {
          _this3.saveDecorationPosition(decoration, 'on-right-boundary');
        } else if (_this3.doesDecorationSurroundTheRange(decoration)) {
          _this3.saveDecorationPosition(decoration, 'surrounds');
        } else if (_this3.isDecorationRightOfTheRange(decoration)) {
          _this3.saveDecorationPosition(decoration, 'right');
        } else if (_this3.isDecorationLeftOfTheRange(decoration)) {
          _this3.saveDecorationPosition(decoration, 'left');
        } else {//console.log('saveDecorationPlacementHistory', this.range, decoration);
        }
      });
    }
  }]);

  return DecorationManager;
}();

exports.default = DecorationManager;
//# sourceMappingURL=DecorationManager.js.map