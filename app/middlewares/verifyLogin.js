const checkIfPresentAllLoginDate = (req, res, next) => {
    if(!req.body.username) return res.status(400).send({ message: "Username is necessary." });
    if(!req.body.password) return res.status(400).send({ message: "Password not present." });
    next();
}

const verifySignUp = {
    checkIfPresentAllLoginDate
};

module.exports = verifySignUp;