import createEvent from '../utils/decorators/createEvent';
import { BaseEvent } from '../structures/BaseEvent';

@createEvent({ name: 'ready', target: 'client' })
export default class Ready extends BaseEvent {
    public async execute(): Promise<void> {
        this.client.user?.setPresence({
            activities: [
                {
                    name: `with ${this.client.users.cache.size} users`,
                    type: 'STREAMING',
                    url: 'https://www.twitch.tv/smithhdplay',
                },
            ],
            status: 'online',
        });

        this.logger.info(`Connected to {c:blue}${this.client.user?.tag}{c:reset}!`);
    }
}
