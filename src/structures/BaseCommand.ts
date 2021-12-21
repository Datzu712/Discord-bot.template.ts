/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, PermissionString, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { PathLike } from 'fs-extra';
import Client from '../core/Client';
import Category from './BaseCategory';

export type CommandTypes = 'SLASH_COMMAND' | 'CHANNEL_COMMAND';

export interface ExecuteCommandOptions {
    args: string[];
    prefixUsed?: string;
    msg: Message;
}

export interface IBaseCommand {
    data: {
        /** Command name. */
        name: string;

        /** Command cooldown .*/
        cooldown?: number | null;

        /** Command status. True for disabled (globally) the command. */
        disabled?: boolean;

        permissions?: {
            /** Member permissions. (Text channel) */
            member?: PermissionString[];

            /** Bot permissions. */
            me?: PermissionString[];

            /** Require member voice connection. */
            requireVoiceConnection?: boolean;

            /** Custom command permissions */
            experimentalCustomPermissions?: boolean;
        };
        /** If the command is only for developers. */
        devOnly?: boolean;

        /** The Command can only execute in server. */
        guildOnly?: boolean;

        /** Command description */
        description: string;

        /** Command usage. */
        usage?: string;

        /** Command file path. */
        path?: PathLike;

        /** Command aliases. */
        aliases?: string[];

        /** Command category. */
        category: string | Category;
    };
    execute(...args: unknown[]): Promise<unknown>;
    checkPermissions(...args: unknown[]): boolean;
}

export abstract class BaseCommand implements IBaseCommand {
    /** Command type. (Disable slash command decorator). */
    static readonly type: CommandTypes;

    /**
     * Construct new command.
     * @param { client } client - Client instance.
     * @param { ICommand['data'] } data - Command data.
     */
    public constructor(protected readonly client: Client, public data: IBaseCommand['data']) {}

    /**
     * Execute command.
     * @param { unknown } args - Command arguments.
     * @returns
     */
    abstract execute(...args: unknown[]): Promise<unknown>;

    abstract checkPermissions(...args: unknown[]): boolean;
}
