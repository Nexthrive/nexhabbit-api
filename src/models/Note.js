const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // ref: 'User' // Uncomment this when User model is created
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String
    },
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
    }
}, { timestamps: true });

module.exports = mongoose.model('Note', NoteSchema);
