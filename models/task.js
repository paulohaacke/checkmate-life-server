var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var taskSchema = new Schema({
    description: {
        type: String,
        required: true
    },
    goal: {
        type: Schema.Types.ObjectId,
        ref: 'Goal'
    },
    state: {
        type: String,
        enum: ['todo', 'doing', 'done', 'archive'],
        required: true,
        default: "todo"
    },
    postedBy: {
        required: true,
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

var Tasks = mongoose.model('Task', taskSchema);
module.exports = Tasks;