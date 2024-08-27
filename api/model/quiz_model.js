const mongoose=require('mongoose')

const quiz = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    question: {
        type: String,
        required: true
    },
    options: {
        type: [String],
        validate: {
            validator: function (array) {
                return array.length === 4; 
            },
            message: 'There must be exactly four options.'
        },
        required: true
    },
    key: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
                return this.options.includes(value); 
            },
            message: 'The correct answer (key) must be one of the options.'
        }
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true
    }
});

module.exports = mongoose.model('quiz', quiz, 'quiz');
