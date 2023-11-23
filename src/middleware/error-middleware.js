import ResponseError from "../error/response-error.js"

const errorMiddleware = async (err, req, res, next) => {
    if (!err) {
        next()
        return
    }

    if(err instanceof ResponseError) {
        res.status(err.status).json({
            errors: err.message
        }).end()
    } else {
        let errors = err.message
        if (err.meta && 'relation_name' in err.meta) {
            errors = "Data ini berelasi dengan data lain. Pastikan hapus terlebih dahulu data terkait."
            res.status(400).json({
                errors 
            }).end()
        }
        // console.log(err)
        res.status(500).json({
            errors 
        }).end()
    }
}

export {
    errorMiddleware
}