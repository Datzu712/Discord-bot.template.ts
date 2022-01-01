/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseCommand, CommandTypes, IBaseCommand } from '../../structures/BaseCommand';
import Client from '../../core/Client';
import Category from '../../structures/BaseCategory';

/** Create a new command. */
export default function createCommand(data: DeepPartial<IBaseCommand['data']>): any {
    if (data.category instanceof Category)
        throw new Error(`Don't assign categories manually, only put the name of category.`);

    if (!data.name || !data.category)
        throw new Error(
            `Command ${!data.name ? 'name' : 'category'} is required. (data.${!data.name ? 'name' : 'category'})`,
        );

    data.permissions = {
        member: data?.permissions?.member ?? [],
        me: data?.permissions?.me ?? [],
        requireMemberVoiceConnection: data?.permissions?.requireMemberVoiceConnection ?? false,
        experimentalCustomPermissions: data?.permissions?.experimentalCustomPermissions ?? false,
    };

    if (!data.aliases) data.aliases = [];

    if (!data.cooldown) data.cooldown = null;
    /**
     * Decorator.
     * @param { Function } commandClass - Constructor class. BaseCommand (client, data)
     * @returns { Function } Function - New class without second param. BaseCommand (client)
     */
    return function decorator<K extends typeof BaseCommand>(
        constructor: { type: CommandTypes } & (new (client: Client, data: IBaseCommand['data']) => K),
    ): new (client: Client) => K {
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        return new Proxy<typeof constructor>(constructor, {
            construct: (ctx, [client]): K => new ctx(client, data as IBaseCommand['data']),
        }) as (new (client: Client) => K) & { type: CommandTypes };
    };
    // TODO: fix this types...
}
