import createEvent from '../util/decorators/createEvent';
import BaseEvent from '../structures/BaseEvent';

@createEvent({
    name: 'ready',
    type: 'djs',
})
export default class ReadyEvent extends BaseEvent {
    public execute(): void {
        this.client.logger.log(`${this.client.user?.tag} is ready!`, 'ready');
    }
}
