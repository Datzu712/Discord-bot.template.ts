import djs from "discord.js";

declare module 'discord.js' {
    export interface Guild extends djs.Guild {
        queue: any | null;
    }
}