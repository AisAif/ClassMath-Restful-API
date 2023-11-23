import { logger } from "./app/logging.js";
import { web } from "./app/web.js";

web.listen(process.env.PORT, () => {
    logger.info(`App start at port: ${process.env.PORT}`)
})