import { ICommand, BaseCommand } from "./BaseCommand";
//import djs from 'discord.js';
import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../core/Client';

interface IBaseSlashCommand extends ICommand {
    config: SlashCommandBuilder
}

export default abstract class extends BaseCommand implements IBaseSlashCommand {

    constructor(public client: Client, public data: ICommand['data'], public config: SlashCommandBuilder) {
        super(client, data);
    }
}