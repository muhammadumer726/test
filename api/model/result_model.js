const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userId: {
        type: String,  // Storing user ID as a simple string
        required: true
    },
    quizMarks: {
        type: Number,
        required: true,
        min: 0 // Minimum marks can be 0
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    }
});

module.exports = mongoose.model('resultModel', resultSchema, 'results');
