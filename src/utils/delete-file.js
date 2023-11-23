import fs from "fs"

const deleteFile = async (filePaths) => {
    filePaths.forEach(async filePath => {
        await fs.promises.unlink(filePath)
    });
}

export default deleteFile