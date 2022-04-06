import { GuildMember, Message, TextChannel } from 'discord.js';
import Client from '../core/Client';
import { BaseCommand, IBaseCommand, CommandTypes } from './BaseCommand';

// TODO Search better name for this interface D:.
export interface ChannelExecuteContext {
    args: string[];
    prefix: string;
    msg: Message;
}

export class ChannelCommand extends BaseCommand {
    /** Command type. (Disable slash command decorators). */
    static readonly type: CommandTypes = 'CHANNEL_COMMAND';

    /**
     * Construct new command.
     * @param { client } client - Client instance.
     * @param { Required<IBaseCommand['data']> } data - Command data.
     */
    public constructor(public readonly client: Client, public data: Required<IBaseCommand['data']>) {
        super(client, data);
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public execute(_: ChannelExecuteContext): Promise<Message | void> {
        throw new Error(`Method not implemented in ${this.data.name} (${__filename}).`);
    }

    /**
     * Check permissions before executing the command.
     * @param { Message } message - Message object.
     * @returns { object } If the command can be executed.
     */
    public permissionsFor(message: Message): { continue: boolean; error?: string } {
        // Check if the command can be only used in a guild.
        if (this.data.guildOnly && !message.guild) {
            return { continue: false, error: 'You must be in a server to use this command!' };
        }

        // Check if the command require member voice connection.
        if (this.data.permissions.requireMemberVoiceConnection) {
            if (!message.member?.voice?.channel) {
                return { continue: false, error: 'You must be in a voice channel to use this command!' };
            }
            // Bot voice channel permissions.
            const voiceChannelPermissions = message.member?.voice?.channel?.permissionsFor(
                message.guild?.me as GuildMember,
            );
            if (!voiceChannelPermissions.has('SPEAK') || !voiceChannelPermissions.has('CONNECT')) {
                return {
                    continue: false,
                    error: `I need the permission ${
                        !voiceChannelPermissions.has('SPEAK') ? '`connect`' : 'speak'
                    } in <#${message.member?.voice?.channel.id}>`,
                };
            }
        }
        // Check bot and member permissions in the guild.
        if (message.guild) {
            // The idea of this for is don't repeat the same code evaluating the bot and member permissions.
            for (const context in { member: [...this.data.permissions.member], me: [...this.data.permissions.me] }) {
                const permissions = this.data.permissions[context as 'me' | 'member'];

                for (const permission of permissions) {
                    const memberPermissions =
                        context == 'me'
                            ? (message.channel as TextChannel).permissionsFor(message?.guild?.me as GuildMember)
                            : (message.channel as TextChannel).permissionsFor(message?.member as GuildMember);
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
        }
        return { continue: true };
    }
}
