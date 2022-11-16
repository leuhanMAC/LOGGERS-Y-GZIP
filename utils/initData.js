import { chatSchema } from "../modules/chat.js";
import { productSchema } from "../modules/products.js";
import Container from "../container/index.js";
import yargs from 'yargs';
import pino from 'pino';

const args = yargs(process.argv.slice(2)).default({ port: 8080, mode: 'FORK' }).alias({ p: 'port', m: 'mode' }).argv;
const productFiles = new Container("product", productSchema);
const chat = new Container("chat", chatSchema);

const logger = pino({});

export {
    productFiles,
    chat,
    args,
    logger
}