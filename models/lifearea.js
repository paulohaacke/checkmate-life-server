var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lifeAreaSchema = new Schema({
    label: {
        type: String,
        required: true
    },
    goals: [{
        type: Schema.Types.ObjectId,
        ref: 'Goal',
        unique: true
    }],
    color: {
        type: String
    },
    "color-bg": {
        type: String
    }
})

var LifeAreas = mongoose.model('LifeArea', lifeAreaSchema);
module.exports = LifeAreas;