import { CommandInteraction, Message } from 'discord.js';
// import { SlashCommand } from '../structures/SlashCommand';
import Client from '../core/Client';
import { BaseCommand } from '../structures/BaseCommand';

export default class CommandHandler {
    constructor(public readonly client: Client) {}

    /**
     * @param command
     * @todo
     */
    private createChart(command: BaseCommand) {
        // Create MongoDB charts for commands (:
        command;
    }

    public async run(command: BaseCommand, context: Message | CommandInteraction, prefix: string) {
        const startTime = Date.now();
        try {
            await command.execute(
                context instanceof Message
                    ? { prefix, msg: context, args: context.content.slice(prefix.length).split(' ').slice(1) }
                    : context,
            );
            this.client.logger.debug(
                `Command ${command.data.name} was executed in ${Date.now() - startTime}ms by ${
                    (context as CommandInteraction).user?.tag ?? (context as Message).author.tag
                }. `,
                'CommandManager',
            );
        } catch (error) {
            // Try to notify the user if the command failed.
            context
                .reply({ content: 'An error has ocurred. Try again later.', attemptReply: true })
                .catch(() => undefined);

            this.client.logger.error(error as Error, 'CommandManager');
        }
    }
}
