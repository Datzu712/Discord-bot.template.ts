import { Guild as djsGuild } from 'discord.js';

declare module 'discord.js' {
    export interface Guild /*extends djsGuild*/ {
        queue: null | unknown;
        prefix: string | null;
    }
}