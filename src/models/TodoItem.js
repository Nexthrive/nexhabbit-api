const mongoose = require('mongoose');

const TodoItemSchema = new mongoose.Schema({
    todoId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Todo'
    },
    title: {
        type: String,
        required: true
    },
    desc: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('TodoItem', TodoItemSchema);
