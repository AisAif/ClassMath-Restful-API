import { prismaClient } from "../app/database.js"
import ResponseError from "../error/response-error.js"
import deleteFile from "../utils/delete-file.js"
import { commit } from "../utils/upload-file.js"
import { contentGradeValidation } from "../validation/grade-validation.js"
import { validate } from "../validation/validation.js"
import idValidation from "../validation/id-validation.js"

const create = async (request) => {
    const grade = validate(contentGradeValidation, request.body)
    if (!request.files) {
        throw new ResponseError(400, "Image not found")
    }

    if (!request.files.grade_image) {
        throw new ResponseError(400, "Image not found")
    }

    request.files.grade_image.type = "grade_image"
    const imagePath = commit(request.files.grade_image)

    const result = await prismaClient.grade.create({
        data: {
            name: grade.name,
            grade_image: imagePath
        },
        select: {
            id: true,
            name: true,
            grade_image: true,
        }
    })
    return result
}

const get = async (id) => {
    id = validate(idValidation, id)
    const result = await prismaClient.grade.findUnique({
        where: {
            id
        },
        select: {
            id: true,
            name: true,
            grade_image: true,
        }
    })

    if (!result) {
        throw new ResponseError(404, "Grade not found")
    }

    return result
}

const update = async (request, id) => {
    id = validate(idValidation, id)
    const totalGrade = await prismaClient.grade.count({
        where: {
            id
        }
    })
    
    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade not found")
    }
    const grade = validate(contentGradeValidation, request.body)
    
    const data = grade

    if (request.files && request.files.grade_image) {
        const lastGrade = await prismaClient.grade.findUnique({
            where: {
                id
            },
            select: {
                grade_image: true
            }
        })
        await deleteFile([lastGrade.grade_image])
        
        request.files.grade_image.type = "grade_image"
        const imagePath = commit(request.files.grade_image)
        data.grade_image = imagePath
    }


    const result = await prismaClient.grade.update({
        where: {
            id
        },
        data,
        select: {
            id: true,
            name: true,
            grade_image: true,
        }
    })
    return result
}

const remove = async (id) => {
    id = validate(idValidation, id)
    const totalGrade = await prismaClient.grade.count({
        where: {
            id
        }
    })

    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade not found")
    }

    
    const lastGrade = await prismaClient.grade.findUnique({
        where: {
            id
        },
        select: {
            grade_image: true
        }
    })
    
    await prismaClient.grade.delete({
        where: {
            id
        },
    })

    
    await deleteFile([lastGrade.grade_image])
}

const getAll = async () => {
    return prismaClient.grade.findMany()
}

export default {
    create,
    get,
    update,
    remove,
    getAll
}