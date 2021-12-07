/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, PermissionString, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
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

        /** If the command only use in guilds. */
        guildOnly?: boolean;

        /** Command description */
        description: string;

        /** Command usage. */
        usage?: string;

        /** Command path. */
        path?: PathLike;

        /** Command aliases. */
        aliases?: string[];

        /** Command category. */
        category: string | Category;
    };
    execute(args: ExecuteCommandOptions | CommandInteraction): Promise<void>;
    // send(messageOptions: unknown): Promise<Message>;
}

export abstract class BaseCommand implements ICommand {
    /** Command type. Please don't edit it. */
    static readonly type: CommandTypes = 'TEXT_COMMAND';

    /**
     * Construct new command.
     * @param { client } client - Client instance.
     * @param { ICommand['data'] } data - Command data.
     */
    public constructor(public readonly client: Client, public data: ICommand['data']) {}

    /*public send(messageOptions: unknown): Promise<Message<boolean>> {
        throw new Error('Method not implemented.');
    }*/

    public execute(args: ExecuteCommandOptions | CommandInteraction): Promise<void> {
        throw new Error('Method not implemented.');
    }

    /**
     * Check permissions.
     * @param param0
     * @returns
     */
    public checkPermissions({ channel, member }: { member?: GuildMember; channel?: TextChannel }): boolean {
        // (Remove this validation if you want) Developers can skip permissions to execute commands with -f at least argument (prefix.command arg1 arg2 -f).

        if (this.data.disabled === true || (this.data.guildOnly === true && !channel)) return false;

        return true;
    }
}
