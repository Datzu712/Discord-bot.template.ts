import { CommandParamTypes } from '../enums/command-paramtypes.enum';
import { COMMAND_ARGS_METADATA } from '../utils/constants';

import 'reflect-metadata';

function createCommandParamDecorator(paramtype: CommandParamTypes): ParameterDecorator {
    return (target, key, index) => {
        const args = Reflect.getMetadata(COMMAND_ARGS_METADATA, target.constructor, key) || [];
        Reflect.defineMetadata(COMMAND_ARGS_METADATA, [...args, { type: paramtype, index }], target.constructor, key);
    };
}

/**
 * Command handler parameter decorator. Extracts the `Message` object
 * from the event `MessageCreate.
 *
 * Example: `execute(@Message() message)`
 */
export const Message = createCommandParamDecorator(CommandParamTypes.MESSAGE);

/**
 * Command handler parameter decorator. Extracts the arguments of the command splitting
 * the message by spaces.
 *
 * Example: `execute(@Args() args: string[])`
 */
export const Args = createCommandParamDecorator(CommandParamTypes.ARGS);

/**
 * Command handler parameter decorator. Extracts the `CommandInteraction`
 * object from the event `interactionCreate`.
 */

export const Msg = Message;
