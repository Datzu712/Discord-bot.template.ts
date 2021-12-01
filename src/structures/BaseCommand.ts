import { Message, PermissionString } from 'discord.js';
import { PathLike } from 'fs-extra';
import Client from '../core/Client';
import Category from './Category';

export interface ICommand {
    data: {
        /** Command name. */
        name: string;

        /** Command cooldown .*/
        cooldown?: number;

        /** Command disabled. True for disabled (globally) the command. */
        disabled?: boolean;

        permissions?: {
            /** Member permissions. (Text channel) */
            member?: PermissionString[],

            /** Bot permissions. */
            me?: PermissionString[],

            /** Evaluate if the member is on a voice channel */
            requireVoiceConnection?: boolean,

            /** This is for custom permissions in guilds. */
            experimentalCustomPermissions?: boolean
        }
        /** If the command is only for developers */
        devOnly?: boolean;

        /** If the command only use in guilds */
        guildOnly?: boolean;

        /** Command description */
        description: string;

        /** Command usage */
        usage?: string;

        /** Command path */
        path?: PathLike;

        /** Command aliases */
        aliases?: string[];

        /** Command category */
        category?: string | Category;
    }
    execute(args: unknown): Promise<void>;
    send(messageOptions: unknown): Promise<Message>;
}

export abstract class BaseCommand implements ICommand {

    public constructor(public client: Client, public data: ICommand['data']) {}

    public abstract execute(args: unknown): Promise<void>;
    public abstract send(messageOptions: unknown): Promise<Message>;
    
}