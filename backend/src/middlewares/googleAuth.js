export function extrairToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            error: "Unauthorized user"
        });
    }

    const token = authHeader.split(" ")[1];
    req.accessToken = token;

    next();
}