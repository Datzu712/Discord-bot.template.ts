declare type likeFunction = (...args: any) => any;

declare namespace NodeJS {
    export interface ProcessEnv {
        BOT_TOKEN: string;
        
        MONGODB_URL: string;

        DEFAULT_BOT_PREFIX: string;

        SENTRY_DSN: string;

        DISCORD_WEBHOOK_URL: string;
    }
}