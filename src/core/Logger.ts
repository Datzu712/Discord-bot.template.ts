/* eslint-disable no-fallthrough */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { WriteStream, createWriteStream } from 'fs-extra';
import { existsSync, mkdir } from 'fs-extra';
import moment from 'moment';
import { reset, cyan, red, yellow, green, magenta } from '../util/colors';
import { inspect } from 'util';

export enum LoggerLevel {
    info = 1,
    warn = 2,
    error = 3,
    log = 4,
    debug = 5,
}

export interface LoggerOptions {
    /**
     * The directory to log to.
     */
    folderPath: string;
    /**
     * Allow the logger to write debug logs.
     */
    debugAllowed?: boolean;
    /**
     * Default logger context service.
     */
    defaultService?: string;
    /**
     * Logger log template.
     * @default '{timestamp} {service} {level} {message}'
     */
    textTemplate?: string;
}

export interface CreateLogMessageOptions {
    level: LoggerLevel;
    service?: string;
    message: any;
    console?: boolean;
}

export type LogExpressions = 'timestamp' | 'level' | 'service' | 'message';

export class Logger {
    /**
     * Write an `info` level log.
     * @param { any } message - The message to log.
     * @param { string } service - Name of the service.
     */
    public info!: (message: any, service?: string) => void;
    /**
     * Write an `debug` level log.
     * @param { any } message - The message to log.
     * @param { string } service - Name of the service.
     */
    public debug!: (message: any, service?: string) => void;
    /**
     * Write an `error` level log.
     * @param { any } error - The message to log.
     * @param { string } service - Name of the service.
     */
    public error!: (error: any, service?: string) => void;
    /**
     * Write an `warn` level log.
     * @param { any } message - The message to log.
     * @param { string } service - Name of the service.
     */
    public warn!: (message: any, service?: string) => void;
    /**
     * Write an `log` level log.
     * @param { any } message - The message to log.
     * @param { string } service - Name of the service.
     */
    public log!: (message: any, service?: string) => void;
    /**
     * Logger configuration.
     */
    private config: Required<LoggerOptions>;

    /**
     * @param { LoggerOptions } options - The logger configuration.
     */
    constructor(options: LoggerOptions) {
        this.config = {
            debugAllowed: options.debugAllowed ?? false,
            defaultService: options.defaultService ?? 'unknown',
            folderPath: options.folderPath,
            textTemplate: options.textTemplate ?? '{timestamp} {level} {service} {message}',
        };

        for (const log in LoggerLevel) {
            if (!Number(log)) {
                // Do not edit existing methods.
                if (typeof this[log as keyof typeof LoggerLevel] === 'function') continue;
                this[log as keyof typeof LoggerLevel] = (
                    message: any,
                    service: string = this.config.defaultService,
                ) => {
                    this.defualtLogWriter(LoggerLevel[log as keyof typeof LoggerLevel], message, service);
                };
            }
        }
    }

    /**
     * Get the file log by level.
     * @param { LoggerLevel } level - The level of the log.
     * @returns { WriteStream } WriteStream - The file log.
     */
    private createWritableLogStream(level: LoggerLevel): WriteStream {
        if (!existsSync(this.config.folderPath)) mkdir(this.config.folderPath);

        let fileType: 'log' | 'debug' | 'error' = 'log';
        /*
            We divide each logs in different files (Error, debug and log).
            Error > only errors
            debug > only debug
            log > Rest of the logs (warn, info, log, etc)
        */
        if (level === LoggerLevel.debug || level === LoggerLevel.error) {
            fileType = level === LoggerLevel.debug ? 'debug' : 'error';
        }
        return createWriteStream(
            `${this.config.folderPath}/${moment().format('YYYY/MM/DD').replaceAll('/', '-')}${
                fileType === 'log' ? '' : `-${fileType}`
            }.log`,
            {
                flags: 'a',
            },
        );
    }

    /**
     * Write the log.
     * @param { string } message - The message to log.
     * @param { LoggerLevel } level - The level of the log.
     */
    private write(message: string, level: LoggerLevel): void {
        const file = this.createWritableLogStream(level);
        file.write(`${message}\n`);
        file.close();
    }

    /**
     * Crate text log.
     * @param { LoggerLevel } level - The level of the log.
     * @param { any } message - The message to log.
     * @param { string } service - The service of the log.
     */
    private defualtLogWriter(level: LoggerLevel, message: any, service: string = this.config.defaultService): void {
        if (!this.config.debugAllowed && level === LoggerLevel.debug) return;

        console.log(this.createLogMessage({ level, message: message, service, console: true }));
        this.write(this.createLogMessage({ level, message: message, service, console: false }), level);
    }

    /**
     * Crate text log.
     * @param { CreateLogMessageOptions } options - The level of the log.
     */
    private createLogMessage(options: CreateLogMessageOptions): string {
        let logMessage = this.config.textTemplate;
        /*
            Match expressions like <string:number> in the message.
        */
        const matchedExpressions = logMessage.match(/{[a-zA-Z]+([:0-9]?)+}/g) ?? [];
        /*
            Map of valid expressions with their space count. 
            Map (3) {
                'date': 5,           5 Spaces after the date
                'level': 4,          4 Spaces after the level
                'serviceName': NaN,  No Spaces after the serviceName
            }

            The space after word is depeding on the length of the word.
         */
        const validExpressions: Map<LogExpressions, number> = new Map();

        for (const expression of matchedExpressions) {
            /**
             * Match the expression and get the word and the space count.
             * EJ:
             * ["{timestamp:1}", 5];
             *       0           1
             *  expression    spaceCount
             */
            const evaluatedExpression = /{[a-zA-Z]+([:0-9]?)+}/g.exec(expression);
            if (!evaluatedExpression) continue;
            // Set the values in the map.
            validExpressions.set(
                evaluatedExpression.input.replace(/{|}|:|[:0-9]/g, '') as LogExpressions,
                parseInt(evaluatedExpression.input.replace(/\D/g, '')),
            );
        }
        for (const [expression, spaceCount] of validExpressions) {
            let replacedString = '';
            let color = '';

            if (expression === 'timestamp') {
                replacedString = moment().format('YYYY/MM/DD LT');
                color = green;
            } else if (expression === 'level') {
                replacedString = LoggerLevel[options.level]?.toUpperCase();
                color =
                    options.level === LoggerLevel.error
                        ? red
                        : options.level === LoggerLevel.warn
                        ? yellow
                        : options.level === LoggerLevel.debug
                        ? magenta
                        : options.level === LoggerLevel.info
                        ? green
                        : cyan;
            } else if (expression === 'service') {
                // If the service is not defined, use the default service.
                replacedString = options.service ?? this.config.defaultService;
                color = red;
            } else if (expression === 'message') {
                // If the message is not a string, we try to inspect it (convert into a object).
                replacedString =
                    typeof options.message === 'string'
                        ? options.message
                        : inspect(options.message, { colors: options.console ?? false, depth: null });
            }
            /**
             * Calculate the spaces to add to the string.
             * The idea is substract the spaceCount from the length of the replacedString
             * and if it is 0 or less, it will be 0.
             * EJ:
             *  replacedString = 'log';
             *  spaceCount = 5;
             *
             *  (3 means the length of the replacedString)
             *             5       -          3                 = 2
             *  spaces = spaceCount - replacedString.length; // = 2
             *
             * 2 spaces will be added to the string.
             */
            const spaces = spaceCount - replacedString.length <= 0 ? 0 : spaceCount - replacedString.length;
            logMessage = logMessage.replace(
                spaceCount ? `{${expression}:${spaceCount}}` : `{${expression}}`,
                `${options.console ? `${color}${replacedString}${reset}` : replacedString}${' '.repeat(spaces ?? 0)}`,
            );
        }
        return logMessage;
    }
}
