const Joi = require('joi');

const diveSessionRequestBodyValidation = Joi.object({
    date: Joi.date().iso().messages({
        "date.base": "The 'date' field must be a valid ISO date.",
        "date.isoDate": "The 'date' field must be in ISO 8601 format."
    }),
    location: Joi.string().max(100).messages({
        "string.base": "The 'location' field must be a string.",
        "string.max": "The 'location' field must not exceed 100 characters."
    }),
    gpsCoordinates: Joi.object({
        lat: Joi.number().messages({
            "number.base": "The 'lat' field in 'gpsCoordinates' must be a number."
        }),
        lng: Joi.number().messages({
            "number.base": "The 'lng' field in 'gpsCoordinates' must be a number."
        })
    }),
    waterType: Joi.string().valid("SEA", "LAKE").messages({
        "string.base": "The 'waterType' field must be a string.",
        "any.only": "The 'waterType' field must be either 'SEA' or 'LAKE'."
    }),
    temperature: Joi.number().messages({
        "number.base": "The 'temperature' field must be a number."
    }),
    diveCount: Joi.number().integer().min(1).messages({
        "number.base": "The 'diveCount' field must be an integer.",
        "number.min": "The 'diveCount' field must be at least 1."
    }),
    maxDepth: Joi.number().min(0).messages({
        "number.base": "The 'maxDepth' field must be a number.",
        "number.min": "The 'maxDepth' field must be at least 0."
    }),
    maxDiveTime: Joi.number().integer().min(0).messages({
        "number.base": "The 'maxDiveTime' field must be an integer.",
        "number.min": "The 'maxDiveTime' field must be at least 0."
    }),
    notes: Joi.string().max(1000).messages({
        "string.base": "The 'notes' field must be a string.",
        "string.max": "The 'notes' field must not exceed 1000 characters."
    })
});

const validateDiveSessionRequestBody = (req, res, next) => {
    const { error } = diveSessionRequestBodyValidation.validate(req.body, { abortEarly: false });

    if (error) {
        const validationErrors = error.details.map((err) => err.message);
        return res.status(400).json({ message: "Error in request body", errors: validationErrors });
    }

    next();
};

const validateRequestBody = {
    validateDiveSessionRequestBody
}

module.exports = validateRequestBody;