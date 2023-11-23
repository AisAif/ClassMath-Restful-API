import Joi from "joi"

const contentGradeValidation = Joi.object({
    name: Joi.string().max(100).required(),
})

export {
    contentGradeValidation,
}