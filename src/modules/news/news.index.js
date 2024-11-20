import expressValidator from 'express-validator'
import express from 'express'

import checkValidationMiddleware from '../.././middleware/validation.middleware.js'
import authorizationMiddleware from '../../middleware/authorization.middleware.js'
import uploadFileMiddleware from '../../middleware/uploadFile.middleware.js'
import newsCtrl from './news.ctrl.js'

const app = express.Router()

app.get("/api/new/:news_id", authorizationMiddleware, [
    [
        expressValidator.param("new_id").notEmpty().isInt()
    ]
], checkValidationMiddleware, newsCtrl.getNew)

app.get("/api/new/", authorizationMiddleware, newsCtrl.getAllNew)

app.post("/api/new/", authorizationMiddleware,[
    [
        expressValidator.body("new_title").notEmpty().isString().isLength({
            min: 3,
            max: 256,
        }),
        expressValidator.body("new_desc").notEmpty().isString().isLength({
            min: 3,
            max: 256,
        }),
    ],
], checkValidationMiddleware, uploadFileMiddleware(false), newsCtrl.createNew);

app.patch("/api/new/:news_id", authorizationMiddleware, [
    [
        expressValidator.body("news_title").optional().isString().isLength({
            min: 3,
            max: 256
        }),
        expressValidator.body("news_desc").optional().isString().isLength({
            min: 3,
            max: 256
        }),
    ]
], checkValidationMiddleware, uploadFileMiddleware(false), newsCtrl.editNew)

app.delete("/api/new/:new_id", authorizationMiddleware, [
    [
        expressValidator.param("new_id").notEmpty().isInt()
    ]
], checkValidationMiddleware, newsCtrl.deleteNew)

export default app