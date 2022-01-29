import { CommandInteraction, Message } from 'discord.js';
import { SlashCommand } from 'src/structures/SlashCommand';
import Client from '../core/Client';
import { BaseCommand } from '../structures/BaseCommand';
import { KeywordManager } from './Keyword';

export default class CommandHandler {
    private keywords: KeywordManager;

    constructor(public readonly client: Client) {
        this.keywords = new KeywordManager(this.client);
    }

    // todo
    private createChart(command: BaseCommand) {
        // Create MongoDB charts for commands (:
        command;
    }

    public async run(command: BaseCommand, context: Message | CommandInteraction) {
        command;
        context;

        if (command.keywords.length > 0 || this.keywords.global.size > 0) {
            // a
        }
        /*await command
                .execute(
                    context instanceof Message
                        ? { prefix, msg: context, args: context.content.slice(prefix.length).split(' ').slice(1) }
                        : context,
                )
                .catch((error: Error) => {
                    this.client.logger.error(error, 'CommandManager');
                });
            this.client.logger.log(
                `Command ${command.data.name} was executed in ${Date.now() - startTime}ms by ${
                    (context as CommandInteraction).user?.tag ?? (context as Message).author.tag
                }. `,
                'CommandManager',
            );*/
    }
}
