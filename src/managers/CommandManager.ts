import Client from '../core/Client';
import { BaseChannelCommand } from '../structures/BaseChannelCommand';
import similarly from 'string-similarity';
import { PathLike, readdirSync } from 'fs-extra';
import SlashCommand from '../structures/BaseSlashCommand';
import { CommandInteraction, Message } from 'discord.js';
import { BaseCommand, CommandTypes } from '../structures/BaseCommand';

// TODO: Maybe extend by Set than Map?
class CommandManager extends Map<string, BaseChannelCommand | SlashCommand> {
    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     * @param { boolean } debug - If debug is true, will send more details in the console about importing commands.
     */
    public constructor(public client: Client, private debug?: boolean) {
        super();
    }

    /**
     * Get command by name.
     * @param { string } name - Command name.
     * @param { boolean } sloppy - If true, will return the first category that matches the name.
     * @returns { ICommand | null } command or null.
     */
    public get(name: string, sloppy?: boolean): BaseChannelCommand | SlashCommand | undefined {
        if (!name) return undefined;

        if (sloppy === true && !this.has(name))
            name = similarly.findBestMatch(name, Array.from(this.keys())).bestMatch.target;

        if (!name) {
            this.forEach((command: BaseCommand, key) => {
                if (command.data.aliases?.includes(name)) name = key;
            });
        }

        return super.get(name) ?? undefined;
    }
    /**
     * Import commands (without category)and setup it in this manager.
     * @param { PathLike } from - Path of commands folders.
     * @returns { Promise<void> } void.
     */
    public async importCommands(from: PathLike): Promise<void> {
        try {
            /**
             *  Command folder names like:
             *  ['dev', 'general', 'fun', 'music'];
             */
            const folders = readdirSync(from);
            if (folders.length === 0) return Promise.reject(new Error(`Not command folders was found in ${from}`));

            this.client.logger.log(`Importing commands from folders ${folders.join(', ')}...`, 'CommandManager');

            for (const folderName of folders) {
                /**
                 * Get commands files from folders like:
                 * ['ban.ts', 'kick.ts', 'clear.ts']
                 */
                const cmdFilesName = readdirSync(`${from}/${folderName}`);
                if (cmdFilesName.length === 0) {
                    this.client.logger.warn(`Not commands was found in ${from}/${folderName}`, 'CommandManager');
                    continue;
                }
                for (const cmdFileName of cmdFilesName) {
                    /*
                        Command: { default: [BaseCommand] };
                        When you create commands, you need to export it by default.
                        If some error occurs (.catch) CommandClass is converted in undefined and we handle the error and continue registering commands.
                    */
                    const Command: {
                        default: { type: CommandTypes } & (new (client: Client) => BaseChannelCommand);
                    } = await import(`${from}/${folderName}/${cmdFileName}`).catch((error) =>
                        this.client.logger.error(
                            new Error(`Failed to import command ${cmdFileName}. ` + error),
                            'CommandManager',
                        ),
                    );

                    if (!Command?.default) {
                        this.client.logger.warn(`Command ${cmdFileName} is invalid.`, 'CommandManager');
                        continue;
                    }
                    const command = new Command.default(this.client);
                    command.data.path = `${from}/${folderName}/${cmdFileName}`;
                    /*
                        Slash commands is registered with '/slashCommandName' like:
                        Map(4) {
                            '/ban': [SlashCommand],
                            '/kick': [SlashCommand],
                            'ban': [BaseCommand],
                            'kick': [BaseCommand],
                        }
                    */
                    if (Command.default.type === 'CHANNEL_COMMAND') {
                        this.set(command.data.name, command);
                    } else {
                        // Slash commands is added with the key '/' like ["/slashCommandName", [SlashCommand]]
                        this.set(`/${command.data.name}`, command);
                    }
                    if (this.debug)
                        this.client.logger.debug(
                            `${Command.default.type === 'CHANNEL_COMMAND' ? 'Command' : 'Slash command'} ${
                                command.data.name
                            } was imported.`,
                            'CommandManager',
                        );
                }
                this.client.logger.info(`Command ${this.size} imported.`, 'CommandManager');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Handle channel and interaction commands.
     * @param { object } context - Message or CommandInteraction.
     * @param { string } prefix - The prefix what was used with the command.
     * @returns { Promise<void> } Command execution...
     */
    public async handle(context: Message | CommandInteraction, prefix: string): Promise<void> {
        const startTime = Date.now();
        try {
            // To search slash commands, we need to add the prefix '/'. (Result: /{slashCommandName})
            const command = this.get(
                context instanceof CommandInteraction
                    ? `/${context.commandName}`
                    : context.content.slice(prefix?.length).split(' ')[0],
                false,
            ) as BaseCommand;
            if (!command) return;

            if (context instanceof Message && !context.content.startsWith(prefix)) return;
            if (!command.checkPermissions(context)) return;

            if (!command.execute)
                return this.client.logger.warn(
                    `Command ${command.data.name} has not execute function.`,
                    'CommandManager',
                );

            // Channel commands need arguments in the second parameter...
            await command
                .execute(
                    context,
                    context instanceof Message ? context.content.slice(prefix.length).split(' ').slice(1) : undefined,
                )
                .catch((error: Error) => {
                    this.client.logger.error(error, 'CommandManager');
                });

            const endTime = Date.now();
            this.client.logger.log(
                `Command ${command.data.name} was executed in ${endTime - startTime}ms by ${
                    (context as CommandInteraction).user?.tag ?? (context as Message).author.tag
                }. `,
                'CommandManager',
            );
        } catch (error) {
            this.client.logger.error(error instanceof Error ? error : new Error(error as string), 'CommandManager');
        }
    }
}
export default CommandManager;
