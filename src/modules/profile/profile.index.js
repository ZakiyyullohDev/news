import expressValidator from "express-validator"
import express from 'express'

import authorizationMiddleware from '../../middleware/authorization.middleware.js'
import checkValidationMiddleware from "../../middleware/validation.middleware.js"
import uploadFileMiddleware from "../../middleware/uploadFile.middleware.js"
import profileCtrl from './profile.ctrl.js'
const app = express.Router()

app.get("/api/profile/", authorizationMiddleware, profileCtrl.getMe)

app.patch("/api/profile/", authorizationMiddleware, [
    [
        expressValidator.body("user_first_name").optional().isString().isLength({
            min: 3,
            max: 16
        }),
        expressValidator.body("user_last_name").optional().isString().isLength({
            min: 3,
            max: 16
        }),
        expressValidator.body("user_email").optional().isEmail(),
        expressValidator.body("user_password").optional().isString().isLength({
            min: 8,
            max: 32
        }),
    ]
], checkValidationMiddleware, uploadFileMiddleware(false), profileCtrl.editProfile)

app.get("/api/profile/image", authorizationMiddleware, profileCtrl.getProfileImage)

export default app