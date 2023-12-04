import { prismaClient } from "../app/database.js"
import ResponseError from "../error/response-error.js"
import deleteFile from "../utils/delete-file.js"
import { commit } from "../utils/upload-file.js"
import idValidation from "../validation/id-validation.js"
import { contentTutorialValidation } from "../validation/tutorial-validation.js"
import { validate } from "../validation/validation.js"

const create = async (request) => {
    validate(idValidation, request.params.idGrade)
    const totalGrade = await prismaClient.grade.count({
        where: {
            id: request.params.idGrade
        }
    })

    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade not found")
    }

    request.body.idGrade = request.params.idGrade
    const tutorial = validate(contentTutorialValidation, request.body)

    if (!request.files) {
        throw new ResponseError(400, "File is not found")
    }

    if (!request.files.tutorial_image) {
        throw new ResponseError(400, "Image not found")
    }

    if (!request.files.tutorial_file) {
        throw new ResponseError(400, "File not found")
    }

    request.files.tutorial_image.type = "tutorial_image"
    const imagePath = commit(request.files.tutorial_image)

    request.files.tutorial_file.type = "tutorial_file"
    const filePath = commit(request.files.tutorial_file)

    const result = await prismaClient.tutorial.create({
        data: {
            title: tutorial.title,
            chapter: tutorial.chapter,
            id_grade: tutorial.idGrade,
            tutorial_image: imagePath,
            tutorial_file: filePath
        },
        select: {
            id: true,
            title: true,
            chapter: true,
            tutorial_image: true,
            tutorial_file: true,
            grade: true,
        }
    })
    return result
}
const get = async (idGrade, idTutorial) => {
    validate(idValidation, idGrade)
    validate(idValidation, idTutorial)
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

    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade and Tutorial not found")
    }

    const result = await prismaClient.tutorial.findUnique({
        where: {
            id: idTutorial
        },
        select: {
            id: true,
            title: true,
            chapter: true,
            tutorial_image: true,
            tutorial_file: true,
            grade: true
        }
    })

    if (!result) {
        throw new ResponseError(404, "Tutorial not found")
    }

    return result
}
const update = async (request) => {
    await validate(idValidation, request.params.idGrade)
    await validate(idValidation, request.params.idTutorial)
    const totalGrade = await prismaClient.grade.count({
        where: {
            id: request.params.idGrade,
            tutorials: {
                some: {
                    id: request.params.idTutorial
                }
            }
        }
    })

    
    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade and Tutorial not found")
    }

    request.body.idGrade = request.params.idGrade

    const tutorial = validate(contentTutorialValidation, request.body)

    const data = {
        title: tutorial.title,
        chapter: tutorial.chapter,
        id_grade: tutorial.idGrade,
    }

    if (request.files) {
        let filesWillDelete = []
        const lastTutorial = await prismaClient.tutorial.findUnique({
            where: {
                id: request.params.idTutorial
            },
            select: {
                tutorial_image: true,
                tutorial_file: true
            }
        })

        if (request.files.tutorial_image) {
            filesWillDelete.push(lastTutorial.tutorial_image)
            request.files.tutorial_image.type = "tutorial_image"
            data.tutorial_image = commit(request.files.tutorial_image)
        }

        if (request.files.tutorial_file) {
            filesWillDelete.push(lastTutorial.tutorial_file)
            request.files.tutorial_file.type = "tutorial_file"
            data.tutorial_file = commit(request.files.tutorial_file)
        }

        if (filesWillDelete.length > 0) {
            await deleteFile(filesWillDelete)
        }
    }


    const result = await prismaClient.tutorial.update({
        where: {
            id: request.params.idTutorial
        },
        data,
        select: {
            id: true,
            title: true,
            chapter: true,
            tutorial_image: true,
            tutorial_file: true,
            grade: true,
        }
    })
    return result
}
const remove = async (idGrade, idTutorial) => {
    validate(idValidation, idGrade)
    validate(idValidation, idTutorial)
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

    if (totalGrade !== 1) {
        throw new ResponseError(404, "Grade and Tutorial not found")
    }

    const tutorial = await prismaClient.tutorial.findUnique({
        where: {
            id: idTutorial
        },
        select: {
            tutorial_image: true,
            tutorial_file: true
        }
    })

    await prismaClient.tutorial.delete({
        where: {
            id: idTutorial
        }
    })

    await deleteFile([tutorial.tutorial_image, tutorial.tutorial_file])

    return
}

const getAllByIdGrade = async (req) => {
    return await prismaClient.tutorial.findMany({
        where: {
            id_grade: req.params.idGrade
        },
        select: {
            id: true,
            title: true,
            chapter: true,
            tutorial_image: true,
            tutorial_file: true,
            grade: true,
        }
    })
}

export default {
    create,
    get,
    update,
    remove,
    getAllByIdGrade
}