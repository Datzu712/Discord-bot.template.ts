/* eslint-disable @typescript-eslint/no-explicit-any */

import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandTypes } from '../../structures/BaseCommand';
import BaseSlashCommand from '../../structures/BaseSlashCommand';

export default function slashBuilder(builder: SlashCommandBuilder): any {
    return function decorate<T extends BaseSlashCommand>(target: new (...args: unknown[]) => T): void {

        if((target as unknown as { type: CommandTypes }).type === 'TEXT_COMMAND')
            throw new Error('@slashBuilder can only be used on a SlashCommand instance.');

        target.prototype.builder = builder;

        return;
    };
}