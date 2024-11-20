import path from "path"
import fs from "fs"

import exceptionLib from "../../lib/exception.lib.js"
import queryFunc from "../../lib/pg.lib.js"
import JWT from "../../lib/jwt.lib.js"

const NewsModel = {
    getAllNew: async function () {        
        const getNew = await queryFunc(`SELECT * FROM new ORDER BY new_created_at ASC`)
        
        return getNew
    },
    getNew: async function (token) {
        
        const decodedToken = JWT.verifyToken(token)
        const getNew = await queryFunc(`SELECT * FROM new WHERE new_creator_id = $1 ORDER BY new_id ASC`, decodedToken)
        
        return getNew
    },
    createNew: async function (body, token, new_image) {
        
        const { new_title, new_desc } = body
        const decodedToken = JWT.verifyToken(token)
        
        const insertInfo = await queryFunc(`INSERT INTO new(new_title, new_desc, new_creator_id) VALUES($1, $2, $3) RETURNING *`, new_title, new_desc, decodedToken)
        
        if (!new_image) {
            return ''
        }
        const new_image_ext = new_image.mimetype.split("/")[1]

        new_image.mv(`${process.cwd()}/uploads/news/${insertInfo[0].new_id}.${new_image_ext}`, (err) => {
            if (err) {
                throw new exceptionLib.HttpException(500, "Internal Server Error", exceptionLib.errors.INTERNAL_SERVER_ERROR)                
            }
        })
        
    },
    editNew: async function (body, token, new_image, new_id) {
        
        const { new_title, new_desc } = body
        const decodedToken = JWT.verifyToken(token)
        const getNew = await queryFunc(`SELECT * FROM new WHERE new_creator_id = $1 AND new_id = $2`, decodedToken, new_id)
        
        if (!getNew.length) {
            throw new exceptionLib.HttpException(404, "New Not Found!", exceptionLib.errors.NOT_FOUND)
        }
        
        const insertInfo = await queryFunc(`UPDATE new SET new_title = $1, new_desc = $2 WHERE new_creator_id = $3 AND new_id = $4 RETURNING *`, new_title || getNew[0].new_title, new_desc || getNew[0].new_desc, decodedToken, new_id)
        
        if (!new_image) {
            return "";
        }

        const imageExt = new_image.mimetype.split("/")[1];
        const uploadPath = path.join(
            process.cwd(),
            "uploads/news",
            `${decodedToken}.${imageExt}`
        );

        const newsFolder = path.join(process.cwd(), "uploads/news");
        const newOldImages = fs.readdirSync(newsFolder);

        const tokenToString = decodedToken.toString();
        const result = newOldImages.find((image) =>
            image.startsWith(tokenToString)
        );

        if (result) {
            const filePath = path.join(newsFolder, result);
            fs.unlinkSync(filePath);
        }

        new_image.mv(uploadPath, (err) => {
            if (err) {
                throw new exceptionLib.HttpException(500, "Internal Server Error", exceptionLib.errors.INTERNAL_SERVER_ERROR);
            }
        });
      
    },
    deleteNew: async function (token, new_id) {
        const decodedToken = JWT.verifyToken(token)
        const getCurrentNew = await queryFunc(`SELECT * FROM new WHERE new_id = $1 AND new_creator_id = $2`, new_id, decodedToken)
        
        if (!getCurrentNew.length) {
            throw new exceptionLib.HttpException(404, "New Not Found", exceptionLib.errors.NOT_FOUND)
        }
        
        await queryFunc(`DELETE FROM new WHERE new_id = $1 AND new_creator_id = $2`, new_id, decodedToken)
        
        const files = fs.readdirSync(`${process.cwd()}/uploads/news`)
        const deletingFile = files.find(file => file = new_id)

        fs.unlinkSync(`${process.cwd()}/uploads/news/${deletingFile}`, (err) => {
            if (err) {
                throw new exceptionLib.HttpException(500, "Internal Server Error", exceptionLib.errors.INTERNAL_SERVER_ERROR)
            }
        })
        
    },
}

export default NewsModel