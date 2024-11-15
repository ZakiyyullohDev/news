import expressValidator from 'express-validator'
import express from 'express'

import checkValidationMiddleware from '../../middleware/validation.middleware.js'
import authCtrl from './auth.ctrl.js'

const app = express.Router()

app.post("/api/auth/register", [
    [
        expressValidator.body("user_first_name").notEmpty().isString().isLength({
            min: 3,
            max: 16
        }),
        expressValidator.body("user_last_name").notEmpty().isString().isLength({
            min: 3,
            max: 16
        }),
        expressValidator.body("user_email").notEmpty().isEmail(),
        expressValidator.body("user_password").notEmpty().isString().isLength({
            min: 8,
            max: 32
        }),
    ],
], checkValidationMiddleware, authCtrl.register)

app.post("/api/auth/login", [
    [
        expressValidator.body("user_email").notEmpty().isEmail(),
        expressValidator.body("user_password").notEmpty().isString().isLength({
            min: 8,
            max: 32
        }),
    ]
], checkValidationMiddleware, authCtrl.login)

export default app