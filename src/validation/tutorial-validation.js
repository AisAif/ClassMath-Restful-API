import Joi from "joi"

const contentTutorialValidation = Joi.object({
    chapter: Joi.number().required(),
    title: Joi.string().max(100).required(),
    idGrade: Joi.string().max(100).required(),
})

export {
    contentTutorialValidation,
}