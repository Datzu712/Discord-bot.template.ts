import mongoose from 'mongoose';
import Logger from '../core/Logger';

export default class Mongodb {
    static connect = (logger: Logger) => {

        const before = Date.now();

        mongoose.connect(process.env.MONGODB_URL, {
            maxPoolSize: 7,
            autoIndex: false
        });

        mongoose.connection
            .on('error', (error) => logger.error(error, 'mongoose'))
            .on('open', async () => {
                const ping: number = await new Promise((resolve) => {
                    mongoose.connection.db.admin()
                        .ping(() => resolve(Date.now() - before));
                });

                logger.info(`Connected with MongODb with ${ping}ms`, 'mongoose');
            });
    };
}