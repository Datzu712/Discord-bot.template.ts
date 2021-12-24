import createCommand from '../../util/decorators/createCommand';
import slashBuilder from '../../util/decorators/slashBuilder';
import { SlashCommandBuilder } from '@discordjs/builders';
import { SlashCommand } from '../../structures/SlashCommand';
import { CommandInteraction } from 'discord.js';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
@slashBuilder(new SlashCommandBuilder().addBooleanOption((options) => options.setName('ast')) as SlashCommandBuilder)
export default class testCommand extends SlashCommand {
    public async execute(interaction: CommandInteraction): Promise<void> {
        return interaction.reply('test');
    }
}
