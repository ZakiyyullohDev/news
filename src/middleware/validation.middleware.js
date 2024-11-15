import expressValidator from "express-validator";

async function checkValidationMiddleware(req, res, next) {
    const errors = expressValidator.validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() })
    }

    return next()
}
export default checkValidationMiddleware