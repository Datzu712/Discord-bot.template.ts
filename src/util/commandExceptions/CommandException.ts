export default class CommandException extends Error {
    constructor(message: string) {
        super(message);

        this.name = '[CommandException]';
    }
}
