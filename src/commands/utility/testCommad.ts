import { ChannelCommand, ChannelExecuteContext as context } from '../../structures/ChannelCommand';
import { createCommand } from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends ChannelCommand {
    public async execute({ msg }: context): Promise<void> {
        msg;
    }
}
