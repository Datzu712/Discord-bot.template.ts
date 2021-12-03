/* eslint-disable @typescript-eslint/no-unused-vars */
import { ICommand, BaseCommand, CommandTypes } from './BaseCommand';
import { SlashCommandBuilder } from '@discordjs/builders';
import Client from '../core/Client';
import { CommandInteraction, Message } from 'discord.js';

export interface IBaseSlashCommand extends ICommand {
    builder: SlashCommandBuilder;
    execute(interaction: CommandInteraction): Promise<void>;
}

export default class SlashCommand extends BaseCommand implements IBaseSlashCommand {

    static readonly type: CommandTypes = 'SLASH_COMMAND';
    public data: ICommand['data'];
    public builder: SlashCommandBuilder;

    public constructor(public readonly client: Client, data?: ICommand['data'], builder?: SlashCommandBuilder) {
        super(client, data);

        if(!data && !this.data || !builder && !this.builder) {
            throw new Error(`${(!data && !this.builder) ? 'Data' : 'builder'} is a required parameter, is marked optional only for decorators.`);
        }
            
        this.data = data;
        this.builder = builder;
    }

    public send(messageOptions: unknown): Promise<Message> {
        throw new Error('Method not implemented.');
    }

    public async execute(interaction: CommandInteraction) {
        throw new Error('Not implemented.');
    }
}