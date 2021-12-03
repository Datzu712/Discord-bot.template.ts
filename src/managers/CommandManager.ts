import Client from '../core/Client';
import { BaseCommand } from '../structures/BaseCommand';
import similarly from 'string-similarity';
import { PathLike, readdirSync } from 'fs-extra';
import SlashCommand from '../structures/BaseSlashCommand';

class CommandManager extends Map<string, BaseCommand | SlashCommand> {

    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     * @param { boolean } debug - If debug is true, will send more details in the console about importing commands.
     */
    constructor(public client: Client, private debug?: boolean) {
        super();
    }

    /**
     * Get command by name.
     * @param { string } commandName - Command name.
     * @param { boolean } sloppy - If true, will return the first category that matches the name.
     * @returns { ICommand | null } command - Command or null.
     */
    public get(commandName: string, sloppy?: boolean): BaseCommand | null {
        if(!commandName)
            return null;

        if(sloppy === true && !this.has(commandName)) {
            commandName = similarly.findBestMatch(commandName, Array.from(this.keys())).bestMatch.target;
        }
        return super.get(commandName ?? null);
    }

    /**
     * Import commands (without category)and setup it in this manager.
     * @param { PathLike } from - Path of commands folders.
     * @returns { Promise<void> } Promise - void.
     */
    public async importCommands(from: PathLike): Promise<void>  {
        try {
            /*
                Command folder names
                ['dev', 'general', 'fun', 'music'];
            */
            const folders = readdirSync(from);
            if(folders.length === 0)
                return Promise.reject(new Error(`No command folders was found in ${from}`));

            this.client.logger.log(`Importing commands from folders ${folders.join(', ')}...`);

            for(const folderName of folders) {
                const cmdFilesName = readdirSync(`${from}/${folderName}`);
                if(cmdFilesName.length === 0) {
                    this.client.logger.warn(`No commands was found in ${from}/${folderName}`, 'CommandManager');
                    continue;
                }
                
                for(const cmdFileName of cmdFilesName) {
                    const CommandClass: { 
                        default: typeof BaseCommand 
                    } = await import(`${from}/${folderName}/${cmdFileName}`)
                        .catch((error) => this.client.logger.error(new Error(`Failed to import command ${cmdFileName}.` + error), 'CommandManager'));

                    if(!CommandClass?.default) {
                        if(this.debug)
                            this.client.logger.warn(`Command ${cmdFileName} is invalid.`, 'CommandManager');
                        continue;
                    }
                        
                    
                    const command = new CommandClass.default(this.client);
                    if(CommandClass.default.type === 'TEXT_COMMAND') {
                        this.set(command.data.name, command);
                    } else {
                        // Slash commands is added with the key '/' like ["/slashCommandName", [SlashCommand]]
                        this.set(`/${command.data.name}`, command);
                    }

                    if(this.debug)
                        this.client.logger.debug(`Command ${command.data.name} was imported.`, 'CommandManager');

                }
                this.client.logger.info(`Command ${this.size} imported.`, 'CommandManager');
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}

export default CommandManager;