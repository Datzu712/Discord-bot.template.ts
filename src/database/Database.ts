import mongoose from 'mongoose';

import { type Logger } from '../structures/Logger';
import { mongoURI } from '../config/config';

export default class Database {
    static async connect(logger?: Logger): Promise<void> {
        const before = Date.now();

        await mongoose.connect(mongoURI, {
            maxPoolSize: 7,
            autoIndex: false,
        });

        const ping: number = await new Promise((resolve) => {
            mongoose.connection.db.admin().ping(() => resolve(Date.now() - before));
        });
        logger?.info(`Connected to MongoDB with ${ping}ms`, 'Database');
    }
}
