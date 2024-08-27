const jwt=require("jsonwebtoken");
module.exports = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ message: "auth failed" });
        }
        const token = authHeader.split(" ")[1];
        console.log('Authorization Header:', authHeader);
        console.log('Token:', token);

        const decoded = jwt.verify(token, process.env.JWT_KEY,{ ignoreExpiration: true });
        console.log('Decoded:', decoded);
        req.userData = decoded;
        next();
    } catch (error) {
        console.error('JWT Verification Error:', error);
        return res.status(401).json({
            message: "auth failed"
        });
    }
};
