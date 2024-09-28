const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
},
    description: {
        type: String,
        required: true,
},
    category: {
        type: String,
        required: true,
},
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        required: true,
},
    timeLimit: {
        type: Number, // in minutes
        default: 5,
},
    questions: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        },
    ],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
},
    isPublished: {
        type: Boolean,
        default: false,
},
    createdAt: {
        type: Date,
        default: Date.now,
},
    updatedAt: {
        type: Date,
        default: Date.now,
},
});

const Quiz = mongoose.model('Quiz', QuizSchema);

module.exports = Quiz;
