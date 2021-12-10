/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, PermissionString, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import { PathLike } from 'fs-extra';
import Client from '../core/Client';
import Category from './BaseCategory';
import { BaseCommand, IBaseCommand, CommandTypes } from './BaseCommand';

export interface ExecuteCommandOptions {
    args: string[];
    prefixUsed?: string;
    msg: Message;
}

export abstract class BaseChannelCommand extends BaseCommand implements IBaseCommand {
    /** Command type. (Disable slash command decorators). */
    static readonly type: CommandTypes = 'CHANNEL_COMMAND';

    /**
     * Construct new command.
     * @param { client } client - Client instance.
     * @param { object } data - Command data.
     */
    public constructor(public readonly client: Client, public data: IBaseCommand['data']) {
        super(client, data);
    }

    /*public send(messageOptions: unknown): Promise<Message<boolean>> {
        throw new Error('Method not implemented.');
    }*/

    public checkPermissions(context: Message): boolean {
        // (Remove this validation if you want) Developers can skip permissions to execute commands with -f at least argument (prefix.command arg1 arg2 -f).

        if (context instanceof CommandInteraction) throw new Error('Context must be a Message instance.');

        if (this.data.disabled === true || (this.data.guildOnly === true && !context.guild)) return false;

        return true;
    }
}
