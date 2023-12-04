import tutorialService from "../service/tutorial-service.js"

const create = async (req, res, next) => {
    try {
         const result = await tutorialService.create(req)
         res.status(200).json({
             data: result
         })       
    } catch (error) {
        next(error)
    }
}

const get = async (req, res, next) => {
    try {
        const result = await tutorialService.get(req.params.idGrade, req.params.idTutorial)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const update = async (req, res, next) => {
    try {
        const result = await tutorialService.update(req)
        res.status(200).json({
            data: result
        })
    } catch (error) {
        next(error)
    }
}

const remove = async (req, res, next) => {
    try {
        await tutorialService.remove(req.params.idGrade, req.params.idTutorial)
        res.status(200).json({
            data: "Tutorial deleted"    
        })
    } catch (error) {
        next(error)
    }
}

const getAllByIdGrade = async (req, res, next) => {
    try {
        const result = await tutorialService.getAllByIdGrade(req)
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
    getAllByIdGrade
}