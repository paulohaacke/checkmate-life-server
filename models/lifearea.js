var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lifeAreaSchema = new Schema({
    label: {
        type: String,
        required: true
    },
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
})

var LifeAreas = mongoose.model('LifeArea', lifeAreaSchema);
module.exports = LifeAreas;