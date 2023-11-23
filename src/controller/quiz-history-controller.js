import quizHistoryService from "../service/quiz-history-service.js"

const createOrUpdate = async (req, res, next) => {
    try {
        const result = await quizHistoryService.createOrUpdate(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await quizHistoryService.get(req.user.username, req.params.username, req.params.idQuiz)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await quizHistoryService.remove(req.params.idQuizHistory)
        res.status(200).json({
            data: "Quiz history deleted"
        })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await quizHistoryService.getAll()
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export default {
    createOrUpdate,
    get,
    remove,
    getAll
}