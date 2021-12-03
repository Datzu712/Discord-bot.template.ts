/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, PermissionString, CommandInteraction } from 'discord.js';
import { PathLike } from 'fs-extra';
import Client from '../core/Client';
import Category from './BaseCategory';

export type CommandTypes = 'SLASH_COMMAND' | 'TEXT_COMMAND';

export interface ExecuteCommandOptions {
    args: string[];
    prefixUsed?: string;
    msg: Message;
}

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
        category: string | Category;
    }
    execute(args: ExecuteCommandOptions | CommandInteraction): Promise<void>;
    send(messageOptions: unknown): Promise<Message>;
}

export class BaseCommand implements ICommand {

    /** Command type. Please don't edit it. */
    static readonly type: CommandTypes = 'TEXT_COMMAND';

    /** Command data, */
    public data: ICommand['data'];

    /**
     * Construct new command.
     * @param { client } client - Client instance. 
     * @param { ICommand['data'] } data - Command data. (REQUIRED)
     */
    public constructor(public readonly client: Client, data?: ICommand['data']) {
        if(!data)
            throw new Error('Command data is required. This param is marked optional only for decorators.');

        this.data = data;
    }
    public send(messageOptions: unknown): Promise<Message<boolean>> {
        throw new Error('Method not implemented.');
    }

    public execute(args: ExecuteCommandOptions | CommandInteraction): Promise<void> {
        throw new Error('Method not implemented.');
    }


}