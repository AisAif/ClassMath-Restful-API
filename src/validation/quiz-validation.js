import Joi from "joi"

const contentQuizValidation = Joi.object({
    idTutorial: Joi.string().max(100).required(),
    idGrade: Joi.string().max(100).required(),
    title: Joi.string().max(100).required(),
})

export {
    contentQuizValidation,
}