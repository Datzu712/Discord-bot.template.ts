import mongoose from 'mongoose';

import { type Logger } from '../structures/Logger';
import { mongoConfig } from '../config/config';

export default class DatabaseConnection {
    static async connect(logger?: Logger): Promise<void> {
        const before = Date.now();
        try {
            await mongoose.connect(mongoConfig.uri, {
                maxPoolSize: 7,
                autoIndex: false,
            });

            const ping: number = await new Promise((resolve) => {
                mongoose.connection.db.admin().ping(() => resolve(Date.now() - before));
            });
            logger?.info(`Connected to MongoDb with ${ping}ms`, 'DatabaseConnection');
        } catch (error) {
            logger?.error(error, 'DatabaseConnection');
        }
    }
}
