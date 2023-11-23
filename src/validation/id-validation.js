import Joi from "joi"

const idValidation = Joi.string().min(24).max(24).required()

export default idValidation

