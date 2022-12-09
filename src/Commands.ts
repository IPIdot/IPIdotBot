import {Command} from "./Command";
import {Hello} from "./commands/Hello";
import {Ping} from "./commands/Ping";
import {Help} from "./commands/Help";
import {Nlp} from "./commands/Nlp";

/**
 * Container for all activated command
 */
export const Commands: Command[] = [
    Hello,
    Ping,
    Help,
    Nlp,
];