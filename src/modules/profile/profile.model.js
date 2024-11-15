import fs from "fs"

import __dirname from "../../config/dirname.config.js";
import exceptionLib from "../../lib/exception.lib.js";
import queryFunc from "../../lib/pg.lib.js";
import JWT from "../../lib/jwt.lib.js";

const ProfileModel = {
    getMe: async function (token) {
        const decodedToken = await JWT.verifyToken(token);
        
        const getUserInfo = await queryFunc(
            `SELECT * FROM users WHERE user_id = $1`,
            decodedToken
        );
        
        getUserInfo[0].forEach(user => delete user.user_password)
        
        return getUserInfo[0]
    },
    editProfile: async function (body, token, user_image) {
        const { user_first_name, user_last_name, user_email, user_password } = body;

        const decodedToken = await JWT.verifyToken(token);
        const uploadPath = `${process.cwd()}/uploads/users/${decodedToken}.jpg`

        const getUserInfo = await queryFunc(
            `SELECT 
                user_first_name,
                user_last_name,
                user_email,
                user_password
            FROM users WHERE user_id = $1`,
            decodedToken
        );

        const updateUser = await queryFunc(
            `UPDATE users SET user_first_name = $1, user_last_name = $2, user_email = $3, user_password = $4 WHERE user_id = $5 RETURNING *`,
            user_first_name || getUserInfo[0].user_first_name,
            user_last_name || getUserInfo[0].user_last_name,
            user_email || getUserInfo[0].user_email,
            user_password || getUserInfo[0].user_password,
            decodedToken
        );

        user_image.mv(uploadPath, (err) => {
            if (err) {
                throw new exceptionLib.HttpException(500, "Internal Server Error", exceptionLib.errors.INTERNAL_SERVER_ERROR)
            }
        })

        getUserInfo[0].forEach(user => delete user.user_password)
        return updateUser[0]
        
    },
    getProfileImage: async function (token) { 
        const decodedToken = await JWT.verifyToken(token);
        
        const path = `${process.cwd()}/uploads/user/${decodedToken}.jpg`;
    
        const checkFileExists = fs.existsSync(path);
    
        if (!checkFileExists) {
            throw new exceptionLib.HttpException(404, "File Not Found", exceptionLib.errors.NOT_FOUND)
        }
    
        return path;
    }
};

export default ProfileModel;
