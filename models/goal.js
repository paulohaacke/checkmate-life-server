var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var metricSchema = new Schema({
    description: {
        type: String,
        required: true
    }
})

var goalSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    metrics: [metricSchema],
    dependencies: [{
        type: Schema.Types.ObjectId,
        ref: 'Goal',
        unique: true
    }],
    lifeArea: {
        type: Schema.Types.ObjectId,
        ref: 'LifeArea'
    },
    postedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

var Goals = mongoose.model('Goal', goalSchema);
module.exports = Goals;