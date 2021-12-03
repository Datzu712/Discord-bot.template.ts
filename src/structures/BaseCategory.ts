import BaseSlashCommand from "./BaseSlashCommand";
import { BaseCommand } from "./BaseCommand";

// TODO adjust Sub categories 
export interface ICategory {
    /** Category name. [name, emoji (For help commands xd)] */
    name: [string, string];

    /** Category Commands. */
    commands?: Map<string, BaseCommand | BaseSlashCommand>;

    /** Category description. */
    description: string;

    /** Category aliases. */
    aliases?: string[];

    subcategory?: ICategory | string;

    hidden?: boolean
}

export default class Category implements ICategory {
    /** Category name. [name, emoji (For help commands xd)] */
    public name: [string, string];

    /** Category Commands. */
    public commands?: Map<string, BaseCommand | BaseSlashCommand>;

    /** Category description. */
    public description: string;

    /** Category aliases. */
    public aliases?: string[];

    /** Sub category. */
    public subcategory?: ICategory | string;

    public hidden?: boolean;
    
    /**
     * Create category.
     * @param { ICategory } data - Category data.
     */
    constructor(data?: ICategory) {
        this.name = data.name;
        this.description = data.description;

        this.subcategory = data.subcategory ?? null;
        this.hidden = data.hidden ?? false;

        this.commands = new Map();
        this.aliases = data.aliases ?? [];
    }

}