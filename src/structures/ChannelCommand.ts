import { GuildMember, Message, TextChannel } from 'discord.js';
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

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(executeOptions: ChannelExecuteContext): Promise<Message | void> {
        throw new Error('Method not implemented.');
    }

    public checkPermissions(msg: Message): { continue: boolean; error?: string } {
        // Check if the command is only for developers.
        if (this.data.devOnly && !this.client.team.includes(msg.author.id)) {
            return { continue: false, error: `Only developers can use this command!` };
        }

        // Check if the command is can only be used in a guild.
        if (this.data.guildOnly && !msg.guild) {
            return { continue: false, error: 'You must be in a server to use this command!' };
        }

        // Check if the command require member voice connection.
        if (this.data.permissions.requireMemberVoiceConnection) {
            if (!msg.member?.voice?.channel) {
                return { continue: false, error: 'You must be in a voice channel to use this command!' };
            }
            // Bot voice channel permissions.
            const voiceChannelPermissions = msg.member?.voice?.channel?.permissionsFor(msg.guild?.me as GuildMember);
            if (!voiceChannelPermissions.has('SPEAK') || !voiceChannelPermissions.has('CONNECT')) {
                return {
                    continue: false,
                    error: `I need the permission ${
                        !voiceChannelPermissions.has('SPEAK') ? '`connect`' : 'speak'
                    } in <#${msg.member?.voice?.channel.id}>`,
                };
            }
        }

        // Check bot and member permissions.
        for (const context in { me: [...this.data.permissions.me], member: [...this.data.permissions.member] }) {
            const permissions = this.data.permissions[context as 'me' | 'member'];

            for (const permission of permissions) {
                const memberPermissions =
                    context == 'me'
                        ? (msg.channel as TextChannel).permissionsFor(msg?.guild?.me as GuildMember)
                        : (msg.channel as TextChannel).permissionsFor(msg?.member as GuildMember);
                if (!memberPermissions?.has(permission)) {
                    return {
                        continue: false,
                        error: `${
                            context == 'me' ? 'I' : 'You'
                        } need the permission ${permission} to use this command!`,
                    };
                }
            }
        }

        return { continue: true };
    }
}
