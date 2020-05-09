export default class DecorationManager {
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
