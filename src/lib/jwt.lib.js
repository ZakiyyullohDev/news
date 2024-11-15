import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const JWT = {
    generateToken: function (payload) {
        try {
            return jwt.sign( { user_id: payload }, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN } )
        } catch (error) {
            return 'JWT_SIGN_ERROR'
        }
    },
    verifyToken: function (token) {
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY,)
            return decodedToken.user_id
        } catch (error) {
            if (error.message.includes("jwt expired")) {
                return 'JWT_VERIFY_ERROR_TOKEN_EXPIRED'
            }
        }
    }
}

export default JWT