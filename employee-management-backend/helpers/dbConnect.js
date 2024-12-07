const mongoose = require("mongoose")//a library for connecting and interacting with mongodb database

function connectDB(url) {
    return mongoose.connect(url)
}

module.exports = connectDB
