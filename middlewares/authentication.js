const jwt = require('jsonwebtoken');
const privateKey = process.env.privateKey || "u378ewndwfb23r7y38ru";
exports.authenticate = function (req, res, next) {
    try {
        const token = req.headers.authorization;
        const decodedToken = jwt.verify(token, privateKey);
        const userId = decodedToken.userId;
        req.user = { id: userId }
        next();
    } catch (err) {
        console.error(err)
        res.status(401).json({
            error: 'Token expired'
        });
    }
}