import { prismaClient } from "../app/database.js"
import ResponseError from "../error/response-error.js"
import idValidation from "../validation/id-validation.js"
import { answerValidation } from "../validation/quiz-history-validation.js"
import { validate } from "../validation/validation.js"

const createOrUpdate = async (req) => {
    validate(idValidation, req.params.idQuiz)

    
    if (req.user.username !== req.params.username) {
        throw new ResponseError(400, "Username not match")
    }

    const totalQuiz = await prismaClient.quiz.count({
        where: {
            id: req.params.idQuiz
        }
    })

    if (totalQuiz !== 1) {
        throw new ResponseError(400, "Quiz not found")
    }

    const totalQuestions = await prismaClient.question.count({
        where: {
            id_quiz: req.params.idQuiz
        }
    })

    req.body.username = req.user.username
    req.body.id_quiz = req.params.idQuiz
    const userAnswers = validate(answerValidation(totalQuestions), req.body).answers

    const quiz = await prismaClient.quiz.findUnique({
        where: {
            id: req.params.idQuiz
        },
        select: {
            questions: true
        }
    })

    let correctAnswer = 0
    for (let index = 0; index < quiz.questions.length; index++) {
        if (quiz.questions[index].answer === userAnswers[index]) {
            correctAnswer++
        }
    }

    let score = correctAnswer / quiz.questions.length * 100
    let wrongAnswer = quiz.questions.length - correctAnswer
    let notAnswered = userAnswers.filter(answer => answer === null).length


    const totalQuizHistory = await prismaClient.quizHistory.count({
        where: {
            username: req.user.username,
            id_quiz: req.params.idQuiz
        }
    })

    if (totalQuizHistory === 0) {
        await prismaClient.user.update({
            where: {
                username: req.user.username
            },
            data: {
                total_score: {
                    increment: score
                }
            }
        })

        return prismaClient.quizHistory.create({
            data: {
                username: req.user.username,
                id_quiz: req.params.idQuiz,
                correct: correctAnswer,
                wrong: wrongAnswer,
                not_answered: notAnswered,
                score: score,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            }
        })
        
    }

    // const lastQuizHistory = await prismaClient.quizHistory.findFirst({
    //     where: {
    //         username: req.user.username,
    //         id_quiz: req.params.idQuiz
    //     },
    //     select: {
    //         score: true
    //     }
    // })

    // let addScoreToTotalScore = score - lastQuizHistory.score

    // await prismaClient.user.update({
    //     where: {
    //         username: req.user.username
    //     },
    //     data: {
    //         total_score: {
    //             increment: addScoreToTotalScore
    //         }
    //     }
    // })

    const allQuizHistory = await prismaClient.quizHistory.findMany({
        where: {
            username: req.user.username,
        },
        select: {
            score: true
        }
    })

    let totalScore = allQuizHistory.reduce((a, b) => a + b.score, 0)

    await prismaClient.user.update({
        where: {
            username: req.user.username
        },
        data: {
            total_score: totalScore
        }
    })

    return prismaClient.quizHistory.update({
        where: {
            username: req.user.username,
            id_quiz: req.params.idQuiz,
        },
        data: {
            correct: correctAnswer,
            wrong: wrongAnswer,
            not_answered: notAnswered,
            score: score,
            updated_at: new Date().toISOString(),
        }
    })
}

const get = async (loggedInUsername, username, idQuiz) => {
    validate(idValidation, idQuiz)

    if (loggedInUsername !== username) {
        throw new ResponseError(400, "Username not match")
    }

    const totalQuiz = await prismaClient.quiz.count({
        where: {
            id: idQuiz
        }
    })

    if (totalQuiz !== 1) {
        throw new ResponseError(400, "Quiz not found")
    }

    return prismaClient.quizHistory.findUnique({
        where: {
            username: username,
            id_quiz: idQuiz,
        }
    })
}

const remove = async (idQuizHistory) => {
    validate(idValidation, idQuizHistory)
    const totalQuizHistory = await prismaClient.quizHistory.count({
        where: {
            id: idQuizHistory
        }
    })

    if (totalQuizHistory !== 1) {
        throw new ResponseError(400, "Quiz history not found")
    }
    return prismaClient.quizHistory.delete({
        where: {
            id: idQuizHistory
        }
    })
}

const getAll = async () => {
    return prismaClient.quizHistory.findMany()
}

export default {
    createOrUpdate,
    get,
    remove,
    getAll
}