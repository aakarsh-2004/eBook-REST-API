import app from './src/app';
import { config } from './src/config/config';
import connectDb from './src/config/db';


const startServer = async () => {
    const port = config.port || 6969;

    app.listen(port, () => {
        console.log(`${new Date()} Listening on port ${port}`);
    });
};

startServer();
connectDb()