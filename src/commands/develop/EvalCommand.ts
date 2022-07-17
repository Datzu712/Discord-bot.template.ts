import util from 'util';
import beautify from 'js-beautify';
import { Message, MessageEmbed } from 'discord.js';

import { createCommand } from '../../core/decorators/command.decorator';
import type { Command } from '../../core/interfaces/command.interface';
import { Msg, Args } from '../../core/decorators';
import Client from '../../core/structures/Client';

@createCommand({
    name: 'eval',
    description: 'Evaluates code',
    usage: ['eval <code>', 'eval this'],
    aliases: ['e'],
    category: 'dev',
})
export default class EvalCommand implements Command {
    constructor(private client: Client) {}

    async execute(@Msg msg: Message, @Args args: string[]) {
        const startTime = Date.now();

        if (!args[0]) return msg.channel.send('Please provide some code to evaluate.');
        const baseMessage = await msg.channel.send('Evaluating...');

        try {
            let input = '';
            args.forEach((arg) =>
                arg === '--async'
                    ? (input = `(async () => { ${args.slice(0).join(' ')} })();`)
                    : (input = args.slice(0).join(' ')),
            );

            input = input.replaceAll('--async', '');
            // this eval have the all context of the client, and it is safe if you trust in the developers what they are in the dev whitelist.
            // eslint-disable-next-line security/detect-eval-with-expression
            let output = await eval(input);
            if (typeof output !== 'string')
                output = util.inspect(output, { depth: 0, maxStringLength: 4000, maxArrayLength: 3000 });

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
                });
            } else if (output.length <= 4000) {
                return msg.channel.send({
                    embeds: [
                        new MessageEmbed().setColor('BLUE').setDescription(
                            `${
                                input.length <= 500
                                    ? `📥 Input ${`\`\`\`js\n${beautify(input, {
                                          indent_size: 4,
                                          space_in_empty_paren: true,
                                          jslint_happy: true,
                                      })}\n\`\`\``}`
                                    : ''
                            }📤 **Output (${Date.now() - startTime}ms)**\n` +
                                `\`\`\`js\n${this.client.utils.replaceBannedWords(output)}\n\`\`\``,
                        ),
                    ],
                });
            } else {
                return msg.channel.send({
                    embeds: [
                        new MessageEmbed().setColor('BLUE').setDescription(
                            `Output too long. ${'`'}${await this.client.utils.sourcebin(output, {
                                name: 'Code Evaluation',
                                description: 'Output code',
                            })}${'`'}`,
                        ),
                    ],
                });
            }
        } catch (error) {
            return baseMessage.edit(
                `(${Date.now() - startTime}ms) Error: ` + `\`\`\`js\n${(error as Error).stack}\n\`\`\``,
            );
        }
    }
}
