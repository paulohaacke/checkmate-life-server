var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var valueSchema = new Schema({
    content: {
        type: String
    }
});

var purposeSchema = new Schema({
    mission: {
        type: String
    },
    vision: {
        type: String
    },
    values: [valueSchema],
    postedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var Purpose = mongoose.model('Purpose', purposeSchema);
module.exports = Purpose;