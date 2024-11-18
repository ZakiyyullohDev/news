import path from "path";
import fs from "fs";

import __dirname from "../../config/dirname.config.js";
import exceptionLib from "../../lib/exception.lib.js";
import queryFunc from "../../lib/pg.lib.js";
import JWT from "../../lib/jwt.lib.js";

const ProfileModel = {
    getMe: async function (token) {
        const decodedToken = await JWT.verifyToken(token);

        const getUserInfo = await queryFunc(
            `SELECT
            user_id,
            user_first_name,
            user_last_name,
            user_email,
            user_created_at
            FROM users WHERE user_id = $1`,
            decodedToken
        );

        return getUserInfo[0];
    },
    editProfile: async function (body, token, user_image) {
        const { user_first_name, user_last_name, user_email, user_password } = body;

        const decodedToken = await JWT.verifyToken(token);

        const getUserInfo = await queryFunc(
            `SELECT 
                user_first_name,
                user_last_name,
                user_email,
                user_password
            FROM users WHERE user_id = $1`,
            decodedToken
        );

        await queryFunc(
            `UPDATE users SET 
                user_first_name = $1, 
                user_last_name = $2, 
                user_email = $3, 
                user_password = $4 
            WHERE user_id = $5`,
            user_first_name || getUserInfo[0].user_first_name,
            user_last_name || getUserInfo[0].user_last_name,
            user_email || getUserInfo[0].user_email,
            user_password || getUserInfo[0].user_password,
            decodedToken
        );

        if (!user_image) {
            return "";
        }

        const imageExt = user_image.mimetype.split("/")[1];
        const uploadPath = path.join(
            process.cwd(),
            "uploads/users",
            `${decodedToken}.${imageExt}`
        );

        const usersFolder = path.join(process.cwd(), "uploads/users");
        const userOldImages = await fs.promises.readdir(usersFolder);

        const tokenToString = decodedToken.toString();
        const result = userOldImages.find((image) =>
            image.startsWith(tokenToString)
        );

        if (result) {
            const filePath = path.join(usersFolder, result);
            await fs.promises.unlink(filePath);
        }

        user_image.mv(uploadPath, (err) => {
            if (err) {
                throw new exceptionLib.HttpException(
                    500,
                    "Internal Server Error",
                    exceptionLib.errors.INTERNAL_SERVER_ERROR
                );
            }
        });
    },
    getProfileImage: async function (token) {
        const decodedToken = await JWT.verifyToken(token);

        const files = await fs.promises.readdir(`${process.cwd()}/uploads/users`);
        const gettingFile = files.find((file) => (file = decodedToken));

        const path = `${process.cwd()}/uploads/users/${gettingFile}`;

        const checkFileExists = fs.existsSync(path);

        if (!checkFileExists) {
            throw new exceptionLib.HttpException(
                404,
                "File Not Found",
                exceptionLib.errors.NOT_FOUND
            );
        }

        return path;
    },
};

export default ProfileModel;
