import { Guild } from 'discord.js';

declare module 'discord.js' {
    export interface Guild {
        queue: null | unknown;
        prefix: string | null;
    }

    export interface ReplyMessageOptions {
        attemptReply?: boolean; // TODO search other name for that
    }
}