import sourcebin from 'sourcebin';

import * as config from '../config/config';
import Client from '../structures/Client';

export default class Util {
    constructor(public client: Client) {}

    /**
     * Replace words same as environment variables.
     * @param { string } str - The string to be replaced.
     * @returns { string } The replaced string.
     */
    public replaceBannedWords(str: string): string {
        for (const key in config) {
            const element = config[key as keyof typeof config] as string;
            str.replaceAll(element, '*'.repeat(element.length));
        }
        return str;
    }

    /**
     * Create a sourcebin link.
     * @param { string } code - The code to be posted.
     * @returns { string } The sourcebin link.
     */
    public async sourcebin(
        code: string,
        { name, description }: { name: string; description: string },
    ): Promise<string | undefined> {
        const bin = await sourcebin.create(
            [
                {
                    content: this.replaceBannedWords(code),
                    language: 'ts',
                },
            ],
            {
                title: name,
                description: description,
            },
        );
        return bin.url;
    }
}
