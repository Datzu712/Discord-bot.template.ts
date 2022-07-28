import { createCommand } from '../../utils/decorators/createCommand';
import { test } from '../../utils/decorators/slashBuilder';
import { SlashCommand } from '../../structures/SlashCommand';
import { CommandInteraction, GuildMember } from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
@test(
    (input) =>
        input
            .addUserOption((options) =>
                options.setRequired(true).setName('test').setDescription('testfaefaeffeaf a erffa'),
            )
            .setName('test')
            .setDescription(' fdkaekjfjk aejnmfnajmjanfwjnwfe.')
            .addIntegerOption((options) =>
                options.setName('test').setDescription('test.').setRequired(true),
            ) as SlashCommandBuilder,
)
export default class testCommand extends SlashCommand {
    public async execute(interaction: CommandInteraction): Promise<void> {
        (interaction.member as GuildMember).voice.channel;
        return interaction.reply('test');
    }
}
