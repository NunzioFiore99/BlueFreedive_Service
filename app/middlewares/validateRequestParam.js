const mongoose = require('mongoose');

const validateIdPathParam = (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID." });
    }

    next();
};

const validateRequestParam = {
    validateIdPathParam
};

module.exports = validateRequestParam;