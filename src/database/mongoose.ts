import mongoose from 'mongoose';
import Logger from '../core/Logger';

export default class Mongodb {
    static connect = (logger?: Logger) => {
        const before = Date.now();
        try {
            mongoose.connect(process.env.MONGODB_URL, {
                maxPoolSize: 7,
                autoIndex: false,
            });

            mongoose.connection
                .on('error', (error) => logger?.error(error, 'mongoose'))
                .on('open', async () => {
                    const ping: number = await new Promise((resolve) => {
                        mongoose.connection.db.admin().ping(() => resolve(Date.now() - before));
                    });

                    logger?.info(`Connected to MongoDb with ${ping}ms`, 'mongoose');
                });
        } catch (err) {
            logger?.error(err instanceof Error ? err : new Error(err as string), 'mongoose');
        }
    };
}
