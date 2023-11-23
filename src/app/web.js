import express from "express";
import { publicRouter } from "../routes/public-api.js";
import { userRouter } from "../routes/api.js";
import { adminRouter } from "../routes/admin-api.js";
import { errorMiddleware } from "../middleware/error-middleware.js";
import path from "path";
import url from "url";

export const web = express()

web.use('/public', express.static(path.join(url.fileURLToPath(new URL('.', import.meta.url)), '..', '..', 'public')));
web.use(express.json())

web.use(publicRouter)
web.use(userRouter)
web.use(adminRouter)

web.use(errorMiddleware)