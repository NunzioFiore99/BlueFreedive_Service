const Joi = require('joi');

const isHashed = (password) => {
    return password && password.startsWith('$2a$');
};

// Schema
const userRequestBodyValidationPatch = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: true } })
        .required()
        .messages({
            'string.base': 'L\'email deve essere una stringa.',
            'string.empty': 'L\'email non può essere vuota.',
            'string.email': 'L\'email deve essere un\'email valida.',
            'any.required': 'L\'email è un campo obbligatorio.'
        }),

    password: Joi.string()
        .min(8)
        .max(30)
        .pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/)
        .required()
        .messages({
            'string.base': 'La password deve essere una stringa.',
            'string.empty': 'La password non può essere vuota.',
            'string.min': 'La password deve contenere almeno 8 caratteri.',
            'string.max': 'La password può contenere al massimo 30 caratteri.',
            'string.pattern.base': 'La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale.',
            'any.required': 'La password è un campo obbligatorio.'
        }),
});

const userRequestBodyValidationPost = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'Il nome utente deve essere una stringa.',
            'string.empty': 'Il nome utente non può essere vuoto.',
            'string.min': 'Il nome utente deve contenere almeno 3 caratteri.',
            'string.max': 'Il nome utente può contenere al massimo 30 caratteri.',
            'any.required': 'Il nome utente è un campo obbligatorio.'
        }),

    email: Joi.string()
        .email({ tlds: { allow: true } })
        .required()
        .messages({
            'string.base': 'L\'email deve essere una stringa.',
            'string.empty': 'L\'email non può essere vuota.',
            'string.email': 'L\'email deve essere un\'email valida.',
            'any.required': 'L\'email è un campo obbligatorio.'
        }),

    roles: Joi.array()
        .items(Joi.string().valid('ADMIN', 'USER'))
        .min(1)
        .required()
        .messages({
            'array.base': 'I ruoli devono essere un array.',
            'array.min': 'I ruoli devono contenere almeno un elemento.',
            'any.required': 'I ruoli sono un campo obbligatorio.',
            'array.includes': 'Ogni ruolo deve essere "ADMIN" o "USER".'
        })
});

const usersRequestBodyValidationPost = Joi.array()
    .items(userRequestBodyValidationPost)
    .required()
    .messages({
        'array.base': 'La richiesta deve essere un array di utenti.',
        'any.required': 'Il corpo della richiesta è obbligatorio.'
    });

const userRequestBodyValidationPut = Joi.object({
    username: Joi.string()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'Il nome utente deve essere una stringa.',
            'string.empty': 'Il nome utente non può essere vuoto.',
            'string.min': 'Il nome utente deve contenere almeno 3 caratteri.',
            'string.max': 'Il nome utente può contenere al massimo 30 caratteri.',
            'any.required': 'Il nome utente è un campo obbligatorio.'
        }),

    email: Joi.string()
        .email({ tlds: { allow: true } })
        .required()
        .messages({
            'string.base': 'L\'email deve essere una stringa.',
            'string.empty': 'L\'email non può essere vuota.',
            'string.email': 'L\'email deve essere un\'email valida.',
            'any.required': 'L\'email è un campo obbligatorio.'
        }),

    password: Joi.string()
        .custom((value, helpers) => {
            if (isHashed(value)) {
                return value;
            }
            const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            if (!passwordPattern.test(value)) {
                return helpers.message('La password deve contenere almeno 8 caratteri, una lettera, un numero e un carattere speciale.');
            }
            return value;
        })
        .required()
        .messages({
            'string.base': 'La password deve essere una stringa.',
            'string.empty': 'La password non può essere vuota.',
            'any.required': 'La password è un campo obbligatorio.',
        }),

    roles: Joi.array()
        .items(Joi.string().valid('ADMIN', 'USER'))
        .min(1)
        .required()
        .messages({
            'array.base': 'I ruoli devono essere un array.',
            'array.min': 'I ruoli devono contenere almeno un elemento.',
            'any.required': 'I ruoli sono un campo obbligatorio.',
            'array.includes': 'Ogni ruolo deve essere "ADMIN" o "USER".'
        })
});

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

const userProfileRequestBodyValidation = Joi.object({
    gender: Joi.string()
        .valid('MALE', 'FEMALE', 'OTHER')
        .required()
        .messages({
            'string.base': 'Il genere deve essere una stringa.',
            'any.only': 'Il genere deve essere uno tra "MALE", "FEMALE" o "OTHER".',
            'any.required': 'Il genere è un campo obbligatorio.'
        }),

    birthdate: Joi.string()
        .isoDate()
        .required()
        .messages({
            'string.base': 'La data di nascita deve essere una stringa.',
            'string.isoDate': 'La data di nascita deve essere nel formato "YYYY-MM-DD".',
            'any.required': 'La data di nascita è un campo obbligatorio.'
        }),

    firstName: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.base': 'Il nome deve essere una stringa.',
            'string.empty': 'Il nome non può essere vuoto.',
            'string.min': 'Il nome deve contenere almeno 1 carattere.',
            'string.max': 'Il nome può contenere al massimo 100 caratteri.',
            'any.required': 'Il nome è un campo obbligatorio.'
        }),

    lastName: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.base': 'Il cognome deve essere una stringa.',
            'string.empty': 'Il cognome non può essere vuoto.',
            'string.min': 'Il cognome deve contenere almeno 1 carattere.',
            'string.max': 'Il cognome può contenere al massimo 100 caratteri.',
            'any.required': 'Il cognome è un campo obbligatorio.'
        }),

    weight: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'Il peso deve essere un numero.',
            'number.positive': 'Il peso deve essere un valore positivo.',
            'any.required': 'Il peso è un campo obbligatorio.'
        }),

    height: Joi.number()
        .positive()
        .required()
        .messages({
            'number.base': 'L\'altezza deve essere un numero.',
            'number.positive': 'L\'altezza deve essere un valore positivo.',
            'any.required': 'L\'altezza è un campo obbligatorio.'
        })
});

const authRequestBodySignUpValidation = Joi.object({
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required()
        .messages({
            'string.base': 'Il nome utente deve essere una stringa.',
            'string.alphanum': 'Il nome utente può contenere solo lettere e numeri.',
            'string.min': 'Il nome utente deve contenere almeno 3 caratteri.',
            'string.max': 'Il nome utente può contenere al massimo 30 caratteri.',
            'any.required': 'Il nome utente è un campo obbligatorio.'
        }),

    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'L\'email deve essere una stringa.',
            'string.email': 'L\'email deve essere un\'email valida.',
            'any.required': 'L\'email è un campo obbligatorio.'
        }),

    password: Joi.string()
        .min(8)
        .regex(/[a-z]/)
        .regex(/[A-Z]/)
        .regex(/[0-9]/)
        .regex(/[\W_]/)
        .required()
        .messages({
            'string.base': 'La password deve essere una stringa.',
            'string.min': 'La password deve contenere almeno 8 caratteri.',
            'string.pattern.base': 'La password deve contenere almeno una lettera maiuscola, una minuscola, un numero e un carattere speciale.',
            'any.required': 'La password è un campo obbligatorio.'
        }),

    roles: Joi.array()
        .items(Joi.string().valid('ADMIN', 'USER'))
        .min(1)
        .required()
        .messages({
            'array.base': 'I ruoli devono essere un array di stringhe.',
            'array.min': 'Devi fornire almeno un ruolo.',
            'array.includes': 'I ruoli devono essere uno tra "ADMIN" o "USER".',
            'any.required': 'I ruoli sono un campo obbligatorio.'
        })
});

const authRequestBodyLoginValidation = Joi.object({
    username: Joi.string()
        .required()
        .messages({
            'any.required': 'Il nome utente è un campo obbligatorio.'
        }),

    password: Joi.string()
        .required()
        .messages({
            'any.required': 'La password è un campo obbligatorio.'
        })
});

// Functions
function validateUserRequestBodyPatch(req, res, next) {
    const { error } = userRequestBodyValidationPatch.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

function validateUsersRequestBodyPost(req, res, next) {
    const { error } = usersRequestBodyValidationPost.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

function validateUserRequestBodyPut(req, res, next) {
    const { error } = userRequestBodyValidationPut.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const validateDiveSessionRequestBody = (req, res, next) => {
    const { error } = diveSessionRequestBodyValidation.validate(req.body, { abortEarly: false });
    if (error) {
        const validationErrors = error.details.map((err) => err.message);
        return res.status(400).json({ message: "Error in request body", errors: validationErrors });
    }
    next();
};

function validateUserProfileRequestBody(req, res, next) {
    const { error } = userProfileRequestBodyValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

function validateAuthSignUpRequestBody(req, res, next) {
    const { error } = authRequestBodySignUpValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

function validateAuthLoginRequestBody(req, res, next) {
    const { error } = authRequestBodyLoginValidation.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }
    next();
}

const validateRequestBody = {
    validateUserRequestBodyPatch,
    validateUsersRequestBodyPost,
    validateUserRequestBodyPut,
    validateDiveSessionRequestBody,
    validateUserProfileRequestBody,
    validateAuthSignUpRequestBody,
    validateAuthLoginRequestBody
}

module.exports = validateRequestBody;