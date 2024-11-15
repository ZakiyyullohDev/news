import dotenv from "dotenv"

import ProfileModel from "./profile.model.js"
import exceptionLib from "../../lib/exception.lib.js";

dotenv.config()

const profileCtrl = {
    getMe: async function (req, res, next) {
        const userInfo = await ProfileModel.getMe(req.headers.authorization)
        return res.status(200).json(userInfo)
    },
    
    editProfile: async function (req, res, next) {
        try {
            const model = await ProfileModel.editProfile(req.body, req.headers.authorization, req.files.user_image)
            return res.status(200).json({
                status: 200,
                message: "Profile Succesfully Edited!",
                model
            })
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    },
    
    getProfileImage: async function (req, res, next) {
        try {
            const filePath = await ProfileModel.getProfileImage(req.headers.authorization);
            return res.status(200).sendFile(filePath);
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    }
};

export default profileCtrl