import type { basicLogger } from './Logger';

export default class Base {
    constructor(protected logger: basicLogger = console) {}

    public setLogger = (logger: basicLogger): void => {
        this.logger = logger;
    };

    public toJSON = (indentation?: boolean): string => {
        return indentation ? JSON.stringify(this, null, 4) : JSON.stringify(this);
    };
}
