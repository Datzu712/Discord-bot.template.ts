/* eslint-disable @typescript-eslint/indent */

import { SlashCommandBuilder, SlashCommandSubcommandGroupBuilder } from '@discordjs/builders';
import { CommandTypes } from '../../structures/BaseCommand';

export function addSubcommandGroup(
    input:
        | SlashCommandSubcommandGroupBuilder
        | ((subcommandGroup: SlashCommandSubcommandGroupBuilder) => SlashCommandSubcommandGroupBuilder),
) {
    return function decorate<T extends new (...args: unknown[]) => object>(
        constructor: T & { builder: SlashCommandBuilder },
    ) {
        if (!constructor.prototype.builder) {
            constructor.prototype.builder = new SlashCommandBuilder();
            constructor.builder.addSubcommandGroup(input);
        }
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export default function slashBuilder(builder: SlashCommandBuilder) {
    return function decorate<T extends { type: CommandTypes } & (new (...args: any[]) => object)>(constructor: T) {
        if (constructor.type === 'CHANNEL_COMMAND')
            throw new Error('@slashBuilder can only be used on a SlashCommand instance.');

        return class extends constructor {
            builder = builder;
        };
    };
}
