const Joi = require('joi');

const validateBoard = (list) => {
    const schema = Joi.object({
        title: Joi.string().min(3).required(),
    })

    return schema.validate(list);
}


const validateAddUserToBoard = (payload) => {
    const schema = Joi.object({
        userId: Joi.number().required(),
        boardId: Joi.number().required(),
    })

    return schema.validate(payload);
}

module.exports = {
    validateBoard,
    validateAddUserToBoard,
}