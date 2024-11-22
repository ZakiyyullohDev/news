import NewsModel from "./news.model.js"

const newsCtrl = {
    getAllNew: async function (req, res) {
        try {
            const model = await NewsModel.getAllNew(req.headers.authorization)
            return res.status(200).json(model)
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    },
    getNew: async function (req, res) {
        try {
            const model = await NewsModel.getNew(req.headers.authorization, req.params.news_id)
            return res.status(200).json(model)
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    },
    createNew: async function (req, res) {
        
        try {
            await NewsModel.createNew(req.body, req.headers.authorization, req.files.new_image)
            return res.status(201).json({
                status: 201,
                message: "New Succesfully Added"
            })
            
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
        
    },
    editNew: async function (req, res) {
        try {
            const newImage = req.files ? req.files.new_image : null;
            const model = await NewsModel.editNew(req.body, req.headers.authorization, newImage, req.params.news_id);
            
            return res.status(200).json({
                status: 200,
                message: "New edited succesfully!"
            });
        } catch (error) {    
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            });
        }
    },
    
    deleteNew: async function (req, res) {
        try {
            
            await NewsModel.deleteNew(req.headers.authorization, req.params.new_id);

            return res.status(200).json({
                status: 200,
                message: "new Deleted Successfully!"
            });
        } catch (error) {
            return res.status(error.status).json({
                status: error.status,
                message: error.message,
                error: error.error
            })
        }
    }
}

export default newsCtrl