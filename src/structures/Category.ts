import BaseSlashCommand from "./BaseSlashCommand";
import { BaseCommand } from "./BaseCommand";

// TODO adjust Sub categories 
export interface ICategory {
    /** Category name. [name, emoji (For help commands xd)] */
    name: [string, string];

    /** Category Commands. */
    commands: Map<string, BaseCommand | BaseSlashCommand>;

    /** Category description. */
    description: string;

    /** Category aliases. */
    aliases: string[];

    subcategory?: ICategory;
}

export default class Category implements ICategory {
    /** Category name. [name, emoji (For help commands xd)] */
    public name: [string, string];

    /** Category Commands. */
    public commands: Map<string, BaseCommand | BaseSlashCommand>;

    /** Category description. */
    public description: string;

    /** Category aliases. */
    public aliases: string[];

    /** Sub category. */
    public subcategory?: ICategory;
    
    /**
     * Create category.
     * @param { ICategory } data - Category data.
     */
    constructor(data?: ICategory) {
        this.name = data.name;
        this.commands = data.commands;
        this.description = data.description;
        this.aliases = data.aliases;

        this.subcategory = data.subcategory ?? null;
    }

}