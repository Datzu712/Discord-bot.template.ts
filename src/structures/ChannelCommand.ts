/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, CommandInteraction, GuildMember, TextChannel } from 'discord.js';
import Client from '../core/Client';
import { BaseCommand, IBaseCommand, CommandTypes } from './BaseCommand';

export interface ChannelExecuteContext {
    args: string[];
    prefix: string;
    msg: Message;
}

export class ChannelCommand extends BaseCommand implements IBaseCommand {
    /** Command type. (Disable slash command decorators). */
    static readonly type: CommandTypes = 'CHANNEL_COMMAND';

    /**
     * Construct new command.
     * @param { client } client - Client instance.
     * @param { object } data - Command data.
     */
    public constructor(public readonly client: Client, public data: Required<IBaseCommand['data']>) {
        super(client, data);
    }

    /*public send(messageOptions: unknown): Promise<Message<boolean>> {
        throw new Error('Method not implemented.');
    }*/

    public checkPermissions(context: Message): boolean {
        // (Remove this validation if you want) Developers can skip permissions to execute commands with -f at least argument (prefix.command arg1 arg2 -f).

        return true;

        if (context instanceof CommandInteraction) throw new Error('Context must be a Message instance.');

        if (this.data.disabled === true || (this.data.guildOnly === true && !context.guild)) return false;

        if (this.data.permissions?.requireVoiceConnection === true && !context.member?.voice.channel) return false;

        if (this.data.permissions?.me?.length !== 0) {
            for (const permission of this.data.permissions.me as []) {
                if (!(context.channel as TextChannel).permissionsFor(context?.guild?.me as GuildMember).has(permission))
                    return false;
            }
        }
        return true;
    }

    public execute(executeOptions: ChannelExecuteContext): Promise<Message | void> {
        throw new Error('Method not implemented.');
    }
}
