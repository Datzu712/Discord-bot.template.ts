import Category, { ICategory } from '../structures/BaseCategory';
import similarly from 'string-similarity';
import { PathLike, readdirSync } from 'fs-extra';
import Client from '../core/Client';

const unknownCategory = new Category({
    name: ['unknown', '📕'],
    description: 'Commands with unknown category.',
    hidden: true,
});

// TODO: Maybe extend by Set than Map?
class CategoryManager extends Map<string, ICategory> {
    /**
     * Constructor of the CategoryManager.
     * @param { Client } client - Client instance.
     * @param { boolean } debug - If debug is true, will send more details in the console about importing categories.
     */
    constructor(public client: Client, private debug?: boolean) {
        super();
    }

    /**
     * Get category by name.
     * @param { string } nameCategory - Category name.
     * @param { boolean } sloppy - If true, will return the first category that matches the name.
     * @returns { ICategory | undefined } Category.
     */
    public get(nameCategory: string, sloppy?: boolean): ICategory | undefined {
        if (!nameCategory) return undefined;

        if (sloppy === true && !this.has(nameCategory)) {
            nameCategory = similarly.findBestMatch(nameCategory, Array.from(this.keys())).bestMatch.target;
        }
        return super.get(nameCategory) ?? undefined;
    }

    /**
     * Import categories from a directory.
     * @param { PathLike } from - Path of categories folder.
     */
    public async importCategories(from: PathLike): Promise<void> {
        try {
            /*
                Categories file names like:
                ['dev.ts', 'fun.ts', 'moderation.ts', 'music.ts', 'utility.ts', ...];
            */
            const files = readdirSync(from);
            if (files.length === 0) throw new Error(`Not categories was found in ${from}`);

            for (const fileName of files) {
                /*
                    Category: { default: [Category] };
                    When you create categories, you need to export it by default and instanced (new Category...).
                    If some error occurs (.catch) CommandClass is converted in undefined and we handle the error and continue registering categories.
                */
                const Category: {
                    default: Category;
                } = await import(`${from}/${fileName}`).catch((error) =>
                    this.client.logger.error(new Error(`Failed to import category ${fileName}` + error)),
                );

                if (!Category?.default) continue;

                // Add category to this map.
                const category = Category.default;
                this.set(category.name[0], category);
                if (this.debug) this.client.logger.debug(`Category ${category.name[0]} imported.`, 'CategoryManager');
            }

            // Then of import categories, search if one of they have subcategories
            for (const [name, category] of this) {
                if (!category.subcategory || category.subcategory instanceof Category) continue;

                let subcategory = this.get(category.subcategory as string);
                if (!subcategory) {
                    this.client.logger.warn(
                        `Could not find subcategory ${category.subcategory} of ${name}, I defined it with 'unknownCategory'`,
                        'CategoryManager',
                    );
                    subcategory = unknownCategory;
                }
                category.subcategory = subcategory;
                if (this.debug)
                    this.client.logger.debug(
                        `Subcategory ${subcategory.name[0]} of ${name} imported.`,
                        'CategoryManager',
                    );
            }
            return this.client.logger.log(`${files.length} categories imported.`, 'CategoryManager');
        } catch (error) {
            return Promise.reject(error);
        }
    }
    /**
     * Sync commands with categories.
     */
    public syncCommands(): void {
        if (this.client.commands.size === 0) throw new Error('Commands are not imported yet.');

        for (const [name, command] of this.client.commands) {
            if (command.data.category instanceof Category) {
                this.client.logger.warn(`Command ${name} already has category.`, 'CategoryManager');
                continue;
            }
            const category = this.get(command.data.category as string);
            if (!category) {
                this.client.logger.warn(
                    `Could not find the category ${command.data.category} of command ${name}`,
                    'CategoryManager',
                );
                continue;
            }
            command.data.category = category;
            if (!category.commands) {
                category.commands = new Map();
                continue;
            }

            category.commands.set(name, command);
            if (this.debug)
                this.client.logger.debug(`Command ${name} added to category ${category.name[0]}`, 'CategoryManager');
        }
    }
}
export default CategoryManager;
