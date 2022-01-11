export interface KeywordOptions {
    name: string;

    aliases: string[] | null;

    description: string | null;

    usage: string | null;

    inputType: {
        url?: boolean;
        number?: boolean;
        string?: boolean;
        boolean?: boolean;
        channel?: boolean;
        role?: boolean;
        user?: boolean;
        member?: boolean;
        guild?: boolean;
    };
    displayErrors: boolean;
}

export class KeywordManager implements KeywordOptions {
    /** Keyword name. */
    public name: string;

    /** Keyword aliases. */
    public aliases: string[] | null;

    /** Keyword description. */
    public description: string | null;

    /** Keyword usage. */
    public usage: string | null;

    /** Base on the input type, we throw an error (if KeywordOptions.displayErrors is enabled). (--keyword input) */
    public inputType: {
        /**  */
        url?: boolean;
        number?: boolean;
        string?: boolean;
        boolean?: boolean;
        channel?: boolean;
        role?: boolean;
        user?: boolean;
        member?: boolean;
        guild?: boolean;
    };

    /** If it is enabled, bot will throw an error when a input type is not fulfilled. */
    public displayErrors = false;
    /**
     * @desc Keyword prefix. Default --
     * @example <prefix>keyword <input>
     */
    public prefix = '--';

    /**
     * @param { KeywordOptions } options - Keyword options.
     */
    constructor({ name, aliases, description, usage, inputType, displayErrors }: RequireAtLeastOneOf<KeywordOptions>) {
        if (!name || !inputType) {
            throw new Error(
                `Keyword ${!name ? 'name' : 'inputType'} is required. (KeywordOptions.${!name ? 'name' : 'inputType'})`,
            );
        }
        if (Object.keys(inputType).length >= 0 || Object.keys(inputType).length > 1) {
            // idk if we could accept more than one input type.
            throw new Error(
                `Keyword inputType must be a single type. Received ${Object.keys(inputType).length} (Expected 1)`,
            );
        }
        this.name = name;
        this.aliases = aliases ?? null;
        this.description = description ?? null;
        this.usage = usage ?? null;
        this.inputType = inputType;
        this.displayErrors = displayErrors ?? false;
    }
}
