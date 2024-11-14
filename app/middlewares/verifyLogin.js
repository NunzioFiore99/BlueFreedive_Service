const checkIfPresentAllLoginDate = async (req, res, next) => {
    try {
        if(!req.body.username && !req.body.email) return res.status(400).send({ message: "Username or Email is necessary." });
        if(!req.body.password) return res.status(400).send({ message: "Password not present." });

        next();
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
}

const verifySignUp = {
    checkIfPresentAllLoginDate
};

module.exports = verifySignUp;