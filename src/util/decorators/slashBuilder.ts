/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/indent */
import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandTypes } from '../../structures/BaseCommand';

export function test(input: (arg: SlashCommandBuilder) => SlashCommandBuilder) {
    return function decorate<T extends new (...args: any[]) => { builder?: SlashCommandBuilder }>(
        constructor: T & { builder?: SlashCommandBuilder },
    ) {
        if (!constructor.builder) {
            constructor.prototype.builder = new SlashCommandBuilder();
        }

        return class extends constructor {
            builder = input(constructor.prototype.builder);
        };
    };
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function slashBuilder(builder: SlashCommandBuilder) {
    return function decorate<T extends { type: CommandTypes } & (new (...args: any[]) => object)>(constructor: T) {
        if (constructor.type === 'CHANNEL_COMMAND')
            throw new Error('@slashBuilder can only be used on a SlashCommand instance.');

        return class extends constructor {
            builder = builder;
        };
    };
}
