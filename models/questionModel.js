const mongoose=require('mongoose');

const questionSchema= new mongoose.Schema({
    text:{
        type:String,
        required:[true,'Enter question']
    },
    type:{
        type:String,
        required:[true,'Enter question type'],
        enum:['multiple-choice','true-false','fill-in-the-blank']
    },
    options:{
        type:String
    },
    correctAnswer:{
    type: mongoose.Schema.Types.Mixed,
    required: true,
    validate: {
        validator: function(v) {
        if (this.type === 'multiple-choice' && !Array.isArray(v)) return false;
        if (this.type === 'true-false' && typeof v !== 'boolean') return false;
        if (this.type === 'short-answer' && typeof v !== 'string') return false;
        return true;
        },
        message: props => `${props.value} is not a valid answer for ${props.type}!`
    }
    },
    explanation:{
        type:String
    },
    points:{
        type:Number,
        default:1
    },
    quiz:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Quiz',
        required: true
    }
})
const Question=mongoose.model('Question',questionSchema)
module.exports = Question