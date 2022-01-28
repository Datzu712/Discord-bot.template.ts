import Client from '../core/Client';
import { BaseCommand } from '../structures/BaseCommand';

export default class CommandHandler {
    constructor(public readonly client: Client) {}

    // todo
    private createChart(command: BaseCommand) {
        // Create MongoDB charts for commands (:
        command;
    }

    public async run() {
        // todo
    }
}
