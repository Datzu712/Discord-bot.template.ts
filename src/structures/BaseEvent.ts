/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import djs from 'discord.js';
import Client from "./Client";

export abstract class BaseEvent {
    constructor(public client: Client, public name: keyof djs.ClientEvents) {}

    public execute(...args: any): any {}
    
}