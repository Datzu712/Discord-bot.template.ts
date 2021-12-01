import djs from 'discord.js';

class Client extends djs.Client {

    public commands: Map<string, unknown>;
    public categories: Map<string, unknown>;


    constructor(options: djs.ClientOptions) {
        super(options);

        this.commands = new Map();
        this.categories = new Map();
    }

    public async start(): Promise<void> {

        // a

    }

}

export default Client;