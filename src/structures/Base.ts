/* eslint-disable @typescript-eslint/no-explicit-any */
export interface logger {
    info: (message: any) => void;
    debug: (message: any) => void;
    error: (message: any) => void;
    warn: (message: any) => void;
    log: (message: any) => void;
}

export abstract class Base {
    protected logger!: logger;
    constructor(logger: logger = console) {
        this.logger = logger;
    }

    /**
     * Set the logger of the class.
     * @param { Logger } logger - Logger instance.
     */
    public setLogger(logger: logger): void {
        this.logger = logger;
    }
}
