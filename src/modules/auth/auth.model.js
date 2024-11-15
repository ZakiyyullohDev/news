import dotenv from "dotenv";

import exceptionLib from "../../lib/exception.lib.js";
import queryFunc from "../../lib/pg.lib.js";
import JWT from "../../lib/jwt.lib.js"

dotenv.config()

const authModel = {
    register: async function (body) {
        const {
            user_first_name,
            user_last_name,
            user_email,
            user_password,
        } = body

        const checkEmail = await queryFunc('select * from users where user_email = $1;', user_email)
        if (checkEmail.length) {
            throw new exceptionLib.HttpException(409, "Email Already Exists", exceptionLib.errors.ALREADY_EXISTS)
        }

        await queryFunc(
            'insert into users (user_first_name, user_last_name, user_email, user_password) values ($1, $2, $3, $4);', 
            user_first_name, user_last_name, user_email, user_password
        );
          
    },
    login: async function (body) {
        const {
            user_email,
            user_password,
        } = body

        const getUserInfo = await queryFunc(
            'SELECT * FROM users WHERE user_email = $1 AND user_password = $2',
            user_email, user_password
        );    
        
        if (!getUserInfo.length) {
            throw new exceptionLib.HttpException(400, "Wrong Login Or Password", exceptionLib.errors.AUHORIZATION_ERROR)
        }

        const token = JWT.generateToken(getUserInfo[0].user_id)
        if (token === "JWT_SIGN_ERROR") {
            throw new exceptionLib.HttpException(500, "INTERNAL SERVER ERROR", exceptionLib.errors.INTERNAL_SERVER_ERROR)
        }
        return token

    }
}

export default authModel