import { CommandInteraction, Message } from 'discord.js';
import { PathLike, readdirSync } from 'fs-extra';
import similarly from 'string-similarity';

import Client from '../core/Client';
import { ChannelCommand } from '../structures/ChannelCommand';
import { SlashCommand } from '../structures/SlashCommand';
import { BaseCommand, CommandTypes } from '../structures/BaseCommand';
import CommandHandler from './Handler';

// TODO: Maybe extend by Set than Map?
class CommandManager extends Map<string, ChannelCommand | SlashCommand> {
    private handler: CommandHandler;
    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     * @param { boolean } debug - If debug is true, will send more details in the console about importing commands.
     */
    public constructor(public client: Client) {
        super();

        this.handler = new CommandHandler(this.client);
    }

    /**
     * Get command by name.
     * @param { string } name - Command name.
     * @param { boolean } sloppy - True for return the first command that matches with the name (included aliases).
     * @returns { ICommand | null } command or null.
     */
    public get(name: string, sloppy?: boolean): ChannelCommand | SlashCommand | undefined {
        let command = super.get(name);

        if (sloppy && !command)
            command = super.get(similarly.findBestMatch(name, Array.from(this.keys())).bestMatch.target);

        if (!command) {
            this.forEach((cmd: BaseCommand) => {
                if (cmd.data.aliases?.includes(name) && !command) command = super.get(cmd.data.name);
            });
        }
        return command ?? undefined;
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
            if (folders.length === 0) throw new Error(`Not command folders was found in ${from}`);

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
                        /* 
                            ChannelCommand {
                                default: [BaseCommand],
                                type: CommandTypes
                            };
                        */
                        default: { type: CommandTypes } & (new (client: Client) => ChannelCommand | SlashCommand);
                    } = await import(`${from}/${folderName}/${cmdFileName}`).catch((error: Error) => {
                        error.stack = `Failed to import the command: ${cmdFileName}.\n` + error.stack;

                        this.client.logger.error(error, 'CommandManager');
                    });

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

                    /* 
                        Slash commands is added with the key '/' like ["/slashCommandName", [SlashCommand]] 
                        Some commands are declared like slash and channel command with the same name.
                    */
                    this.set(
                        Command.default.type === 'SLASH_COMMAND' ? `/${command.data.name}` : command.data.name,
                        command,
                    );

                    // Debug
                    this.client.logger.debug(
                        `${Command.default.type === 'CHANNEL_COMMAND' ? 'Command' : 'Slash command'} ${
                            command.data.name
                        } was imported.`,
                        'CommandManager',
                    );
                }
                this.client.logger.info(`${this.size} commands imported.`, 'CommandManager');
            }
        } catch (error) {
            this.client.logger.error(error as Error, 'CommandManager');
        }
    }

    /**
     * Handle channel and interaction commands.
     * @param { (Message | CommandInteraction) } context - Message or CommandInteraction.
     * @param { string } prefix - The prefix what was used with the command.
     */
    public async handle(context: Message | CommandInteraction, prefix: string): Promise<void> {
        try {
            // To search a slash command, we need to add the prefix '/' (like: /{slashCommandName})
            const command = this.get(
                context instanceof CommandInteraction
                    ? `/${context.commandName}`
                    : context.content.slice(prefix?.length).split(' ')[0],
                false,
            ) as BaseCommand;

            // First validation is only for channel commands.
            if ((context instanceof Message && !context.content.startsWith(prefix)) || !command) return;
            //if (!command.checkPermissions(context)) return;

            if (!command.execute)
                return this.client.logger.error(
                    new Error(`Command ${command.data.name} don't have a execute function. (${command.data.path})`),
                    'CommandManager',
                );

            this.handler.run(command, context, prefix);
        } catch (error) {
            context.reply({ content: 'An error has ocurred. Try again later.', attemptReply: true });

            this.client.logger.error(error as Error, 'CommandManager');
        }
    }
}
export default CommandManager;
