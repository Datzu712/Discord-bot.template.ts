import Category, { ICategory } from '../structures/BaseCategory';
import similarly from 'string-similarity';
import { PathLike, readdirSync } from 'fs-extra';
import Client from '../core/Client';

const unknownCategory = new Category({
    name: ['Unknown', '404'],
    description: 'This category is for commands that do not fit into any other category.',
    hidden: true
});

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
    public get(nameCategory: string, sloppy?: boolean): ICategory | null {
        if(!nameCategory)
            return null;

        if(sloppy === true && !this.has(nameCategory)) {
            nameCategory = similarly.findBestMatch(nameCategory, Array.from(this.keys())).bestMatch.target;
        }
        return super.get(nameCategory ?? null);
    }

    /**
     * Import categories from a directory.
     * @param { PathLike } from - Path of categories folder.
     */
    public async importCategories(from: PathLike): Promise<void> {
        try {
            /*
                Categories filenames
                ['dev.ts', 'fun.ts', 'moderation.ts', 'music.ts', 'utility.ts', ...];
            */
            const files = readdirSync(from);
            if(files.length === 0)
                return Promise.reject(new Error(`No categories was found in ${from}`));


            for(const fileName of files) {
                // Categories Classes are like: { default: [Category] }
                const categoryContents: { 
                    default: Category;
                } = await import(`${from}/${fileName}`).catch((error) => this.client.logger.error(
                    new Error(`Failed to import category ${fileName}` + error)
                ));

                if(!categoryContents?.default)
                    continue;

                const category = categoryContents.default;

                this.set(category.name[0], category);
                if(this.debug)
                    this.client.logger.debug(`Category ${category.name[0]} imported.`, 'CategoryManager');
            }

            // Then of import categories, search if one of they have subcategories
            for(const [name, category] of this) {
                if(!category.subcategory || category.subcategory instanceof Category)
                    continue;

                let subcategory = this.get(category.subcategory as string);
                if(!subcategory) {
                    this.client.logger.warn(`Could not find subcategory ${category.subcategory} of ${name}, I defined it with 'unknownCategory'`, 'CategoryManager');
                    subcategory = unknownCategory;
                }

                category.subcategory = subcategory;
                if(this.debug)
                    this.client.logger.debug(`Subcategory ${subcategory.name[0]} of ${name} imported.`, 'CategoryManager');

            }

            this.client.logger.log(`${files.length} categories imported.`, 'CategoryManager');
            return Promise.resolve();

        } catch (error) {
            return Promise.reject(error);
        }
    }

    /**
     * Sync commands with categories.
     */
    public syncCommands(): void {
        if(this.client.commands.size === 0)
            throw new Error('Commands are not imported yet.');

        for(const [name, command] of this.client.commands) {

            if(command.data.category instanceof Category) {
                this.client.logger.warn(`Command ${name} already has category.`, 'CategoryManager');
                continue;
            }
            const category = this.get(command.data.category as string);
            if(!category) {
                this.client.logger.warn(`Could not find the category ${command.data.category} of ${name}`, 'CategoryManager');
                continue;
            }

            command.data.category = category;
            category.commands.set(name, command);
            if(this.debug)
                this.client.logger.debug(`Command ${name} added to category ${category.name[0]}`, 'CategoryManager');
        }
    }
}

export default CategoryManager;