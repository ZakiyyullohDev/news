import exceptionLib from "../lib/exception.lib.js";
import queryFunc from "../lib/pg.lib.js";
import JWT from "../lib/jwt.lib.js";

async function authorizationMiddleware(req, res, next) {
    try {
        
        const headers = req.headers
        if (!headers) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization error',
                error: exceptionLib.errors.AUHORIZATION_ERROR
            })
        }

        if (!headers.authorization) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization error',
                error: exceptionLib.errors.AUHORIZATION_ERROR
            })
        }

        const verifyToken = JWT.verifyToken(headers.authorization)
        if (verifyToken === "JWT_VERIFY_ERROR_TOKEN_EXPIRED") {
            return res.status(401).json({
                status: 401,
                message: 'Authorization error',
                error: exceptionLib.errors.AUHORIZATION_ERROR
            })
        }

        const checkUser = await queryFunc(`select * from users where user_id = $1`, verifyToken)
        if (!checkUser.length) {
            return res.status(401).json({
                status: 401,
                message: 'Authorization error',
                error: exceptionLib.errors.AUHORIZATION_ERROR
            })
        }

        return next()
    } catch (error) {
        return res.status(500).json({
            status: 500,
            message: 'Internal Server Error',
            error: exceptionLib.errors.INTERNAL_SERVER_ERROR
        })
    }
}

export default authorizationMiddleware