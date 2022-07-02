declare namespace NodeJS {
    export interface ProcessEnv {
        /** Discord bot token. */
        DISCORD_CLIENT_TOKEN: string;

        /** Default discord bot prefix. */
        DEFAULT_BOT_PREFIX: string;

        /** Sentry DSN. */
        SENTRY_DSN: string;

        /** Discord bot shard config. */
        CLIENT_SHARDS_COUNT: string;

        /** Client mode. */
        NODE_ENV: 'production' | 'development';

        /** MongoDB username */
        MONGO_USERNAME: string;

        /** MongoDB password */
        MONGO_PASSWORD: string;

        /** MongoDB database */
        MONGO_DATABASE: string;

        /** MongoDB port */
        MONGO_PORT: string;

        /** MongoDB Backup DIR */
        MONGO_BACKUP_DIR: string;

        /** MongoDB connection string. */
        MONGO_URI: string;
    }
}
