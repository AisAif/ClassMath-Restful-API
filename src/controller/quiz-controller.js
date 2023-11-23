import quizService from "../service/quiz-service.js"

const create = async (req, res, next) => {
    try {
        const result = await quizService.create(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await quizService.get(req.params.idGrade, req.params.idTutorial, req.params.idQuiz)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await quizService.update(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await quizService.remove(req.params.idGrade, req.params.idTutorial, req.params.idQuiz)
        res.status(200).json({
            data: "Quiz deleted"
        })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await quizService.getAll()
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    get,
    update,
    remove,
    getAll
}