import fileUpload from "express-fileupload"
import ResponseError from "../error/response-error.js"

const upload = fileUpload({
    limits: {
        fileSize: 30 *1024 * 1024,
    },
    abortOnLimit: true,
})

export const commit = (file) => {
    const fileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + file.mimetype.split('/')[1]
    const __dirname = new URL('.', import.meta.url).pathname;
    const publicPath = `public/`
    if (file.type === "grade_image" ) {
        file.mv(publicPath + 'images/grades/' + fileName, function(err) {
            if (err) throw new ResponseError(500, err)
        })
        return publicPath + 'images/grades/' + fileName
    } else if (file.type === "tutorial_image" ) {
        file.mv(publicPath + 'images/tutorials/' + fileName, function(err) {
            if (err) throw new ResponseError(500, err)
        })
        return publicPath + 'images/tutorials/' + fileName
    } else if (file.type === "quiz_image" ) {  
        file.mv(publicPath + 'images/quizzes/' + fileName, function(err) {
            if (err) throw new ResponseError(500, err)
        })
        return publicPath + 'images/quizzes/' + fileName
    } else if (file.type === "tutorial_file" ) {  
        file.mv(publicPath + 'assets/tutorials/' + fileName, function(err) {
            if (err) throw new ResponseError(500, err)
        })
        return publicPath + 'assets/tutorials/' + fileName
    } else if (file.type === "question_file" ) {  
        file.mv(publicPath + 'assets/questions/' + fileName, function(err) {
            if (err) throw new ResponseError(500, err)
        })
        return publicPath + 'assets/questions/' + fileName
    }
    
    throw new ResponseError(400, "Bad request on upload file")
}

// const upload = multer({
//     // dest: '../../public/images/' + folder,
//     storage: multer.diskStorage({
//         destination: (req, file, cb) => {
//             if (file.fieldname == "grade_image") {
//                 cb(null, `public/images/grades`)
//             } else if (file.fieldname == "tutorial_image") {
//                 cb(null, `public/images/tutorials`)
//             } else if (file.fieldname == "quizz_image") {
//                 cb(null, `public/images/quizzes`)
//             } else if (file.fieldname == "tutorial_file") {
//                 cb(null, `public/assets/tutorials`)
//             }

//             new ResponseError(400, "Bad request on storage")
//         },
//         filename: (req, file, cb) => {
//             const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//             cb(null, uniqueSuffix + '.' + file.mimetype.split('/')[1])
//         }
//     }),
//     limits: {
//         fileSize: 30 *1024 * 1024,
//     },
//     fileFilter: function (req, file, cb) {
//         if (file.fieldname == "grade_image" || file.fieldname == "tutorial_image" || file.fieldname == "quizz_image") {
//             if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
//                 cb(null, true)
//             } else {
//                 cb(null, false)
//             }
//         } else if (file.fieldname == "tutorial_file") {
//             if (file.mimetype == "application/pdf") {
//                 cb(null, true)
//             } else {
//                 cb(null, false)
//             }
//         }
//         new ResponseError(400, "Bad request on file filter")
//     }
// })

export default upload