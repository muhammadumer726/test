const express = require('express');
const router = express.Router();
const Quiz = require('../model/quiz_model');
const Result = require('../model/result_model');
const mongoose = require('mongoose');

/// Check result API
router.post('/:difficulty', async (req, res, next) => {
    console.log('This is a POST request');
    const difficulty = req.params.difficulty;
    const userAnswers = req.body.answers; 
    const userId = req.body.userid;

    try {
        const questions = await Quiz.find({ difficulty: difficulty })
            .select("question key _id")
            .exec();

        if (questions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No quiz found for the specified difficulty level"
            });
        }
        if (userAnswers.length !== questions.length) {
            return res.status(400).json({
                success: false,
                message: "The number of answers provided does not match the number of questions"
            });
        }

        
        let score = 0;
        let correctAnswers = [];

        for (let i = 0; i < questions.length; i++) {
            if (questions[i].key === userAnswers[i]) {
            }
            correctAnswers.push(questions[i].key); 
        }
        const result = new Result({
            _id: new mongoose.Types.ObjectId(),
            userId: userId,
            quizMarks: score,
            difficulty: difficulty
        });

        await result.save(); 
        return res.status(200).json({
            success: true,
            totalQuestions: questions.length,
            correctAnswers: score,
            incorrectAnswers: questions.length - score,
            allCorrectAnswers: correctAnswers  
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            error: err.message
        });
    }
});


///get all result API

router.get('/:userid', async (req, res, next) => {
    console.log('This is a GET request for user results');
    const userId = req.params.userid;

    try {
        const results = await Result.find({ userId: userId }).exec();

        if (results.length > 0) {
            const response = {
                success: true,
                count: results.length,
                results: results
            };
            res.status(200).json(response);
        } else {
            res.status(404).json({
                success: true,
                message: "No results found for the specified user"
            });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: err.message
        });
    }
});

module.exports = router;
