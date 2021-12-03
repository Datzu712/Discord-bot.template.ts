import { ICommand } from '../../structures/BaseCommand'; 
import Client from '../../core/Client';
import Category from '../../structures/Category';

/** Create a new command command, use second param only for slash commands */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function createCommand(data: ICommand['data']): any {

    if(data.category instanceof Category) 
        throw new Error(`Don't assign categories manually, only put the name of category.`);
    

    if(!data.permissions)
        data.permissions = {
            member: [],
            me: [],
            requireVoiceConnection: false,
            experimentalCustomPermissions: false
        };

    if(!data.aliases)
        data.aliases = [];

    if(!data.cooldown)
        data.cooldown = null;
    

    /**
     * Decorator.
     * @param { Function } Function - Constructor class. BaseCommand (client, data) {}
     * @returns { Function } Function - New class without second param. BaseCommand (client) {}
     */
    return function decorator<K extends ICommand['data']>(commandClass: new (...args: unknown[]) => K): new (client: Client) => K {
        // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        return new Proxy(commandClass, {
            construct: (ctx, [client]): K => new ctx(client, data)
        });
    };
}