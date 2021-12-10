import { Message, MessageEmbed } from 'discord.js';
import { BaseChannelCommand } from '../../structures/BaseChannelCommand';
import createCommand from '../../util/decorators/createCommand';
import util from 'util';
import beautify from 'js-beautify';

@createCommand({
    name: 'eval',
    description: 'Evaluates code.',
    category: 'dev',
    usage: 'eval [code]',
    guildOnly: true,
    aliases: ['e'],
    devOnly: true,
})
export default class testCommand extends BaseChannelCommand {
    public async execute(msg: Message, args: string[]): Promise<Message> {
        const startTime = Date.now();

        if (!args[0]) return msg.channel.send('Please provide some code to evaluate.');

        const baseMessage = await msg.channel.send('Evaluating...');

        try {
            let input = '';
            args.forEach((arg) =>
                arg === '--async'
                    ? (input = `(async () => { ${args.slice(0).join(' ')} })()`)
                    : (input = args.slice(0).join(' ')),
            );

            input = input.replaceAll('--async', '');
            const output = util.inspect(await eval(input), {
                depth: 0,
                maxStringLength: 2000,
            });
            const baseEmbed = new MessageEmbed()
                .setColor('BLUE')
                .addField(
                    '📥 Input',
                    `\`\`\`js\n${beautify(input, {
                        indent_size: 4,
                        space_in_empty_paren: true,
                        jslint_happy: true,
                    })}\n\`\`\``,
                )
                .setTimestamp()
                .addField('⏱️ Time', `\`\`\`fix\n${Date.now() - startTime}ms\n\`\`\``, true);

            if (input.length <= 1000 && output.length <= 1000) {
                return msg.channel.send({
                    embeds: [
                        baseEmbed.addField(
                            '📤 Output',
                            `\`\`\`js\n${this.client.utils.replaceBannedWords(output)}\n\`\`\``,
                        ),
                    ],
                    content: null,
                });
            } else if (output.length <= 4000) {
                return msg.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('BLUE')
                            .setDescription(
                                `📤 Output (${Date.now() - startTime}ms) \n` +
                                    `\`\`\`js\n${this.client.utils.replaceBannedWords(output)}\n\`\`\``,
                            ),
                    ],
                    content: null,
                });
            } else {
                return msg.channel.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('BLUE')
                            .setDescription(
                                `Output too long. ${'`'}${await this.client.utils.sourcebin(output)}${'`'}`,
                            ),
                    ],
                    content: null,
                });
            }
        } catch (error) {
            return baseMessage.edit(`(${Date.now() - startTime}ms) Error: ` + `\`\`\`js\n${error}\n\`\`\``);
        }
    }
}
