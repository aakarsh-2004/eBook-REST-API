import {config as conf} from 'dotenv';

conf();

const _config = {
    port: process.env.PORT,
    apiKey: '',
    mongoUri: process.env.MONGO_URI,
    env: process.env.NODE_ENV,
    JWT_SECRET: process.env.JWT_SECRET
}

export const config = Object.freeze(_config);