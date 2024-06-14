import { DBConfig } from "./infrastructure/config/DBConfig";
import { createServer } from "./infrastructure/config/app";
import dotenv from "dotenv"
import path from "path";
import server from "./providers/socketIO";

dotenv.config({ path: path.resolve(__dirname, ".env")})
const startServer = async () => {

    try {
        await DBConfig()
        // const app = createServer()
        // app?.listen(process.env.PORT || 3000, () => console.log('Server started successfully'))  
        server.listen(process.env.PORT || 3000, () => console.log('Server Connected Successfully'));
    } catch (error) {
        console.error(error);
    }

}

startServer()