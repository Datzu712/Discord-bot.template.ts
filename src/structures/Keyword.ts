export interface KeywordOptions {
    name: string;

    aliases: string[] | null;

    description: string | null;

    inputType: {
        url?: boolean;
        number?: boolean;
        string?: boolean;
        boolean?: boolean;
        channel?: boolean;
        role?: boolean;
        user?: boolean;
        member?: boolean;
    };
    displayErrors: boolean;
    prefix: string;

    enabled: boolean;

    required: boolean;

    global?: boolean;
}

export class Keyword implements KeywordOptions {
    /** Keyword name. */
    public name: string;

    /** Keyword aliases. */
    public aliases: string[] | null;

    /** Keyword description. */
    public description: string | null;

    /** Keyword  */
    public enabled: boolean;

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

    /** If it is enabled, bot will send an error to the user when a input type is not fulfilled. */
    public displayErrors: boolean;
    /**
     * @desc Keyword prefix. Default --
     * @example <prefix>keyword <input>
     */
    public prefix: string;

    public required: boolean;

    /**
     * @param { KeywordOptions } options - Keyword options.
     */
    constructor({
        name,
        aliases,
        description,
        inputType,
        displayErrors,
        prefix,
        enabled,
        required,
    }: RequireAtLeastOneOf<KeywordOptions>) {
        if (!name || !inputType) {
            const missingArgument = !name ? 'name' : 'inputType';
            throw new Error(`Keyword ${missingArgument} is required. (KeywordOptions.${missingArgument})`);
        }

        if (Object.keys(inputType).length === 0) {
            throw new Error(`Keyword inputType must be a single or more type. (Expected 1+)`);
        }
        this.name = name;
        this.aliases = aliases ?? null;
        this.description = description ?? null;
        this.inputType = inputType;
        this.displayErrors = displayErrors ?? false;
        this.prefix = prefix ?? '--';
        this.enabled = enabled ?? true;
        this.required = required ?? false;
    }
}
