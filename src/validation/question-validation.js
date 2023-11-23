import Joi from "joi"

const questionValidation = Joi.object({
    content: Joi.string().optional(),
    choices: Joi.array().items(Joi.string()).min(4).max(4).required(),
    answer: Joi.string().required().valid("A", "B", "C", "D"),
    id_quiz: Joi.string().max(100).required(),
})

export {
    questionValidation
}