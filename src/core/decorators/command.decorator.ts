import { SlashCommandBuilder } from '@discordjs/builders';

import type Client from '../structures/Client';
import type { commandOptions, BaseCommand } from '../structures/BaseCommand';
import type SlashCommand from '../structures/SlashCommand';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function createCommand(data: MakeOptional<commandOptions, 'aliases' | 'cooldown' | 'path'>): any {
    data.aliases = data.aliases || [];
    data.cooldown = data.cooldown || null;
    if (!data.usage.length) {
        throw new Error("Command usage should't be empty");
    }
    /**
     * See [Proxy](https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Proxy)
     *
     * Poor explication:
     * @param { Function } commandClass - BaseCommand constructor class. BaseCommand (client, data)
     * @returns { Function } Function - New constructor without second param. BaseCommand (client)
     */
    return function decorator<Command extends BaseCommand>(
        commandClass: new (client: Client, data: commandOptions) => Command,
    ): new (client: Client) => Command {
        return new Proxy<typeof commandClass>(commandClass, {
            construct: (ctx, [client]): Command => new ctx(client, data as commandOptions),
        }) as new (client: Client) => Command;
    };
}

export function slashBuilder(input: (arg: SlashCommandBuilder) => SlashCommandBuilder) {
    return function decorate<SlashCmd extends SlashCommand>(
        constructor: (new (client: Client, data: commandOptions) => SlashCmd) & { builder?: SlashCommandBuilder },
    ) {
        if (!constructor.builder) {
            constructor.prototype.builder = new SlashCommandBuilder();
        }
        constructor.builder = input(constructor.prototype.builder);

        return constructor;
    };
}
