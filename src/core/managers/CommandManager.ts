import Client from '../structures/Client';
import BaseManager from './BaseManager';
import { BaseCommand } from '../structures/BaseCommand';
import SlashCommand from '../structures/SlashCommand';

export default class CommandManager extends BaseManager<string, BaseCommand | SlashCommand> {
    constructor(private client: Client) {
        super();

        this.setLogger(client.logger.createContextLogger('CommandManager'));
    }

    /**
     * Get command by name.
     * @param { string } name - Command name.
     * @param { boolean } sloppy - True for return the first command that matches with the name (included aliases).
     * @returns { ICommand | null } command or null.
     */
    public get(name: string, sloppy?: boolean): BaseCommand | SlashCommand | undefined {
        let command = super.get(name);

        if (!command) {
            for (const [key, value] of this) {
                if (key === name || (sloppy && key.includes(name))) {
                    command = value;
                    break;
                }
            }
        }
        return command;
    }

    /**
     * Import all commands from the given path and setup it in the manager.
     * @param { string } path - Path to the directory to import all commands.
     * @returns { Promise<void> }
     */
    public async importCommands(path: string): Promise<void> {
        const files = await this.importAllFilesFromPath<new (client: Client) => BaseCommand | SlashCommand>(path, true);
        this.logger.info(`Importing commands from ${path} (Detected ${files.length} commands).`);

        for (const file of files) {
            if (!file.content?.constructor || !(file.content.prototype instanceof BaseCommand)) {
                throw new Error(
                    `An invalid command constructor was provided in ${file.path}. Check the file's content if it is exporting a class extended to BaseCommand or SlashCommand.`,
                );
            }
            const commandClass = file.content;
            const command = new commandClass(this.client);

            command.setLogger(this.client.logger.createContextLogger(commandClass.constructor.name));
            command.metadata.path = file.path;
            /*
                We register slash commands with the key "/" in the start of the string like: '/slashCommandName' 
                Other example about should be saved in this class is:
                Map(4) {
                    '/ban': [SlashCommand],
                    '/kick': [SlashCommand],
                    'ban': [BaseCommand],
                    'kick': [BaseCommand],
                }
            */
            this.set(
                commandClass.prototype instanceof SlashCommand ? `/${commandClass.name}` : commandClass.name,
                command,
            );

            this.logger.debug(
                `${
                    commandClass.prototype instanceof SlashCommand ? 'Slash Command' : 'Command'
                } ${`{c:yellow}${command.metadata.name}{c:reset}`} was imported from {c:blue}${file.path}{c:reset}.`,
            );
        }

        const totalSlashCommands = Array.from(this.keys()).filter((commandName) => commandName.startsWith('/')).length;
        this.logger.info(
            `{c:green}Successfully imported ${files.length} commands (Slash: ${totalSlashCommands} | Command: ${
                this.size - totalSlashCommands
            }).{c:reset}`,
        );
    }
}
