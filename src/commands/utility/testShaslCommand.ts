import { createCommand } from '../../util/decorators/createCommand';
import { test } from '../../util/decorators/slashBuilder';
import { SlashCommand } from '../../structures/SlashCommand';
import { CommandInteraction } from 'discord.js';
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
                options.setRequired(true).setName('usuario').setDescription('Mentioner a un usuario.'),
            )
            .setName('addcoins')
            .setDescription('Agrega SHD coins a un usuario.')
            .addIntegerOption((options) =>
                options.setName('coins').setDescription('El numero de SHD coins que va a agregar.').setRequired(true),
            ) as SlashCommandBuilder,
)
export default class testCommand extends SlashCommand {
    public async execute(interaction: CommandInteraction): Promise<void> {
        return interaction.reply('test');
    }
}
