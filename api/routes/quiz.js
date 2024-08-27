const express=require('express');
const router=express.Router();
const quiz=require('../model/quiz_model');
const mongoose=require('mongoose');

router.get('/:difficulty',(req,res,next)=>{
    console.log('this is get request');
    const difficulty = req.params.difficulty;
    try {
    quiz.find({ difficulty: difficulty }).select("question options key _id").exec().then(
        docs=>{
            if(docs.length>0){
                const response={
                    success:true,
                    count:docs.length,
                    products:docs
                }
                res.status(200).json(response);
        }else{
            res.status(404).json({
                success:true,
                message:"No data found"
            });
        }
    }
    )
} catch (err) {
    console.error(err);
    res.status(500).json({
        success: false,
        error: err.message
    });
}
});

router.post('/', (req, res, next) => {
    console.log('Request body:', req.body);

    const Quiz = new quiz({
        _id: new mongoose.Types.ObjectId(),
        question: req.body.question,
        options: req.body.options,
        key: req.body.key,
        difficulty: req.body.difficulty
    });

    Quiz.save()
        .then(result => {
            console.log('Quiz added to the database');
            res.status(200).json({
                success: true,
                message: "Quiz added to the database",
                createdQuiz: {
                    question: result.question,
                    options: result.options,
                    key: result.key,
                    difficulty: result.difficulty,
                    _id: result._id,
                    request: {
                        type: 'GET',
                        url: `http://localhost:3000/quiz`
                    }
                }
            });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({
                success: false,
                error: err.message
            });
        });
});





router.patch('/:questionid',(req,res,next)=>{
    const id=req.params.questionid;
    const updateOps={};
    for(const ops of req.body){
        updateOps[ops.propName]=ops.value;
    }
    try{
        quiz.findOneAndUpdate({_id:id},{$set:updateOps},).exec().then(
            result=>{
                console.log(result);
                res.status(200).json({
                    success:true,
                    message:" quiz question updated in the database",
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/interviewquestion'
                    }
                })
            }
        ).catch(err=>console.log(err));
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
   
})



router.delete('/:questionid',(req,res,next)=>{
    const id=req.params.questionid;

    quiz.findByIdAndDelete(id).exec()
    .then(result => {
        if (result) {
            res.status(200).json({
                message: "quiz question deleted from the database",
                request:{
                    type:"Post",
                    url:"http://localhost:3000/quiz",
                    
                }            });
        } else {
            res.status(404).json({
                message: "quiz question not found"
            });
        }
    })
    .catch(err => {
        if (err.kind === 'ObjectId' || err.name === 'CastError') {
            res.status(400).json({
                message: "Invalid question ID format"
            });
        } else {
            console.error(err);
            res.status(500).json({
                message: "Internal server error",
                error: err.message 
            });
        }
    });
})

module.exports=router;


