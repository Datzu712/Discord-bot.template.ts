import type Client from './Client';
import { existsSync, readdirSync, lstatSync } from 'fs';
import { resolve } from 'path';
import { type Logger } from './Logger';

export default class BaseManager {
    #logger: Logger;

    constructor(public client: Client) {
        this.#logger = client.logger.createContextLogger('BaseManager');
    }

    public async importAllFilesFromPath<T extends object>(
        dir: string,
        ignoreErrors?: boolean,
    ): Promise<{ path: string; content: T }[]> {
        const subPaths = readdirSync(dir);
        // Element may be a folder or a file
        const files: { content: T; path: string }[] = [];
        for (const element of subPaths) {
            // Path of the file or directory
            const path = resolve(dir, element);
            // Check if the element is an valid file or a directory
            if (!existsSync(path)) {
                ignoreErrors
                    ? this.#logger.error(`${path} does not exist`)
                    : Promise.reject(new Error(`${path} does not exist`));
                continue;
            }
            const isDirectory = lstatSync(path).isDirectory();

            // If it's a directory, import all files from it using this function (recursively). Otherwise, push the file into the array
            if (isDirectory) {
                files.push(...(await this.importAllFilesFromPath<T>(path)));
            } else {
                const content = await import(path).catch((error: Error) => {
                    ignoreErrors ? this.#logger.error(error) : Promise.reject(error);
                });
                files.push({ content: content?.default ? content?.default : content, path });
            }
        }
        return files;
    }
}
