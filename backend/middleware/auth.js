const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

function authMiddleware(req, res, next) {

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; 
        next(); 
    } catch (err) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}

module.exports = authMiddleware;
