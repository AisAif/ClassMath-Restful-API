import gradeService from "../service/grade-service.js"

const create = async (req, res, next) => {
    try {
        const result = await gradeService.create(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await gradeService.get(req.params.idGrade)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await gradeService.update(req, req.params.idGrade)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await gradeService.remove(req.params.idGrade)
        res.status(200).json({
            data: "Grade deleted"
        })
    } catch (error) {
        next(error)
    }
}

const getAll = async (req, res, next) => {
    try {
        const result = await gradeService.getAll()
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