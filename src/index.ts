import { DBConfig } from "./infrastructure/config/DBConfig";
import { createServer } from "./infrastructure/config/app";

const startServer = async () => {

    try {
        await DBConfig()
        const app = createServer()
        app?.listen(3000, () => console.log('Server started successfully'))    
    } catch (error) {
        console.error(error);
    }

}

startServer()