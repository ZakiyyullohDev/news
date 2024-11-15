import authModel from "./auth.model.js";

const authCtrl = {
    register: async function (req, res, next) {
        try {
            await authModel.register(req.body)

            return res.status(201).json({
                status: 201,
                message: "Successfully registered!"
            })
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    },
    login: async function (req, res, next) {
        try {
            
            const token = await authModel.login(req.body);

            await authModel.login(req.body)

            return res.status(200).json({
                status: 200,
                message: "Successfully logined!",
                token
            })
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    }
}

export default authCtrl