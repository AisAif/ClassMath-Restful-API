import { prismaClient } from "../app/database.js"
import ResponseError from "../error/response-error.js"
import idValidation from "../validation/id-validation.js"
import { contentQuizValidation } from "../validation/quiz-validation.js"
import { validate } from "../validation/validation.js"

const create = async (req) => {
    
    req.body.idGrade = req.params.idGrade
    req.body.idTutorial = req.params.idTutorial

    validate(idValidation, req.body.idGrade)
    validate(idValidation, req.body.idTutorial)

    const totalGrade = await prismaClient.grade.count({
        where: {
            id: req.body.idGrade,
            tutorials: {
                some: {
                    id: req.body.idTutorial
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial not found")
    }

    const quiz = validate(contentQuizValidation, req.body)

    const result = await prismaClient.quiz.create({
        data: {
            title: quiz.title,
            id_tutorial: quiz.idTutorial,
            created_at: new Date().toISOString()
        },
        select: {
            id: true,
            title: true,
            created_at: true
        }
    })

    return result
}

const get = async (idGrade, idTutorial, idQuiz) => {
    validate(idValidation, idGrade)
    validate(idValidation, idTutorial)
    validate(idValidation, idQuiz)
    const totalGrade = await prismaClient.grade.count({
        where: {
            id: idGrade,
            tutorials: {
                some: {
                    id: idTutorial
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial or Quiz not found")
    }

    const result = await prismaClient.quiz.findUnique({
        where: {
            id: idQuiz
        },
        select: {
            id: true,
            title: true,
            questions: {
                select: {
                    id: true,
                    choices: true,
                    content: true,
                    question_file: true
                }
            },
            created_at: true
        }
    })

    return result
}

const update = async (req) => {
    req.body.idGrade = req.params.idGrade
    req.body.idTutorial = req.params.idTutorial

    validate(idValidation, req.body.idGrade)
    validate(idValidation, req.body.idTutorial)
    validate(idValidation, req.params.idQuiz)

    const totalGrade = await prismaClient.grade.count({
        where: {
            id: req.body.idGrade,
            tutorials: {
                some: {
                    id: req.body.idTutorial,
                    quizzes: {
                        some: {
                            id: req.params.idQuiz
                        }
                    }
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial or Quiz not found")
    }

    const quiz = validate(contentQuizValidation, req.body)

    const result = await prismaClient.quiz.update({
        where: {
            id: req.params.idQuiz
        },
        data: {
            title: quiz.title
        },
        select: {
            id: true,
            title: true,
            questions: true,
            created_at: true,
        }
    })

    return result
}

const remove = async (idGrade, idTutorial, idQuiz) => {
    validate(idValidation, idGrade)
    validate(idValidation, idTutorial)
    validate(idValidation, idQuiz)
    
    const totalGrade = await prismaClient.grade.count({
        where: {
            id: idGrade,
            tutorials: {
                some: {
                    id: idTutorial
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial or Quiz not found")
    }

    await prismaClient.quiz.delete({
        where: {
            id: idQuiz
        },
    })

    return 
}

const getAllByIdTutorial = async (req) => {
    return await prismaClient.quiz.findMany({
        where: {
            id_tutorial: req.params.idTutorial  
        },
        select: {
            id: true,
            title: true,
            questions: {
                select: {
                    id: true,
                    choices: true,
                    content: true,
                    question_file: true
                }
            },
            created_at: true
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    getAllByIdTutorial
}