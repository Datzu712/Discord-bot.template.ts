import dotnev from 'dotenv';
import { ShardingManager } from 'discord.js';
import { Logger } from './core/Logger';
import { resolve } from 'path';
dotnev.config();

const logger = new Logger({
    defaultService: 'ShardManager',
    folderPath: resolve(__dirname, '../logs'),
    debugAllowed: process.env.NODE_ENV === 'development',
});

const totalShards =
    process.env.CLIENT_SHARD_CONFIG === 'auto' ? 'auto' : parseInt(process.env.CLIENT_SHARDS_COUNT as string);

const shardManager = new ShardingManager(resolve(`${__dirname}/index.js`), {
    token: process.env.BOT_TOKEN,
    totalShards,
    respawn: true,
    mode: 'process',
});

logger.info(`Creating shards...`);

shardManager
    .on('shardCreate', (shard) => {
        logger.info(`Shard ${shard.id} created. ${shardManager.shards.size}/${totalShards}`);

        shard
            .on('disconnect', () => logger.warn(`Shard ${shard.id} disconnected`))
            .on('reconnection', () => logger.warn(`Shard ${shard.id} reconnecting`))
            .on('error', (error) => logger.error(error));
    })
    .spawn({ amount: totalShards })
    .catch((error) => logger.error(error))
    .then(() => logger.info(`Shards ${shardManager.shards.size}/${totalShards} spawned.`));
