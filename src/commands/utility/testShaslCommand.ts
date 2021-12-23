import createCommand from '../../util/decorators/createCommand';
import slashBuilder from '../../util/decorators/slashBuilder';
import { SlashCommandBuilder } from '@discordjs/builders';
import SlashCommand from '../../structures/SlashCommand';
import { CommandInteraction } from 'discord.js';

@slashBuilder(new SlashCommandBuilder().addBooleanOption((options) => options) as SlashCommandBuilder)
@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends SlashCommand {
    public async execute(interaction: CommandInteraction): Promise<void> {
        return interaction.reply('test');
    }
}
