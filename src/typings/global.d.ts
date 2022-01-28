/**
 * Like function global type.
 * R = return type
 * 
 * A = arguments
 */
declare type LikeFunction<R, A = undefined> = (args?: A) => R;

/**
 * Type for function object property params.
 * (Require 1 or more object properties)
 */
declare type RequireAtLeastOneOf<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
    {
        [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
    }[Keys];

// https://stackoverflow.com/questions/39713349/make-all-properties-within-a-typescript-interface-optional/40076355
declare type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? Partial<T[P]> : T[P];
};

declare namespace NodeJS {
    export interface ProcessEnv {
        /** Discord bot token. */
        BOT_TOKEN: string;

        /** MongoDB connection string. */
        MONGODB_URL: string;

        /** Default discord bot prefix. */
        DEFAULT_BOT_PREFIX: string;

        /** Sentry DSN. */
        SENTRY_DSN: string;

        /** Discord webhook URL. (For logs handler) */
        DISCORD_WEBHOOK_URL: string;

        /** Discord bot shard config. */
        CLIENT_SHARD_CONFIG: string;

        /** Client mode. */
        NODE_ENV: 'production' | 'development';
    }
}