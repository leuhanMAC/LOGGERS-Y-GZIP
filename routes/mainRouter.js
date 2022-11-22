import { chat, productFiles, args, logger } from "../utils/initData.js";
import { Router } from "express";
import { cpus } from 'os';

export const mainRouter = Router();

mainRouter.get("/", async (req, res) => {
    logger.info('GET /');
    let products;
    let messages;
    try {
        products = await productFiles.getAll();
        messages = await chat.getAll();
    } catch (error) {
        logger.error(`Error to get products and chat messages: ${error}`)
    }

    const username = req.session.username || '';


    res.render("homepage", {
        username,
        products,
        messages,
        emptyProducts: !Boolean(products.length),
    });
});

mainRouter.get("/chat", async (req, res) => {
    logger.info('GET /chat');
    let messages;
    try {
        messages = await chat.getAll();

    } catch (error) {
        logger.error(`Error to get chat messages: ${error}`)
    }

    const username = req.session.username || '';

    res.render("chat", {
        messages,
        username
    });
});

mainRouter.get("/info", async (req, res) => {
    logger.info('GET /info');

    const info = {
        inputArgs: JSON.stringify(args, null, 3),
        plataformName: process.platform,
        nodeVersion: process.version,
        rss: process.memoryUsage().rss + ' Bytes',
        executionPath: process.title,
        numCPUS: cpus().length,
        processID: process.pid,
        projectFolder: process.cwd()
    }

    const username = req.session.username || '';

    if (req.query.console === 'true') {
        console.log(info);
    }

    res.render("info", { info, username });
});

mainRouter.get("/api/productos", async (req, res) => {
    logger.info('GET /api/productos');

    let products;
    try {
        products = await productFiles.getAll();
    } catch (error) {
        logger.error(`Error to get products: ${error}`);
    }


    res.json(products);
    res.end();
});

mainRouter.get("/register", async (req, res) => {
    logger.info('GET /register');
    res.render("register");
});
mainRouter.get("/login", async (req, res) => {
    logger.info('GET /login');
    res.render("login");
});

mainRouter.get("/faillogin", async (req, res) => {
    logger.info('GET /faillogin');
    res.render("errorLogin");
});

mainRouter.get("/failregister", async (req, res) => {
    logger.info('GET /failregister');
    res.render("errorRegister");
})

mainRouter.get("/logout", async (req, res) => {
    logger.info('GET /logout');

    req.session.destroy(
        (err) => {
            if (err) {
                res.json(err);
            } else {
                res.redirect('/');
            }
        }
    )
});