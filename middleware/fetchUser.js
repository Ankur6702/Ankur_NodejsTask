const jwt = require('jsonwebtoken');
const JWT_SECRET = "#";

const fetchUser = async (req, res, next) => {
    const token = req.header('token');
    if (!token) {
        return res.json({
            status: 'error',
            message: 'No token, authorization denied for psychiatrist'
        });
    }
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.psy = decoded;
        next();
    }
    catch (error) {
        res.json({
            status: 'error',
            message: 'Token is not valid'
        });
    }
};

module.exports = fetchUser;