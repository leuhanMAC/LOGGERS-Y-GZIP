import { chatSchema } from "../modules/chat.js";
import { productSchema } from "../modules/products.js";
import Container from "../container/index.js";
import yargs from 'yargs';
import pino from 'pino';
import PinoPretty from "pino-pretty";

const args = yargs(process.argv.slice(2)).default({ port: 8080, mode: 'FORK' }).alias({ p: 'port', m: 'mode' }).argv;
const productFiles = new Container("product", productSchema);
const chat = new Container("chat", chatSchema);

const createSonicBoom = (dest) =>
    pino.destination({ dest: dest, append: true, sync: true })

const streams = [
    {
        stream: PinoPretty({
            colorize: true,
            sync: true,
        })
    },
    {
        level: 'warn',
        stream: createSonicBoom('./warn.log')
    },
    {
        level: 'error',
        stream: createSonicBoom('./error.log')
    }
];


const logger = pino({
    level: 'info'
}, pino.multistream(streams));

export {
    productFiles,
    chat,
    args,
    logger
}