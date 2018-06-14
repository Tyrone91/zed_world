const path = require("path")

module.exports = {
    entry: "./js/main.js",
    output: {
        path: path.resolve(__dirname, "game"),
        filename: "game-standalone.js"
    }
}