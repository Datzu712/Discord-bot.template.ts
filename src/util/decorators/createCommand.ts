/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseCommand, CommandTypes, IBaseCommand, ExecuteCommandOptions } from '../../structures/BaseCommand';
import Client from '../../core/Client';
import Category from '../../structures/BaseCategory';
import { Mediator } from './Mediator';
import { CommandInteraction, GuildMember } from 'discord.js';

/** Create a new command decorator. */
export function createCommand(data: DeepPartial<IBaseCommand['data']>): any {
    if (data.category instanceof Category)
        throw new Error(`Don't assign categories manually, only put the name of category.`);

    if (!data.name || !data.category)
        throw new Error(
            `Command ${!data.name ? 'name' : 'category'} is required. (data.${!data.name ? 'name' : 'category'})`,
        );

    data.permissions = {
        member: data?.permissions?.member ?? [],
        me: data?.permissions?.me ?? [],
        //requireMemberVoiceConnection: data?.permissions?.requireMemberVoiceConnection ?? false,
        experimentalCustomPermissions: data?.permissions?.experimentalCustomPermissions ?? false,
    };

    if (!data.aliases) data.aliases = [];

    if (!data.cooldown) data.cooldown = null;
    /**
     * Decorator.
     * @param { Function } constructor - Constructor class. BaseCommand (client, data)
     * @returns { Function } Function - New constructor class without second param. BaseCommand (client)
     */
    return function decorator<K extends typeof BaseCommand>(
        constructor: { type: CommandTypes } & (new (client: Client, data: IBaseCommand['data']) => K),
    ): new (client: Client) => K {
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        return new Proxy<typeof constructor>(constructor, {
            construct: (ctx, [client]): K => new ctx(client, data as IBaseCommand['data']),
        }) as (new (client: Client) => K) & { type: CommandTypes };
    };
}

/**
 * Command execute decorator.
 * @description Before execute the command, this decorator will create another function that evaluates if the author of the message is a developer and then executes it if it is.
 */
export function OnlyForDevelopers() {
    return Mediator(async (context: ExecuteCommandOptions | CommandInteraction, next: LikeFunction<void>) => {
        if (
            (context as CommandInteraction).user.id === '444295883182309378' ||
            (context as ExecuteCommandOptions).msg.author.id === '444295883182309378'
        ) {
            next();
        }
    });
}

/**
 * Command execute decorator.
 * @description Before execute the command, this decorator will create another function that evaluates if the author of the message is in a voice channel.
 */
export function RequireMemberVoiceConnection() {
    return Mediator(async (context: ExecuteCommandOptions | CommandInteraction, next: LikeFunction<void>) => {
        const voiceChannel =
            ((context as CommandInteraction)?.member as GuildMember)?.voice.channel ||
            ((context as ExecuteCommandOptions).msg.member as GuildMember)?.voice.channel;

        if (!voiceChannel) {
            next;
        }
        /*
        
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

        */

        // return false;
    });
}
