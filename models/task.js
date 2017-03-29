var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    goal: {
        type: Schema.Types.ObjectId,
        ref: 'Goal',
        unique: true
    },
    state: {
        type: String,
        enum: ['todo', 'doing', 'done', 'archive'],
        required: true
    }
});

var Tasks = mongoose.model('Task', taskSchema);
module.exports = Tasks;