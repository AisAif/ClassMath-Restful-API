import { prismaClient } from "../app/database.js"
import { validate } from "../validation/validation.js"
import { questionValidation } from "../validation/question-validation.js"
import { commit } from "../utils/upload-file.js"
import deleteFile from "../utils/delete-file.js"
import idValidation from "../validation/id-validation.js"
import ResponseError from "../error/response-error.js"

const create = async (req) => {
    validate(idValidation, req.params.idGrade)
    validate(idValidation, req.params.idTutorial)
    validate(idValidation, req.params.idQuiz)

    req.body.id_quiz = req.params.idQuiz
    if (req.body.choices) {
        req.body.choices = JSON.parse(req.body.choices)
    }
    const question = validate(questionValidation, req.body)


    const totalGrade = await prismaClient.grade.count({
        where: {
            id: req.params.idGrade,
            tutorials: {
                some: {
                    id: req.params.idTutorial,
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

    if (req.files && req.files.question_file) {
        req.files.question_file.type = "question_file"
        question.question_file = commit(req.files.question_file)
    }

    return prismaClient.question.create({
        data: {
            ...question,
        },
        select: {
            id: true,
            answer: true,
            question_file: true,
            choices: true,
            content: true,
        }
    })

}

const update = async (req) => {
    validate(idValidation, req.params.idGrade)
    validate(idValidation, req.params.idTutorial)
    validate(idValidation, req.params.idQuiz)
    validate(idValidation, req.params.idQuestion)

    req.body.id_quiz = req.params.idQuiz
    if (req.body.choices) req.body.choices = JSON.parse(req.body.choices)
     
    const question = validate(questionValidation, req.body)

    const totalGrade = await prismaClient.grade.count({
        where: {
            id: req.params.idGrade,
            tutorials: {
                some: {
                    id: req.params.idTutorial,
                    quizzes: {
                        some: {
                            id: req.params.idQuiz,
                            questions: {
                                some: {
                                    id: req.params.idQuestion
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial or Quiz or Question not found")
    }

    if (req.files && req.files.question_file) {
        const lastQuestion = await prismaClient.question.findFirst({
            where: {
                id: req.params.idQuestion
            },
            select: {
                question_file: true
            }
        })

        await deleteFile([lastQuestion.question_file])

        req.files.question_file.type = "question_file"
        question.question_file = commit(req.files.question_file)
    }

    return prismaClient.question.update({
        where: {
            id: req.params.idQuestion
        },
        data: {
            ...question,
        },
        select: {
            id: true,
            answer: true,
            question_file: true,
            choices: true,
            content: true,
        }
    })
}

const remove = async (req) => {
    validate(idValidation, req.params.idGrade)
    validate(idValidation, req.params.idTutorial)
    validate(idValidation, req.params.idQuiz)
    validate(idValidation, req.params.idQuestion)

    const totalGrade = await prismaClient.grade.count({
        where: {
            id: req.params.idGrade,
            tutorials: {
                some: {
                    id: req.params.idTutorial,
                    quizzes: {
                        some: {
                            id: req.params.idQuiz,
                            questions: {
                                some: {
                                    id: req.params.idQuestion
                                }
                            }
                        }
                    }
                }
            }
        }
    })

    if (totalGrade === 0) {
        throw new ResponseError("Grade or Tutorial or Quiz or Question not found")
    }

    const lastQuestion = await prismaClient.question.findFirst({
        where: {
            id: req.params.idQuestion
        },
        select: {
            question_file: true
        }
    })

    
    await prismaClient.question.delete({
        where: {
            id: req.params.idQuestion
        }
    })
    
    await deleteFile([lastQuestion.question_file])
}

export default {
    create,
    update,
    remove
}