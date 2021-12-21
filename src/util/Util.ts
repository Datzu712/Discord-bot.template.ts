import Client from '../core/Client';
import sourcebin from 'sourcebin';

export default class Util {
    public constructor(public client: Client) {}

    /**
     * Create a sourcebin link.
     * @param { string } code - The code to be posted.
     * @returns { string } The sourcebin link.
     */
    public async sourcebin(code: string): Promise<string | undefined> {
        const bin = await sourcebin
            .create(
                [
                    {
                        content: this.replaceBannedWords(code),
                        language: 'ts',
                    },
                ],
                {
                    title: 'bin name',
                    description: 'test bin',
                },
            )
            .catch((e) => this.client.logger.error(e));

        return bin?.url ?? undefined;
    }

    public replaceBannedWords(text: string): string {
        const bannedWords = [
            process.env.BOT_TOKEN,
            process.env.DISCORD_WEBHOOK_URL,
            process.env.MONGODB_URL,
            process.env.SENTRY_DSN,
        ];
        for (const word of bannedWords) {
            console.log(text);
            text = text.replaceAll(word, 'PRIVATE');
        }
        return text;
    }
}
