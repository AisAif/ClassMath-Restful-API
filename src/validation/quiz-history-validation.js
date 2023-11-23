import Joi from "joi"

const answerValidation = (totalQuestion) => Joi.object({
    id_quiz: Joi.string().min(24).max(24).required(),
    username: Joi.string().max(100).required(),
    answers: Joi.array().items(Joi.string().valid("A", "B", "C", "D", null)).required().min(totalQuestion).max(totalQuestion),
})

export {
    answerValidation
}