declare namespace NodeJS {
    export interface ProcessEnv {
        BOT_TOKEN: string;
        
        MONGODB_URL: string;

        BOT_PREFIX: string;
    }
}