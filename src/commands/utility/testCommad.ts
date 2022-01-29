import { Keyword } from '../../structures/Keywords';
import { ChannelCommand, ChannelExecuteContext as context } from '../../structures/ChannelCommand';
import { createCommand } from '../../util/decorators/createCommand';
import { addKeywords } from '../../util/decorators/createKeywords';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'test',
    usage: 'test',
    guildOnly: false,
    aliases: ['test'],
})
export default class testCommand extends ChannelCommand {
    @addKeywords('--', [
        {
            name: 'test',
            aliases: ['test'],
            description: 'Test command',
            inputType: { string: true },
            displayErrors: true,
        },
    ])
    public keywords!: Keyword[];

    public async execute({ msg }: context): Promise<void> {
        msg;
    }
}
