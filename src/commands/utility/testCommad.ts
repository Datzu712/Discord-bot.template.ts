import { BaseCommand, ExecuteCommandOptions } from '../../structures/BaseCommand';
import createCommand from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends BaseCommand {
    public async execute({ msg }: ExecuteCommandOptions): Promise<void> {
        return void msg.channel.send('test');
    }
}
