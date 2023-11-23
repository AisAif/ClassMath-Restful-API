import questionService from "../service/question-service.js"

const create = async (req, res, next) => {
    try {
        const result = await questionService.create(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await questionService.update(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await questionService.remove(req)
        res.status(200).json({
            data: "Question deleted"
        })
    } catch (error) {
        next(error)
    }
}

export default {
    create,
    update,
    remove
}