const Quiz = require("../models/quizModel");
const catchAsync = require('../utils/catchAsync');
const AppError=require('../utils/appError');






exports.createQuiz=catchAsync(async(req,res,next)=>{
    const { title, description,category,difficulty,createdBy}=req.body
    const newQuiz= await Quiz.create(title, description, category, difficulty, createdBy)
    res.status(201).json({
        status: 'success',
        data:{
            quiz: newQuiz
        }
    })
})

exports.getQuiz=catchAsync(async(req,res,next)=>{
    const quiz= await Quiz.findById(req.params.id)
    if(!quiz){
        return next(new AppError("Couldn't find quiz",400));
    }
    res.status(200).json({
        status: "success",
        data:quiz
    })
})
exports.getAllQuizzes = catchAsync(async(req,res,next)=>{
    const quiz= await Quiz.find()
    res.status(200).json({
        status:'success',
        data:quiz
    })
})