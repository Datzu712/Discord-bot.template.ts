import Client from '../core/Client';
import { Keyword } from '../structures/Keyword';
import { GuildMember, User, TextChannel } from 'discord.js';

export class KeywordManager {
    public global: Map<string, Keyword>;

    constructor(public client: Client) {
        this.global = new Map();
    }

    /**
     * Add a keyword to the global keyword list.
     * @param { Keyword } keyword - Keyword to add.
     */
    public add(keyword: Keyword): void {
        this.global.set(keyword.name, keyword);
    }

    public parse(input: string, customKeywords: Keyword[] | undefined = []) {
        const args = input.toLowerCase().split(' ');

        // Keywords detected with respective arguments (this is the return value)
        const parsed: Map<string, string[] | boolean | number | GuildMember | User | TextChannel> = new Map();

        // Global and local keywords together
        const keywords = [...Array.from(this.global.values()), ...customKeywords];
        console.log(keywords);
        // Name of all keywords to check if any match with the input arguments
        const keywordNames: string[] = [];

        // include all aliases of each keywords
        for (const keyword of keywords) {
            if (!(keyword instanceof Keyword)) {
                this.client.logger.error(new Error('An invalid keyword was provided.'));
            }
            // Keyword name
            keywordNames.push(`${keyword.prefix}${keyword.name}`);

            // Keyword aliases
            if (keyword.aliases) {
                for (const alias of keyword.aliases) {
                    keywordNames.push(`${keyword.prefix}${alias}`);
                }
            }
        }
        // Include all keyword names (with aliases) to this regex.
        const keywordRegex = new RegExp(keywordNames.join('|'));
        if (!keywordRegex.test(input)) return parsed;

        // Array
        let keywordTarget: string[] | undefined = undefined;

        // check all arguments
        for (const arg of args) {
            // If the arg is a keyword
            if (keywordRegex.test(arg)) {
                if (!parsed.has(arg)) {
                    parsed.set(arg, []);
                }
                keywordTarget = parsed.get(arg) as string[];
            }
            if (!keywordTarget) {
                continue;
            }
            keywordTarget.push(arg);
        }
        return parsed;
    }
}
