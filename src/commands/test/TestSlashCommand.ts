import { createCommand, slashBuilder } from '../../core/decorators/command.decorator';
import SlashCommand from '../../core/structures/SlashCommand';
import { type CommandInteraction } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: ['test'],
    aliases: ['test'],
})
@slashBuilder(
    (input) =>
        input
            .addUserOption((options) =>
                options.setRequired(true).setName('test').setDescription('testfaefaeffeaf a erffa'),
            )
            .setName('test')
            .setDescription(' fdkaekjfjk aejnmfnajmjanfwjnwfe.')
            .addIntegerOption((options) =>
                options.setName('test').setDescription('test.').setRequired(true),
            ) as SlashCommandBuilder, // TODO fix this type
)
export default class TestSlashCommand extends SlashCommand {
    public async execute(interaction: CommandInteraction): Promise<void> {
        return interaction.reply('test');
    }
}
