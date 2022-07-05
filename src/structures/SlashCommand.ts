import type { CommandInteraction } from 'discord.js';
import type { SlashCommandBuilder } from '@discordjs/builders';

import { BaseCommand, type commandOptions } from './BaseCommand';
import type Client from './Client';

export default abstract class SlashCommand extends BaseCommand {
    public slashBuilder!: SlashCommandBuilder;

    constructor(client: Client, metadata: commandOptions) {
        super(client, metadata);
    }
    abstract execute(interaction: CommandInteraction): unknown;
}
