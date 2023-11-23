export const adminMiddleware = async (req, res, next) => {
    if (req.user.is_admin) {
        next()
    } else {
        res.status(401).json({
            errors: "Unauthorized"
        })
    }
}