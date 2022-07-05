import { existsSync, readdirSync, lstatSync } from 'fs';
import { resolve } from 'path';

import { type basicLogger } from '../structures/Logger';

export default class BaseManager<K, V> extends Map<K, V> {
    protected logger: basicLogger = console;
    constructor() {
        super();
    }

    /**
     * Import all files (deep import) from a given path.
     * @param { string } dir - Path to the directory to import all files.
     * @param { boolean } ignoreErrors - If true, will ignore errors and continue importing files.
     * @returns { Promise<{ path: string; content: object }[]> }
     */
    protected async importAllFilesFromPath<T extends object>(
        dir: string,
        ignoreErrors?: boolean,
    ): Promise<{ path: string; content: T }[]> {
        const subPaths = readdirSync(dir);
        const files: { content: T; path: string }[] = [];
        // Element may be a folder or a file
        for (const element of subPaths) {
            // Path of the file or directory
            const path = resolve(dir, element);
            // Check if the element is an valid file or a directory
            if (!existsSync(path)) {
                ignoreErrors
                    ? this.logger.error(`${path} does not exist`)
                    : Promise.reject(new Error(`${path} does not exist`));
                continue;
            }
            const isDirectory = lstatSync(path).isDirectory();

            // If it's a directory, import all files from it using this function (recursively). Otherwise, push the file content into the array
            if (isDirectory) {
                files.push(...(await this.importAllFilesFromPath<T>(path)));
            } else {
                const content = await import(path).catch((error: Error) => {
                    ignoreErrors ? this.logger.error(error) : Promise.reject(error);
                });
                files.push({ content: content?.default ? content?.default : content, path });
            }
        }
        return files;
    }

    public setLogger(logger: basicLogger): void {
        this.logger = logger;
    }
}
