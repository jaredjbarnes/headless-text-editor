var path = require("path");

module.exports = {
    entry: [
        "./src/index.js"
    ],
    output: {
        filename: 'main.js',
        library: "headlessTextEditor",
        libraryTarget: "umd",
        path: path.resolve(__dirname, 'dist')
    }
};