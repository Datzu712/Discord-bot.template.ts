import dotnev from 'dotenv';
import { ShardingManager } from "discord.js";
import Logger from './core/Logger';
import { resolve } from "path";
dotnev.config();

const logger = new Logger('../logs');

const totalShards = (process.env.CLIENT_SHARD_CONFIG === 'auto') ? 'auto' : parseInt(process.env.CLIENT_SHARD_CONFIG);

process.on("unhandledRejection", (error: Error) => {
    logger.error(error, 'unhandledRejection');
});

const shardManager = new ShardingManager(resolve(`${__dirname}/index.ts`), {
    token: process.env.BOT_TOKEN,
    totalShards,
    respawn: true,
    mode: 'process'
});

shardManager.on('shardCreate', (shard) => {
    logger.info(`Shard ${shard.id} created`, 'ShardManager');

    shard
        .on('disconnect', () => logger.warn(`Shard ${shard.id} disconnected`, 'ShardManager'))
        .on('reconnecting', () => logger.warn(`Shard ${shard.id} reconnecting`, 'ShardManager'))
        .on('error', (error) => logger.error(error, 'ShardManager'));

}).spawn({ amount: totalShards })
    .catch((error) => logger.error(error, 'ShardManager'))
    .then(() => logger.info(`Shards ${shardManager.shards.size}/${totalShards} spawned.`, 'ShardManager'));