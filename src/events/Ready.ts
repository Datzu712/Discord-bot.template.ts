import createEvent from '../util/decorators/createEvent';
import { BaseEvent } from '../structures/BaseEvent';

@createEvent({ name: 'ready', target: 'client' })
export default class Ready extends BaseEvent {
    public async execute(): Promise<void> {
        this.logger.info(`Connected to ${this.client.user?.tag}!`);
    }
}
