import type { Message } from 'discord.js';

import Base from './Base';
import type Client from './Client';

export interface commandExecutionContext {
    args: string[];
    msg: Message;
    usedPrefix: string;
}
/**
 * Command metadata.
 * PD: To set the permissions of the command you should use the decorators. See [Decorators for permissions](https://github.com/Datzu712/Discord_bot-TS) for more information.
 */
export interface commandOptions {
    /**
     * Command name
     * @example 'eval'
     */
    name: string;
    /**
     * Command description
     * @example 'Evaluates code'
     */
    description: string;
    /**
     * Usage of the command
     * @example ['eval <code>', 'eval this]
     */
    usage: string[];
    /**
     * Path of the command
     * @example 'src/commands/dev/EvalCommand.ts'
     */
    path: string;
    /**
     * Cooldown of the command
     * @example 5
     */
    cooldown: number | null;
    /**
     * Category of the command.
     * It may be a string (referencing a category in specific) or an Category instance.
     * @example 'dev'
     * @example [DeveloperCategory]
     */
    category: string /*| Category*/;
    /**
     * Aliases of the command
     * @example ['e', 'eval']
     */
    aliases: string[];
}

export abstract class BaseCommand extends Base {
    constructor(public client: Client, public metadata: commandOptions) {
        super();
    }
    abstract execute(...args: unknown[]): unknown;
}
