import fs from "fs"

// true or flase
async function folderConfigs(path, folderName) {
    try {
        const checkFile = fs.existsSync(path + folderName)
        
        if (!checkFile) {
            fs.mkdirSync(path + folderName)
        }
        
    } catch (error) {
        console.log(error)
    }
}

export default folderConfigs