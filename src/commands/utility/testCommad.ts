import { BaseCommand } from '../../structures/BaseCommand';
import createCommand from '../../util/decorators/createCommand';

@createCommand({
    name: 'test',
    description: 'Test command',
    category: 'Utility',
    usage: 'test',
    guildOnly: false,
    aliases: ['test']
})
export class testCommand extends BaseCommand {}

console.log(new testCommand(undefined));