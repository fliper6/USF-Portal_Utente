const mongoose = require('mongoose')

var blocklistSchema = new mongoose.Schema({
    token: {type: String, required: true}, 
    expireAt: {type: Date, required: true}
});

blocklistSchema.index({ "expireAt": 1 }, { expireAfterSeconds: 0, sparse: false })

module.exports = mongoose.model('blocklist', blocklistSchema) 