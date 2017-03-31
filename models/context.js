var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var factSchema = new Schema({
    description: {
        type: String,
        required: true
    }
})

var contextSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    facts: [factSchema],
    color: {
        type: String
    },
    "color-bg": {
        type: String
    },
    postedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var Contexts = mongoose.model('Context', contextSchema);
module.exports = Contexts;