const Joi = require('joi');

module.exports.validate_register = (object_to_validate) => {
    const schema = Joi.object({
        username: Joi.string()
        .required()
        .alphanum(),

        pw: Joi.string()
        .required(),

        access_level: Joi.string()
        .required()
    })
}