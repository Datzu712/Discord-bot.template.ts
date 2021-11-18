/* eslint-disable @typescript-eslint/ban-ts-comment */
import { WriteStream, createWriteStream } from 'fs';
import { existsSync, mkdir } from 'fs-extra';
import moment from 'moment';
import { reset, cyan, red, yellow } from '../util/colors';

// Maybe in the future there may be more logger levels, like "debug", "notice" and others...
export enum LoggerLevel {
    info = 1,
    warn = 2,
    error = 3
}

export default class Logger {

    /** Date format */
    public dateFormat: Intl.DateTimeFormat;

    /** Function to notify errors. (on sentry or others...) */
    public notifier: likeFunction;

    constructor(public folderLogsPath: string, notifier?: likeFunction) {
        this.dateFormat = Intl.DateTimeFormat('en', { 
            dateStyle: 'short', 
            timeStyle: 'medium', 
            hour12: false 
        });

        // If not notifier was provided, assign empty function
        this.notifier = notifier || (() => undefined);
    }

    /**
    * Write a 'log' level log.
    * @param { string } message - The message to log.
    * @param { LoggerLevel } level - The level of the log.
    */
    private write(message: string, level: LoggerLevel): void {
        const file = this.getFileLog(level);
        file.write(`${message}\n`);
    }

    /**
    * Write an 'error' level log.
    * @param { Error } Error - The Error to log.
    * @param { boolean } onlyConsole - If the error should be logged only in console.
    */
    public error(error: Error, onlyConsole?: boolean): void {
        //this.log(JSON.stringify(error), LoggerLevel.error);
        
        if(this.notifier && !onlyConsole)
            this.notifier(error);

        console.log(`${red}[${this.dateFormat.format(Date.now())}] [error] ${error.stack}`, reset);
        if(!onlyConsole)
            this.write(`[${this.dateFormat.format(Date.now())}] [error] ${error.stack}`, LoggerLevel.error);
    }

    /**
    * Write a 'warn' level log.
    * @param { string } message - The message to log.
    * @param { boolean } onlyConsole - If the warning should be logged only in console.
    */
    public warn(message: string, onlyConsole?: boolean): void {

        console.log(`${yellow}[${this.dateFormat.format(Date.now())}] [warn] ${message}`, reset);

        if(!onlyConsole)
            this.write(`[${this.dateFormat.format(Date.now())}] [warn] ${message}`, LoggerLevel.warn);
    }

    /**
     * Write an 'info' level log.
     * @param { string } message - The message to log.
     * @param { boolean } onlyConsole - If the info should be logged only in console.
     */
    public info(message: string, onlyConsole?: boolean): void {

        console.log(`${cyan}[${this.dateFormat.format(Date.now())}] [info] ${message}`, reset);

        if(!onlyConsole)
            this.write(`[${this.dateFormat.format(Date.now())}] [info] ${message}`, LoggerLevel.info);
    }

    /**
     * Get the file log by level.
     * @param { LoggerLevel } LoggerLevel - The level of the log.
     * @returns { WriteStream } WriteStream - The file log.
     */
    private getFileLog(level: LoggerLevel): WriteStream {

        if(!existsSync(this.folderLogsPath))
            mkdir(this.folderLogsPath);

        return createWriteStream(`${this.folderLogsPath}/${this.displayFilePrefix()}${(level === LoggerLevel.error) ? '-error' : ''}.log`, { flags: 'a' });
    }

    /**
     * Gets the prefix file by actual date like: `06-11-2021`
     * @returns { string } string - The prefix of file log.
     */
    private displayFilePrefix(): string {
        return `${moment().subtract(10, 'days').calendar().replaceAll('/', '-')}`;
    }

    public setNotifier(newNotifier: likeFunction): void {
        this.notifier = newNotifier;
    }
}